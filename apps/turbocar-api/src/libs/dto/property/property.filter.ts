// property.filter.ts
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, Min, IsIn, IsNotEmpty } from 'class-validator';
import type { ObjectId } from 'mongoose';

import {
	PropertyLocation,
	PropertyType,
	PropertyCondition,
	PropertyFuelType,
	PropertyTransmission,
	PropertyFeatures,
	PropertyBrand,
	PropertyCylinders,
	PropertyColor,
	PropertyStatus,
} from '../../enums/property.enum';
import { Direction } from '../../enums/common.enum';
import { availablePropertySorts } from '../../config';

// ==================================================
// MAIN PUBLIC SEARCH (Home Page, Car Search Page)
// ==================================================
@InputType()
export class PropertySearchFilter {
	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: ObjectId;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	rentStartDate?: Date;

	@IsOptional()
	@Field(() => [PropertyLocation], { nullable: true })
	locationList?: PropertyLocation[];

	@IsOptional()
	@Field(() => [PropertyType], { nullable: true })
	typeList?: PropertyType[];

	@IsOptional()
	@Field(() => [PropertyCondition], { nullable: true })
	conditionList?: PropertyCondition[];

	@IsOptional()
	@Field(() => [PropertyFuelType], { nullable: true })
	fuelTypeList?: PropertyFuelType[];

	@IsOptional()
	@Field(() => [PropertyTransmission], { nullable: true })
	transmissionList?: PropertyTransmission[];

	@IsOptional()
	@Field(() => [PropertyFeatures], { nullable: true })
	featuresList?: PropertyFeatures[];

	@IsOptional()
	@Field(() => [PropertyBrand], { nullable: true })
	brandList?: PropertyBrand[];

	@IsOptional()
	@Field(() => [PropertyCylinders], { nullable: true })
	cylindersList?: PropertyCylinders[];

	@IsOptional()
	@Field(() => [PropertyColor], { nullable: true })
	colorList?: PropertyColor[];

	@IsOptional()
	@Field(() => Int, { nullable: true })
	minPrice?: number;

	@IsOptional()
	@Field(() => Int, { nullable: true })
	maxPrice?: number;

	@IsOptional()
	@Field(() => Int, { nullable: true })
	minMileage?: number;

	@IsOptional()
	@Field(() => Int, { nullable: true })
	maxMileage?: number;

	@IsOptional()
	@Field(() => Int, { nullable: true })
	minYear?: number;

	@IsOptional()
	@Field(() => Int, { nullable: true })
	maxYear?: number;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	isForSale?: boolean;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	isForRent?: boolean;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

// ==================================================
// PUBLIC PROPERTIES INQUIRY
// ✅ CHANGED: filter → search
// ==================================================
@InputType()
export class PropertiesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availablePropertySorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => PropertySearchFilter)
	search: PropertySearchFilter; // ✅ CHANGED: filter → search
}

// ==================================================
// AGENT (DEALER) SEARCH
// ==================================================
@InputType()
class AgentSearchFilter {
	@IsOptional()
	@Field(() => PropertyStatus, { nullable: true })
	propertyStatus?: PropertyStatus;

	@IsOptional()
	@Field(() => [PropertyLocation], { nullable: true })
	propertyLocationList?: PropertyLocation[];

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	isForSale?: boolean;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	isForRent?: boolean;
}

// ==================================================
// AGENT PROPERTIES INQUIRY
// ==================================================
@InputType()
export class AgentPropertiesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availablePropertySorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => AgentSearchFilter)
	search: AgentSearchFilter;
}

// ==================================================
// ADMIN SEARCH (View All Cars)
// ==================================================
@InputType()
class AllCarSearchFilter {
	@IsOptional()
	@Field(() => PropertyStatus, { nullable: true })
	propertyStatus?: PropertyStatus;

	@IsOptional()
	@Field(() => [PropertyBrand], { nullable: true })
	brandList?: PropertyBrand[];

	@IsOptional()
	@Field(() => [PropertyLocation], { nullable: true })
	propertyLocationList?: PropertyLocation[];

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	isForSale?: boolean;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	isForRent?: boolean;
}

// ==================================================
// ADMIN PROPERTIES INQUIRY
// ==================================================
@InputType()
export class AllPropertiesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availablePropertySorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => AllCarSearchFilter)
	search: AllCarSearchFilter;
}

// ==================================================
// ORDINARY INQUIRY (FAVORITES, VISITED, LIKED LISTS)
// ==================================================
@InputType()
export class OrdinaryInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;
}
