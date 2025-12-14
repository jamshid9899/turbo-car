import { Field, ObjectType, Int } from "@nestjs/graphql";
import { RentalStatus, RentalType } from "../../enums/rental-booking.enum";
import { Property } from "../property/property";
import { Member } from "../member/member";

/** 
 * RENTAL TOTAL COUNTER
 * Rental pagination uchun counter
 * ⚠️ UNIQUE NAME - TotalCounter boshqa joyda ishlatilgan!
 */
@ObjectType()
export class RentalTotalCounter {
  @Field(() => Int)
  total: number;
}

/** 
 * RENTAL BOOKING (Single)
 * Bitta rental object
 */
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

  /** POPULATED FIELDS */
  @Field(() => Property, { nullable: true })
  propertyData?: Property;

  @Field(() => Member, { nullable: true })
  renterData?: Member;

  @Field(() => Member, { nullable: true })
  ownerData?: Member;
}

/** 
 * RENTALS (Paginated List)
 * Admin uchun pagination bilan
 */
@ObjectType()
export class Rentals {
  @Field(() => [RentalBooking])
  list: RentalBooking[];

  @Field(() => RentalTotalCounter)
  metaCounter: RentalTotalCounter;
}