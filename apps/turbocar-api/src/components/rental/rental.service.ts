import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { PropertyService } from '../property/property.service';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { RentalStatus } from '../../libs/enums/rental-booking.enum';
import { RentalBookingInput, RentalsInquiry } from '../../libs/dto/rent/rental.input';
import { RentalBooking, Rentals } from '../../libs/dto/rent/rental.dto';
import { PropertyStatus } from '../../libs/enums/property.enum';

@Injectable()
export class RentalService {
	constructor(
		@InjectModel('RentalBooking') private rentalModel: Model<RentalBooking>,
		private memberService: MemberService,
		private propertyService: PropertyService,
	) {}

	/** ✅ CREATE RENTAL BOOKING - To'liq validation */
	async createRentalBooking(input: RentalBookingInput, renterId: ObjectId): Promise<RentalBooking> {
		const propertyId = shapeIntoMongoObjectId(input.propertyId);

		// ✅ DATE VALIDATION
		const now = new Date();
		const startDate = new Date(input.startDate);
		const endDate = new Date(input.endDate);

		if (startDate < now) {
			throw new BadRequestException('Start date cannot be in the past');
		}

		if (endDate <= startDate) {
			throw new BadRequestException('End date must be after start date');
		}

		// ✅ GET PROPERTY
		const property = await this.propertyService.getProperty(renterId, propertyId);
		if (!property) throw new BadRequestException('Property not found');

		if (!property.isForRent) {
			throw new BadRequestException('This property is not available for rent');
		}

		// ✅ CHECK MIN/MAX RENT DAYS
		const rentDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

		if (rentDays < property.minimumRentDays) {
			throw new BadRequestException(`Minimum rent period is ${property.minimumRentDays} days`);
		}

		if (property.maximumRentDays && rentDays > property.maximumRentDays) {
			throw new BadRequestException(`Maximum rent period is ${property.maximumRentDays} days`);
		}

		// ✅ CHECK OVERLAP WITH TRANSACTION
		const session = await this.rentalModel.db.startSession();
		session.startTransaction();

		try {
			const overlapping = await this.rentalModel
				.findOne({
					propertyId: propertyId,
					rentalStatus: { $in: [RentalStatus.PENDING, RentalStatus.CONFIRMED] },
					$or: [
						{
							startDate: { $lte: endDate },
							endDate: { $gte: startDate },
						},
					],
				})
				.session(session);

			if (overlapping) {
				throw new BadRequestException('Property already booked for this period');
			}

			// ✅ CREATE RENTAL
			const [rental] = await this.rentalModel.create(
				[
					{
						propertyId: propertyId,
						renterId: renterId,
						ownerId: property.memberId,
						rentalType: input.rentalType,
						startDate: startDate,
						endDate: endDate,
						totalPrice: input.totalPrice,
						rentalStatus: RentalStatus.PENDING,
					},
				],
				{ session },
			);

			await session.commitTransaction();

			// ✅ POPULATE DATA
			const rentalObject = rental.toObject();
			rentalObject.propertyData = property;
			rentalObject.renterData = await this.memberService.getMember(null, renterId);
			rentalObject.ownerData = await this.memberService.getMember(null, shapeIntoMongoObjectId(property.memberId));

			return rentalObject;
		} catch (error) {
			await session.abortTransaction();
			throw error;
		} finally {
			session.endSession();
		}
	}

	/** ✅ CONFIRM RENTAL */
	async confirmRental(rentalId: ObjectId, ownerId: ObjectId): Promise<RentalBooking> {
		const rental = await this.rentalModel
			.findOneAndUpdate(
				{
					_id: rentalId,
					ownerId: ownerId,
					rentalStatus: RentalStatus.PENDING,
				},
				{ rentalStatus: RentalStatus.CONFIRMED },
				{ new: true, lean: true },
			)
			.exec();

		if (!rental) throw new BadRequestException('Rental not found or already processed');

		// ✅ UPDATE PROPERTY STATUS → RENTED
		await this.propertyService.updatePropertyByOwner(shapeIntoMongoObjectId(rental.ownerId), {
			_id: shapeIntoMongoObjectId(rental.propertyId),
			propertyStatus: PropertyStatus.RENTED,
			rentedUntil: rental.endDate,
		});

		return await this.populateRental(rental);
	}

	/** ✅ GET MY RENTALS - Aggregation bilan */
	async getMyRentals(memberId: ObjectId): Promise<RentalBooking[]> {
		return await this.rentalModel
			.aggregate([
				{ $match: { renterId: memberId } },
				{ $sort: { createdAt: -1 } },
				{
					$lookup: {
						from: 'properties',
						localField: 'propertyId',
						foreignField: '_id',
						as: 'propertyData',
					},
				},
				{ $unwind: { path: '$propertyData', preserveNullAndEmptyArrays: true } },
				{
					$lookup: {
						from: 'members',
						localField: 'ownerId',
						foreignField: '_id',
						as: 'ownerData',
					},
				},
				{ $unwind: { path: '$ownerData', preserveNullAndEmptyArrays: true } },
			])
			.exec();
	}

