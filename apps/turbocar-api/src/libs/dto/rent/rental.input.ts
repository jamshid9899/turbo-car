import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty, IsEnum, IsOptional, Min, Max, IsDateString, IsNumber } from "class-validator";
import { RentalType, RentalStatus } from "../../enums/rental-booking.enum";

/** ✅ RENTAL BOOKING INPUT - Validation yaxshilangan */
@InputType()
export class RentalBookingInput {
  @IsNotEmpty()
  @Field(() => String)
  propertyId: string;

  @IsNotEmpty()
  @IsDateString()  // ✅ FIXED
  @Field(() => String)
  startDate: string;

  @IsNotEmpty()
  @IsDateString()  // ✅ FIXED
  @Field(() => String)
  endDate: string;

  @IsNotEmpty()
  @IsEnum(RentalType)
  @Field(() => RentalType)
  rentalType: RentalType;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Number)
  totalPrice: number;
}

/** RENTAL BOOKING UPDATE */
@InputType()
export class RentalBookingUpdate {
  @IsNotEmpty()
  @Field(() => String)
  _id: string;

  @IsEnum(RentalStatus)
  @Field(() => RentalStatus)
  rentalStatus: RentalStatus;
}

/** RENTAL SEARCH */
@InputType()
export class RentalSearch {
  @IsOptional()
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @Min(1)
  page?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true, defaultValue: 20 })
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Field(() => String, { nullable: true, defaultValue: 'createdAt' })
  sort?: string;

  @IsOptional()
  @Field(() => String, { nullable: true, defaultValue: 'DESC' })
  direction?: 'ASC' | 'DESC';

  @IsOptional()
  @Field(() => RentalStatus, { nullable: true })
  rentalStatus?: RentalStatus;

  @IsOptional()
  @Field(() => String, { nullable: true })
  propertyId?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  renterId?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  ownerId?: string;
}

/** RENTALS INQUIRY */
@InputType()
export class RentalsInquiry {
  @IsNotEmpty()
  @Field(() => RentalSearch)
  search: RentalSearch;
}