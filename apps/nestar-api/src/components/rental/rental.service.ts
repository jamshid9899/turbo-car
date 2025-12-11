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
import { lookupMember } from '../../libs/config';

@Injectable()
export class RentalService {
  constructor(
    @InjectModel('RentalBooking') private rentalModel: Model<RentalBooking>,
    private memberService: MemberService,
    private propertyService: PropertyService,
  ) {}

  /** CREATE RENTAL BOOKING */
  async createRentalBooking(input: RentalBookingInput, renterId: ObjectId): Promise<RentalBooking> {
    const propertyId = shapeIntoMongoObjectId(input.propertyId);
    
    const property = await this.propertyService.getProperty(renterId, propertyId);
    if (!property) throw new BadRequestException("Property not found");

    if (!property.isForRent) {
      throw new BadRequestException("This property is not available for rent");
    }

    // CHECK OVERLAP
    const overlapping = await this.rentalModel.findOne({
      propertyId: propertyId,
      rentalStatus: { $in: [RentalStatus.PENDING, RentalStatus.CONFIRMED] },
      $or: [
        { 
          startDate: { $lte: input.endDate }, 
          endDate: { $gte: input.startDate } 
        },
        { 
          startDate: { $lte: input.startDate }, 
          endDate: { $gte: input.endDate } 
        },
      ]
    });

    if (overlapping) {
      throw new BadRequestException("Property already booked for this period");
    }

    // CREATE RENTAL
    const rental = await this.rentalModel.create({
      propertyId: propertyId,
      renterId: renterId,
      ownerId: property.memberId,
      rentalType: input.rentalType,
      startDate: input.startDate,
      endDate: input.endDate,
      totalPrice: input.totalPrice,
      rentalStatus: RentalStatus.PENDING,
    });

    // CONVERT TO PLAIN OBJECT
    const rentalObject = rental.toObject();
    
    // MANUAL POPULATE
    rentalObject.propertyData = await this.propertyService.getProperty(
      null, 
      shapeIntoMongoObjectId(rentalObject.propertyId)
    );
    rentalObject.renterData = await this.memberService.getMember(
      null, 
      shapeIntoMongoObjectId(rentalObject.renterId)
    );
    rentalObject.ownerData = await this.memberService.getMember(
      null, 
      shapeIntoMongoObjectId(rentalObject.ownerId)
    );

    return rentalObject;
  }

  /** CONFIRM RENTAL (OWNER ONLY) */
  async confirmRental(rentalId: ObjectId, ownerId: ObjectId): Promise<RentalBooking> {
    const rental = await this.rentalModel.findOneAndUpdate(
      {
        _id: rentalId,
        ownerId: ownerId,
        rentalStatus: RentalStatus.PENDING,
      },
      { rentalStatus: RentalStatus.CONFIRMED },
      { new: true, lean: true }
    ).exec();

    if (!rental) throw new BadRequestException("Rental not found or already processed");

    // UPDATE PROPERTY STATUS → RENTED
    await this.propertyService.updatePropertyByOwner(
      shapeIntoMongoObjectId(rental.ownerId),
      {
        _id: shapeIntoMongoObjectId(rental.propertyId),
        propertyStatus: PropertyStatus.RENTED,
        rentedUntil: rental.endDate,
      }
    );

    // MANUAL POPULATE
    rental.propertyData = await this.propertyService.getProperty(
      null, 
      shapeIntoMongoObjectId(rental.propertyId)
    );
    rental.renterData = await this.memberService.getMember(
      null, 
      shapeIntoMongoObjectId(rental.renterId)
    );
    rental.ownerData = await this.memberService.getMember(
      null, 
      shapeIntoMongoObjectId(rental.ownerId)
    );

    return rental;
  }

