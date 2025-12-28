// property.update.ts
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsInt, Min, Length, IsArray, IsBoolean } from 'class-validator';
import type { ObjectId } from 'mongoose';
import {
	PropertyCondition,
	PropertyBrand,
	PropertyType,
	PropertyFuelType,
	PropertyColor,
	PropertyTransmission,
	PropertyFeatures,
	PropertyCylinders,
	PropertyLocation,
	PropertyStatus,
} from '../../enums/property.enum';

@InputType()
export class PropertyUpdate {
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => PropertyCondition, { nullable: true })
	propertyCondition?: PropertyCondition;

	@IsOptional()
	@Field(() => PropertyBrand, { nullable: true })
	propertyBrand?: PropertyBrand;

	@IsOptional()
	@Field(() => PropertyType, { nullable: true })
	propertyType?: PropertyType;

	@IsOptional()
	@Field(() => PropertyFuelType, { nullable: true })
	propertyFuelType?: PropertyFuelType;

	@IsOptional()
	@Field(() => PropertyStatus, { nullable: true })
	propertyStatus?: PropertyStatus;

	@IsOptional()
	@Field(() => PropertyLocation, { nullable: true })
	propertyLocation?: PropertyLocation;

	@IsOptional()
	@Field(() => PropertyColor, { nullable: true })
	propertyColor?: PropertyColor;

	@IsOptional()
	@Field(() => PropertyTransmission, { nullable: true })
	propertyTransmission?: PropertyTransmission;

	@IsOptional()
	@Field(() => [PropertyFeatures], { nullable: true })
	propertyFeatures?: PropertyFeatures[];

	@IsOptional()
	@Field(() => PropertyCylinders, { nullable: true })
	propertyCylinders?: PropertyCylinders;

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	propertyTitle?: string;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	propertyPrice?: number;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	propertyRentPrice?: number;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	propertyMileage?: number;

	@IsOptional()
	@IsInt()
	@Min(2)
	@Field(() => Int, { nullable: true })
	propertySeats?: number;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	propertyImages?: string[];

	@IsOptional()
	@Length(5, 500)
	@Field(() => String, { nullable: true })
	propertyDesc?: string;

	@IsOptional()
	@IsBoolean()
	@Field(() => Boolean, { nullable: true })
	isForSale?: boolean;

	@IsOptional()
	@IsBoolean()
	@Field(() => Boolean, { nullable: true })
	isForRent?: boolean;

	// ✅ RENTAL FIELDS
	@IsOptional()
	@Field(() => Date, { nullable: true })
	rentedUntil?: Date; // ✅ QO'SHILDI

	@IsOptional()
	@IsInt()
	@Min(1)
	@Field(() => Int, { nullable: true })
	minimumRentDays?: number;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Field(() => Int, { nullable: true })
	maximumRentDays?: number;

	// ✅ DATE FIELDS
	@IsOptional()
	@Field(() => Date, { nullable: true })
	soldAt?: Date;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	deletedAt?: Date;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	constructedAt?: Date;
}
