import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { PropertyService } from '../property/property.service';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { RentalStatus } from '../../libs/enums/rental-booking.enum';
import { RentalBookingInput } from '../../libs/dto/rent/rental.input';
import { RentalBooking } from '../../libs/dto/rent/rental.dto';
import { PropertyStatus } from '../../libs/enums/property.enum';

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

    // ✅ CHECK OVERLAP - Bir vaqtda ikki booking bo'lmasligi uchun
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

    // ✅ CREATE RENTAL (ownerId property'dan olinadi)
    const newRental = await this.rentalModel.create({
      propertyId: propertyId,
      renterId: renterId,
      ownerId: property.memberId, // ✅ Property owner'ining ID'si
      rentalType: input.rentalType,
      startDate: input.startDate,
      endDate: input.endDate,
      totalPrice: input.totalPrice,
      rentalStatus: RentalStatus.PENDING,
    });

    return newRental;
  }

  /** CONFIRM RENTAL (OWNER ONLY) */
  async confirmRental(rentalId: ObjectId, ownerId: ObjectId): Promise<RentalBooking> {
    const rental = await this.rentalModel.findOne({
      _id: rentalId,
      ownerId: ownerId,
      rentalStatus: RentalStatus.PENDING,
    });

    if (!rental) throw new BadRequestException("Rental not found or already processed");

    // ✅ UPDATE RENTAL STATUS
    rental.rentalStatus = RentalStatus.CONFIRMED;
    await rental.save();

    // ✅ UPDATE PROPERTY STATUS → RENTED
    await this.propertyService.updatePropertyByOwner(
      shapeIntoMongoObjectId(rental.ownerId),
      {
        _id: shapeIntoMongoObjectId(rental.propertyId),
        propertyStatus: PropertyStatus.RENTED,
        rentedUntil: rental.endDate, // ✅ PropertyUpdate'da mavjud
      }
    );

    return rental;
  }

  /** GET RENTALS BY USER */
  async getMyRentals(memberId: ObjectId): Promise<RentalBooking[]> {
    return await this.rentalModel
      .find({ renterId: memberId })
      .sort({ createdAt: -1 })
      .lean();
  }

  /** GET RENTALS FOR OWNER (AGENT) */
  async getOwnerRentals(ownerId: ObjectId): Promise<RentalBooking[]> {
    return await this.rentalModel
      .find({ ownerId: ownerId })
      .sort({ createdAt: -1 })
      .lean();
  }

  /** CANCEL RENTAL (both renter and owner can cancel) */
  async cancelRental(rentalId: ObjectId, memberId: ObjectId): Promise<RentalBooking> {
    const rental = await this.rentalModel.findOne({
      _id: rentalId,
      $or: [{ renterId: memberId }, { ownerId: memberId }],
      rentalStatus: { $in: [RentalStatus.PENDING, RentalStatus.CONFIRMED] },
    });

    if (!rental) throw new BadRequestException("Rental not found or cannot be cancelled");

    const wasConfirmed = rental.rentalStatus === RentalStatus.CONFIRMED;

    // ✅ UPDATE RENTAL
    rental.rentalStatus = RentalStatus.CANCELLED;
    await rental.save();

    // ✅ IF WAS CONFIRMED, RELEASE PROPERTY
    if (wasConfirmed) {
      await this.propertyService.updatePropertyByOwner(
        shapeIntoMongoObjectId(rental.ownerId),
        {
          _id: shapeIntoMongoObjectId(rental.propertyId),
          propertyStatus: PropertyStatus.ACTIVE,
          rentedUntil: null, // ✅ PropertyUpdate'da mavjud
        }
      );
    }

    return rental;
  }

  /** FINISH RENTAL (OWNER ONLY) */
  async finishRental(rentalId: ObjectId, ownerId: ObjectId): Promise<RentalBooking> {
    const rental = await this.rentalModel.findOne({
      _id: rentalId,
      ownerId: ownerId,
      rentalStatus: RentalStatus.CONFIRMED,
    });

    if (!rental) throw new BadRequestException("Rental not found or not confirmed");

    // ✅ UPDATE RENTAL
    rental.rentalStatus = RentalStatus.FINISHED;
    await rental.save();

    // ✅ UPDATE PROPERTY STATUS → ACTIVE
    await this.propertyService.updatePropertyByOwner(
      shapeIntoMongoObjectId(rental.ownerId),
      {
        _id: shapeIntoMongoObjectId(rental.propertyId),
        propertyStatus: PropertyStatus.ACTIVE,
        rentedUntil: null, // ✅ PropertyUpdate'da mavjud
      }
    );

    return rental;
  }
}