  /** GET RENTALS BY USER */
  async getMyRentals(memberId: ObjectId): Promise<RentalBooking[]> {
    const rentals = await this.rentalModel
      .find({ renterId: memberId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // MANUAL POPULATE
    return await Promise.all(
      rentals.map(async (rental) => {
        rental.propertyData = await this.propertyService.getProperty(
          null, 
          shapeIntoMongoObjectId(rental.propertyId)
        );
        rental.ownerData = await this.memberService.getMember(
          null, 
          shapeIntoMongoObjectId(rental.ownerId)
        );
        return rental;
      })
    );
  }

  /** GET RENTALS FOR OWNER (AGENT) */
  async getOwnerRentals(ownerId: ObjectId): Promise<RentalBooking[]> {
    const rentals = await this.rentalModel
      .find({ ownerId: ownerId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // MANUAL POPULATE
    return await Promise.all(
      rentals.map(async (rental) => {
        rental.propertyData = await this.propertyService.getProperty(
          null, 
          shapeIntoMongoObjectId(rental.propertyId)
        );
        rental.renterData = await this.memberService.getMember(
          null, 
          shapeIntoMongoObjectId(rental.renterId)
        );
        return rental;
      })
    );
  }

  /** CANCEL RENTAL */
  async cancelRental(rentalId: ObjectId, memberId: ObjectId): Promise<RentalBooking> {
    const existingRental = await this.rentalModel.findOne({
      _id: rentalId,
      $or: [{ renterId: memberId }, { ownerId: memberId }],
      rentalStatus: { $in: [RentalStatus.PENDING, RentalStatus.CONFIRMED] },
    }).lean().exec();

    if (!existingRental) throw new BadRequestException("Rental not found or cannot be cancelled");

    const wasConfirmed = existingRental.rentalStatus === RentalStatus.CONFIRMED;

    const rental = await this.rentalModel.findByIdAndUpdate(
      rentalId,
      { rentalStatus: RentalStatus.CANCELLED },
      { new: true, lean: true }
    ).exec();

    if (wasConfirmed) {
      await this.propertyService.updatePropertyByOwner(
        shapeIntoMongoObjectId(rental.ownerId),
        {
          _id: shapeIntoMongoObjectId(rental.propertyId),
          propertyStatus: PropertyStatus.ACTIVE,
          rentedUntil: null,
        }
      );
    }

    // MANUAL POPULATE
    rental.propertyData = await this.propertyService.getProperty(
      null, 
      shapeIntoMongoObjectId(rental.propertyId)
    );
    rental.renterData = await this.memberService.getMember(
      null, 
      shapeIntoMongoObjectId(rental.renterId)
    );
    rental.ownerData = await this.memberService.getMember(
      null, 
      shapeIntoMongoObjectId(rental.ownerId)
    );

    return rental;
  }

  /** FINISH RENTAL (OWNER ONLY) */
  async finishRental(rentalId: ObjectId, ownerId: ObjectId): Promise<RentalBooking> {
    const rental = await this.rentalModel.findOneAndUpdate(
      {
        _id: rentalId,
        ownerId: ownerId,
        rentalStatus: RentalStatus.CONFIRMED,
      },
      { rentalStatus: RentalStatus.FINISHED },
      { new: true, lean: true }
    ).exec();

    if (!rental) throw new BadRequestException("Rental not found or not confirmed");

    await this.propertyService.updatePropertyByOwner(
      shapeIntoMongoObjectId(rental.ownerId),
      {
        _id: shapeIntoMongoObjectId(rental.propertyId),
        propertyStatus: PropertyStatus.ACTIVE,
        rentedUntil: null,
      }
    );

    // MANUAL POPULATE
    rental.propertyData = await this.propertyService.getProperty(
      null, 
      shapeIntoMongoObjectId(rental.propertyId)
    );
    rental.renterData = await this.memberService.getMember(
      null, 
      shapeIntoMongoObjectId(rental.renterId)
    );
    rental.ownerData = await this.memberService.getMember(
      null, 
      shapeIntoMongoObjectId(rental.ownerId)
    );

    return rental;
  }

  /** ************************
   *    ADMIN OPERATIONS     *
   **************************/

  /** GET ALL RENTALS BY ADMIN */
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
            lookupMember,
            { $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
          ],
          metaCounter: [{ $count: 'total' }],
        },
      },
    ]);

    const rentals = result[0].list;
    const populatedRentals = await Promise.all(
      rentals.map(async (rental) => {
        rental.propertyData = await this.propertyService.getProperty(
          null,
          shapeIntoMongoObjectId(rental.propertyId)
        );
        rental.renterData = await this.memberService.getMember(
          null,
          shapeIntoMongoObjectId(rental.renterId)
        );
        rental.ownerData = await this.memberService.getMember(
          null,
          shapeIntoMongoObjectId(rental.ownerId)
        );
        return rental;
      })
    );

    return {
      list: populatedRentals,
      metaCounter: result[0].metaCounter[0] || { total: 0 },
    };
  }

  /** UPDATE RENTAL BY ADMIN */
  async updateRentalByAdmin(rentalId: ObjectId): Promise<RentalBooking> {
    const rental = await this.rentalModel.findByIdAndUpdate(
      rentalId,
      { rentalStatus: RentalStatus.CANCELLED },
      { new: true, lean: true }
    ).exec();

    if (!rental) throw new BadRequestException("Rental not found");

    rental.propertyData = await this.propertyService.getProperty(
      null,
      shapeIntoMongoObjectId(rental.propertyId)
    );
    rental.renterData = await this.memberService.getMember(
      null,
      shapeIntoMongoObjectId(rental.renterId)
    );
    rental.ownerData = await this.memberService.getMember(
      null,
      shapeIntoMongoObjectId(rental.ownerId)
    );

    return rental;
  }

  /** REMOVE RENTAL BY ADMIN */
  async removeRentalByAdmin(rentalId: ObjectId): Promise<RentalBooking> {
    const rental = await this.rentalModel.findByIdAndDelete(rentalId).lean().exec();

    if (!rental) throw new BadRequestException("Rental not found");

    rental.propertyData = await this.propertyService.getProperty(
      null,
      shapeIntoMongoObjectId(rental.propertyId)
    );
    rental.renterData = await this.memberService.getMember(
      null,
      shapeIntoMongoObjectId(rental.renterId)
    );
    rental.ownerData = await this.memberService.getMember(
      null,
      shapeIntoMongoObjectId(rental.ownerId)
    );

    return rental;
  }
}