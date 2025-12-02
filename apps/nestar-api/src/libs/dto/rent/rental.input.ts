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
  renterId: string;

  @Field()
  startDate: string;

  @Field()
  endDate: string;


  @IsNotEmpty()
  @Field(() => RentalType)
  rentalType: RentalType;

  @IsNotEmpty()
  @Field(() => Number)
  totalPrice: number;
}