	/** ✅ GET OWNER RENTALS - Aggregation bilan */
	async getOwnerRentals(ownerId: ObjectId): Promise<RentalBooking[]> {
		return await this.rentalModel
			.aggregate([
				{ $match: { ownerId: ownerId } },
				{ $sort: { createdAt: -1 } },
				{
					$lookup: {
						from: 'properties',
						localField: 'propertyId',
						foreignField: '_id',
						as: 'propertyData',
					},
				},
				{ $unwind: { path: '$propertyData', preserveNullAndEmptyArrays: true } },
				{
					$lookup: {
						from: 'members',
						localField: 'renterId',
						foreignField: '_id',
						as: 'renterData',
					},
				},
				{ $unwind: { path: '$renterData', preserveNullAndEmptyArrays: true } },
			])
			.exec();
	}

	/** ✅ CANCEL RENTAL */
	async cancelRental(rentalId: ObjectId, memberId: ObjectId): Promise<RentalBooking> {
		const existingRental = await this.rentalModel
			.findOne({
				_id: rentalId,
				$or: [{ renterId: memberId }, { ownerId: memberId }],
				rentalStatus: { $in: [RentalStatus.PENDING, RentalStatus.CONFIRMED] },
			})
			.lean()
			.exec();

		if (!existingRental) {
			throw new BadRequestException('Rental not found or cannot be cancelled');
		}

		const wasConfirmed = existingRental.rentalStatus === RentalStatus.CONFIRMED;

		const rental = await this.rentalModel
			.findByIdAndUpdate(rentalId, { rentalStatus: RentalStatus.CANCELLED }, { new: true, lean: true })
			.exec();

		if (wasConfirmed) {
			await this.propertyService.updatePropertyByOwner(shapeIntoMongoObjectId(rental.ownerId), {
				_id: shapeIntoMongoObjectId(rental.propertyId),
				propertyStatus: PropertyStatus.ACTIVE,
				rentedUntil: null,
			});
		}

		return await this.populateRental(rental);
	}

	/** ✅ FINISH RENTAL */
	async finishRental(rentalId: ObjectId, ownerId: ObjectId): Promise<RentalBooking> {
		const rental = await this.rentalModel
			.findOneAndUpdate(
				{
					_id: rentalId,
					ownerId: ownerId,
					rentalStatus: RentalStatus.CONFIRMED,
				},
				{ rentalStatus: RentalStatus.FINISHED },
				{ new: true, lean: true },
			)
			.exec();

		if (!rental) throw new BadRequestException('Rental not found or not confirmed');

		await this.propertyService.updatePropertyByOwner(shapeIntoMongoObjectId(rental.ownerId), {
			_id: shapeIntoMongoObjectId(rental.propertyId),
			propertyStatus: PropertyStatus.ACTIVE,
			rentedUntil: null,
		});

		return await this.populateRental(rental);
	}

	/** ************************
	 *    ADMIN OPERATIONS     *
	 **************************/

	/** ✅ GET ALL RENTALS BY ADMIN */
	async getAllRentalsByAdmin(input: RentalsInquiry): Promise<Rentals> {
		const { page = 1, limit = 20, sort = 'createdAt', direction = 'DESC' } = input.search;

		const match: any = {};
		const sortOption: any = {};
		sortOption[sort] = direction === 'DESC' ? -1 : 1;

		const result = await this.rentalModel.aggregate([
			{ $match: match },
			{ $sort: sortOption },
			{
				$facet: {
					list: [
						{ $skip: (page - 1) * limit },
						{ $limit: limit },
						{
							$lookup: {
								from: 'properties',
								localField: 'propertyId',
								foreignField: '_id',
								as: 'propertyData',
							},
						},
						{ $unwind: { path: '$propertyData', preserveNullAndEmptyArrays: true } },
						{
							$lookup: {
								from: 'members',
								localField: 'renterId',
								foreignField: '_id',
								as: 'renterData',
							},
						},
						{ $unwind: { path: '$renterData', preserveNullAndEmptyArrays: true } },
						{
							$lookup: {
								from: 'members',
								localField: 'ownerId',
								foreignField: '_id',
								as: 'ownerData',
							},
						},
						{ $unwind: { path: '$ownerData', preserveNullAndEmptyArrays: true } },
					],
					metaCounter: [{ $count: 'total' }],
				},
			},
		]);

		return {
			list: result[0].list,
			metaCounter: result[0].metaCounter[0] || { total: 0 },
		};
	}

	/** ✅ UPDATE RENTAL BY ADMIN */
	async updateRentalByAdmin(rentalId: ObjectId): Promise<RentalBooking> {
		const rental = await this.rentalModel
			.findByIdAndUpdate(rentalId, { rentalStatus: RentalStatus.CANCELLED }, { new: true, lean: true })
			.exec();

		if (!rental) throw new BadRequestException('Rental not found');

		return await this.populateRental(rental);
	}

	/** ✅ REMOVE RENTAL BY ADMIN */
	async removeRentalByAdmin(rentalId: ObjectId): Promise<RentalBooking> {
		const rental = await this.rentalModel.findByIdAndDelete(rentalId).lean().exec();

		if (!rental) throw new BadRequestException('Rental not found');

		return await this.populateRental(rental);
	}

	/** ✅ HELPER - Manual populate */
	private async populateRental(rental: any): Promise<RentalBooking> {
		rental.propertyData = await this.propertyService.getProperty(null, shapeIntoMongoObjectId(rental.propertyId));
		rental.renterData = await this.memberService.getMember(null, shapeIntoMongoObjectId(rental.renterId));
		rental.ownerData = await this.memberService.getMember(null, shapeIntoMongoObjectId(rental.ownerId));
		return rental;
	}
}
