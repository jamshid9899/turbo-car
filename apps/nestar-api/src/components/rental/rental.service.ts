import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { PropertyService } from '../property/property.service';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { RentalStatus } from '../../libs/enums/rental-booking.enum';
import { RentalBookingInput } from '../../libs/dto/rent/rental.input';
import { RentalBooking } from '../../libs/dto/rent/rental.dto';

@Injectable()
export class RentalService {
  constructor(
    @InjectModel('RentalBooking') private rentalModel: Model<RentalBooking>,
    private memberService: MemberService,
    private propertyService: PropertyService,
  ) {}

  /** CREATE RENTAL BOOKING */
  async createRentalBooking(input: RentalBookingInput, renterId: ObjectId): Promise<RentalBooking> {
    const property = await this.propertyService.getProperty(null, shapeIntoMongoObjectId(input.propertyId));
    if (!property) throw new BadRequestException("Property not found");

    if (!property.isForRent) {
      throw new BadRequestException("This property is not available for rent");
    }

    /** NOTE: agent = property.memberId (owner) */
    const newRental = await this.rentalModel.create({
      ...input,
      renterId,
      ownerId: property.memberId,
    });

    return newRental;
  }

  /** GET RENTALS BY USER */
  async getMyRentals(memberId: ObjectId): Promise<RentalBooking[]> {
    return await this.rentalModel.find({ renterId: memberId }).sort({ createdAt: -1 }).lean();
  }

  /** GET RENTALS FOR OWNER (AGENT) */
  async getOwnerRentals(ownerId: ObjectId): Promise<RentalBooking[]> {
    return await this.rentalModel.find({ ownerId }).sort({ createdAt: -1 }).lean();
  }

  /** CANCEL RENTAL */
  async cancelRental(rentalId: string, memberId: ObjectId): Promise<RentalBooking> {
    const rental = await this.rentalModel.findOne({
      _id: shapeIntoMongoObjectId(rentalId),
      renterId: memberId,
    });

    if (!rental) throw new BadRequestException("Rental not found");

    rental.rentalStatus = RentalStatus.CANCELLED;
    return rental.save();
  }

  /** FINISH RENTAL */
  async finishRental(rentalId: string, memberId: ObjectId): Promise<RentalBooking> {
    const rental = await this.rentalModel.findOne({
      _id: shapeIntoMongoObjectId(rentalId),
      ownerId: memberId,
    });

    if (!rental) throw new BadRequestException("Rental not found");

    rental.rentalStatus = RentalStatus.FINISHED;
    return rental.save();
  }
}



