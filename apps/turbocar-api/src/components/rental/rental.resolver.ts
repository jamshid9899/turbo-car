import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { RentalService } from './rental.service';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberType } from '../../libs/enums/member.enum';
import type { ObjectId } from 'mongoose';
import { RentalBooking, Rentals } from '../../libs/dto/rent/rental.dto';
import { RentalBookingInput, RentalsInquiry } from '../../libs/dto/rent/rental.input';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class RentalResolver {
	constructor(private readonly rentalService: RentalService) {}

	/** ************************
	 *    USER OPERATIONS      *
	 **************************/

	/** CREATE RENTAL BOOKING */
	@UseGuards(AuthGuard)
	@Mutation(() => RentalBooking)
	async createRentalBooking(
		@Args('input') input: RentalBookingInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<RentalBooking> {
		console.log('Mutation: createRentalBooking');
		return await this.rentalService.createRentalBooking(input, memberId);
	}

	/** CONFIRM RENTAL - Faqat property owner */
	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation(() => RentalBooking)
	async confirmRental(@Args('rentalId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<RentalBooking> {
		console.log('Mutation: confirmRental');
		const rentalId = shapeIntoMongoObjectId(input);
		return await this.rentalService.confirmRental(rentalId, memberId);
	}

	/** GET MY RENTALS */
	@UseGuards(AuthGuard)
	@Query(() => [RentalBooking])
	async getMyRentals(@AuthMember('_id') memberId: ObjectId): Promise<RentalBooking[]> {
		console.log('Query: getMyRentals');
		return await this.rentalService.getMyRentals(memberId);
	}

	/** GET OWNER RENTALS */
	@UseGuards(AuthGuard)
	@Query(() => [RentalBooking])
	async getOwnerRentals(@AuthMember('_id') memberId: ObjectId): Promise<RentalBooking[]> {
		console.log('Query: getOwnerRentals');
		return await this.rentalService.getOwnerRentals(memberId);
	}

	/** CANCEL RENTAL */
	@UseGuards(AuthGuard)
	@Mutation(() => RentalBooking)
	async cancelRental(@Args('rentalId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<RentalBooking> {
		console.log('Mutation: cancelRental');
		const rentalId = shapeIntoMongoObjectId(input);
		return await this.rentalService.cancelRental(rentalId, memberId);
	}

	/** FINISH RENTAL - Faqat owner */
	@UseGuards(AuthGuard)
	@Mutation(() => RentalBooking)
	async finishRental(@Args('rentalId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<RentalBooking> {
		console.log('Mutation: finishRental');
		const rentalId = shapeIntoMongoObjectId(input);
		return await this.rentalService.finishRental(rentalId, memberId);
	}

	/** ************************
	 *    ADMIN OPERATIONS     *
	 **************************/

	/** GET ALL RENTALS BY ADMIN */
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Rentals)
	async getAllRentalsByAdmin(@Args('input') input: RentalsInquiry): Promise<Rentals> {
		console.log('Query: getAllRentalsByAdmin');
		return await this.rentalService.getAllRentalsByAdmin(input);
	}

	/** UPDATE RENTAL BY ADMIN */
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => RentalBooking)
	async updateRentalByAdmin(@Args('input') input: string): Promise<RentalBooking> {
		console.log('Mutation: updateRentalByAdmin');
		const rentalId = shapeIntoMongoObjectId(input);
		return await this.rentalService.updateRentalByAdmin(rentalId);
	}

	/** REMOVE RENTAL BY ADMIN */
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => RentalBooking)
	async removeRentalByAdmin(@Args('rentalId') input: string): Promise<RentalBooking> {
		console.log('Mutation: removeRentalByAdmin');
		const rentalId = shapeIntoMongoObjectId(input);
		return await this.rentalService.removeRentalByAdmin(rentalId);
	}
}
