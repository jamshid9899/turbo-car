// property.dto.ts
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
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
	PropertyStatus,
	PropertyLocation,
} from '../../enums/property.enum';
import { Member } from '../member/member';
import { MeLiked } from '../like/like';

@ObjectType()
export class Property {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => PropertyCondition)
	propertyCondition: PropertyCondition;

	@Field(() => PropertyBrand)
	propertyBrand: PropertyBrand;

	@Field(() => PropertyType)
	propertyType: PropertyType;

	@Field(() => PropertyFuelType)
	propertyFuelType: PropertyFuelType;

	@Field(() => PropertyStatus)
	propertyStatus: PropertyStatus;

	@Field(() => PropertyLocation)
	propertyLocation: PropertyLocation;

	@Field(() => PropertyColor)
	propertyColor: PropertyColor;

	@Field(() => PropertyTransmission)
	propertyTransmission: PropertyTransmission;

	@Field(() => [PropertyFeatures])
	propertyFeatures: PropertyFeatures[];

	@Field(() => PropertyCylinders)
	propertyCylinders: PropertyCylinders;

	@Field(() => Int)
	propertyYear: number;

	@Field(() => String)
	propertyTitle: string;

	@Field(() => Float)
	propertyPrice: number;

	@Field(() => Float)
	propertyMileage: number;

	@Field(() => Int)
	propertyViews: number;

	@Field(() => Int)
	propertyLikes: number;

	@Field(() => Int)
	propertyComments: number;

	@Field(() => Int)
	propertyRank: number;

	@Field(() => [String])
	propertyImages: string[];

	@Field(() => String, { nullable: true })
	propertyDesc?: string;

	@Field(() => Float, { nullable: true })
	propertyRentPrice?: number;

	@Field(() => Int)
	propertySeats: number;

	@Field(() => Boolean)
	isForSale: boolean;

	@Field(() => Boolean)
	isForRent: boolean;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date, { nullable: true })
	rentedUntil?: Date;

	@Field(() => Int, { nullable: true })
	minimumRentDays?: number;

	@Field(() => Int, { nullable: true })
	maximumRentDays?: number;

	@Field(() => Date, { nullable: true })
	soldAt?: Date;

	@Field(() => Date, { nullable: true })
	deletedAt?: Date;

	@Field(() => Date, { nullable: true })
	constructedAt?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	@Field(() => Member, { nullable: true })
	memberData?: Member;

	@Field(() => [MeLiked], { nullable: true })
	meLiked?: MeLiked[];
}

@ObjectType()
export class Properties {
	@Field(() => [Property])
	list: Property[];

	// Meta info — e.g. total count/pagination info, if you need
	@Field(() => Int, { nullable: true })
	totalCount?: number;
}
