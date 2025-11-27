// property.input.ts
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsInt, Min, Length, IsBoolean, IsOptional, IsEnum, IsArray, ArrayNotEmpty } from 'class-validator';
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
} from '../../enums/property.enum';

@InputType()
export class PropertyInput {
  @IsNotEmpty()
  @Field(() => PropertyCondition)
  propertyCondition: PropertyCondition;

  @IsNotEmpty()
  @Field(() => PropertyBrand)
  propertyBrand: PropertyBrand;

  @IsNotEmpty()
  @Field(() => PropertyType)
  propertyBodyType: PropertyType;

  @IsNotEmpty()
  @Field(() => PropertyFuelType)
  propertyFuelType: PropertyFuelType;

  @IsNotEmpty()
  @Field(() => PropertyLocation)
  propertyLocation: PropertyLocation;

  @IsNotEmpty()
  @Field(() => PropertyColor)
  propertyColor: PropertyColor;

  @IsNotEmpty()
  @Field(() => PropertyTransmission)
  propertyTransmission: PropertyTransmission;

  @IsNotEmpty()
  @Field(() => [PropertyFeatures])
  @IsArray()
  @ArrayNotEmpty()
  propertyFeatures: PropertyFeatures[];

  @IsNotEmpty()
  @Field(() => PropertyCylinders)
  propertyCylinders: PropertyCylinders;

  @IsNotEmpty()
  @IsInt()
  @Field(() => Int)
  propertyYear: number;

  @IsNotEmpty()
  @Length(3, 100)
  @Field(() => String)
  propertyTitle: string;

  @IsNotEmpty()
  @Field(() => Number)
  propertyPrice: number;

  @IsNotEmpty()
  @Field(() => Number)
  propertyMileage: number;

  @IsNotEmpty()
  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  propertyImages: string[];

  @IsOptional()
  @Length(5, 500)
  @Field(() => String, { nullable: true })
  propertyDesc?: string;

  @IsNotEmpty()
  @IsBoolean()
  @Field(() => Boolean)
  isForSale: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Field(() => Boolean)
  isForRent: boolean;

  // owner id (optional / auto-filled on server)
  memberId?: ObjectId;
}





