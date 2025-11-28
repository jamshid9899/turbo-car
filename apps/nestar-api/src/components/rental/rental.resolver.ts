import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { RentalService } from './rental.service';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import type { ObjectId } from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { RentalBooking } from '../../libs/dto/rent/rental.dto';
import { RentalBookingInput } from '../../libs/dto/rent/rental.input';

@Resolver()
export class RentalResolver {
  constructor(private readonly rentalService: RentalService) {}

  /** CREATE RENT */
  @UseGuards(AuthGuard)
  @Mutation(() => RentalBooking)
  async createRentalBooking(
    @Args('input') input: RentalBookingInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<RentalBooking> {
    return await this.rentalService.createRentalBooking(input, memberId);
  }

  /** MY RENTALS */
  @UseGuards(AuthGuard)
  @Query(() => [RentalBooking])
  async getMyRentals(
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<RentalBooking[]> {
    return await this.rentalService.getMyRentals(memberId);
  }

  /** AGENT/OWNER RENTALS */
  @UseGuards(AuthGuard)
  @Query(() => [RentalBooking])
  async getOwnerRentals(
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<RentalBooking[]> {
    return await this.rentalService.getOwnerRentals(memberId);
  }

  /** CANCEL RENT */
  @UseGuards(AuthGuard)
  @Mutation(() => RentalBooking)
  async cancelRental(
    @Args('rentalId') id: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<RentalBooking> {
    return await this.rentalService.cancelRental(id, memberId);
  }

  /** FINISH RENT */
  @UseGuards(AuthGuard)
  @Mutation(() => RentalBooking)
  async finishRental(
    @Args('rentalId') id: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<RentalBooking> {
    return await this.rentalService.finishRental(id, memberId);
  }
}

