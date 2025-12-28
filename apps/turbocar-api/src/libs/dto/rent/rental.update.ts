import { Field, InputType } from '@nestjs/graphql';
import { RentalStatus } from '../../enums/rental-booking.enum';
import { IsNotEmpty, IsEnum } from 'class-validator';

@InputType()
export class RentalBookingUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: string;

	@IsEnum(RentalStatus)
	@Field(() => RentalStatus)
	rentalStatus: RentalStatus;
}
