import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsDateString } from "class-validator";
import { RentalType } from "../../enums/rental-booking.enum";

@InputType()
export class RentalBookingInput {
  @IsNotEmpty()
  @Field(() => String)
  propertyId: string;

  @IsNotEmpty()
  @Field(() => String)
  ownerId: string;

  @IsDateString()
  @Field(() => Date)
  startDate: Date;

  @IsDateString()
  @Field(() => Date)
  endDate: Date;

  @IsNotEmpty()
  @Field(() => RentalType)
  rentalType: RentalType;

  @IsNotEmpty()
  @Field(() => Number)
  totalPrice: number;
}
