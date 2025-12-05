import { Field, ObjectType } from "@nestjs/graphql";
import { RentalStatus, RentalType } from "../../enums/rental-booking.enum";

@ObjectType()
export class RentalBooking {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  propertyId: string;

  @Field(() => String)
  renterId: string;

  @Field(() => String)
  ownerId: string;

  @Field(() => RentalType)
  rentalType: RentalType;

  @Field(() => RentalStatus)
  rentalStatus: RentalStatus;

  @Field(() => Date)
  startDate: Date;

  @Field(() => Date)
  endDate: Date;

  @Field(() => Number)
  totalPrice: number;

  @Field(() => Date)
  createdAt: Date;
  
  @Field(() => Date)
  updatedAt: Date;
}

