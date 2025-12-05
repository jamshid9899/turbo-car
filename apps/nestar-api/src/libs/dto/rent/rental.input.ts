import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import { RentalType } from "../../enums/rental-booking.enum";

@InputType()
export class RentalBookingInput {
  @IsNotEmpty()
  @Field(() => String)
  propertyId: string;

  @IsNotEmpty()
  @Field()
  startDate: string;

  @IsNotEmpty()
  @Field()
  endDate: string;

  @IsNotEmpty()
  @Field(() => RentalType)
  rentalType: RentalType;

  @IsNotEmpty()
  @Field(() => Number)
  totalPrice: number;
}


