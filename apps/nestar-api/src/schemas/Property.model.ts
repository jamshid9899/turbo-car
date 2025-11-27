import { Schema } from "mongoose";
import {
	PropertyLocation,
	PropertyStatus,
	PropertyBrand,
	PropertyCondition,
	PropertyType,
	PropertyFuelType,
	PropertyColor,
	PropertyTransmission,
	PropertyFeatures,
	PropertyCylinders,
} from "../libs/enums/property.enum";

const PropertySchema = new Schema(
	{

		propertyType: {
			type: String,
			enum: PropertyType,
			required: true,
		},

		propertyCondition: {
			type: String,
			enum: PropertyCondition,
			required: true,
		},

		propertyBrand: {
			type: String,
			enum: PropertyBrand,
			required: true,
		},

		propertyStatus: {
			type: String,
			enum: PropertyStatus,
			default: PropertyStatus.ACTIVE,
		},

		propertyLocation: {
			type: String,
			enum: PropertyLocation,
			required: true,
		},

		// ===== PRICING & AVAILABILITY =====
		propertyPrice: {
			type: Number,
			required: true,
		},

		propertyRentPrice: {  // ✅ YANGI - rent uchun narx
			type: Number,
			default: 0,
		},

		isForSale: {  // ✅ YANGI - sotish uchunmi?
			type: Boolean,
			default: true,
		},

		isForRent: {  // ✅ YANGI - rent uchunmi?
			type: Boolean,
			default: false,
		},

		// ===== CAR SPECIFICATIONS =====
		propertyYear: {
			type: Number,
			required: true,
		},

		propertyMileage: {
			type: Number,
			required: true,
		},

		propertyFuelType: {
			type: String,
			enum: PropertyFuelType,
			required: true,
		},

		propertyTransmission: {
			type: String,
			enum: PropertyTransmission,
			required: true,
		},

		propertyColor: {
			type: String,
			enum: PropertyColor,
			required: true,
		},

		propertySeats: {  // ✅ YANGI - necha o'rindiq
			type: Number,
			required: true,
			min: 2,
			max: 9,
		},

		propertyFeatures: {
			type: [String],
			enum: PropertyFeatures,
			default: [],
		},

		propertyCylinders: {
			type: String,
			enum: PropertyCylinders,
			required: true,
		},

		// ===== CONTENT =====
		propertyTitle: {
			type: String,
			required: true,
		},

		propertyDesc: {
			type: String,
		},

		propertyImages: {
			type: [String],
			required: true,
		},

		// ===== ENGAGEMENT METRICS =====
		propertyViews: {
			type: Number,
			default: 0,
		},

		propertyLikes: {
			type: Number,
			default: 0,
		},

		propertyComments: {
			type: Number,
			default: 0,
		},

		propertyRank: {
			type: Number,
			default: 0,
		},

		// ===== OWNERSHIP =====
		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		// ===== RENTAL SPECIFIC (YANGI) =====
		rentedUntil: {
			type: Date,
		},

		minimumRentDays: {
			type: Number,
			default: 1,
		},

		maximumRentDays: {  // ✅ YANGI - Maksimal rent muddati
			type: Number,
			default: 90,
		},

		// ===== IMPORTANT DATES =====
		soldAt: {
			type: Date,
		},

		deletedAt: {
			type: Date,
		},

		constructedAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
		collection: 'properties',
	},
);
PropertySchema.index({ propertyCondition: 1, propertyBrand: 1, propertyType: 1, propertyFuelType: 1, propertyLocation: 1, propertyTitle: 1, propertyPrice: 1 }, { unique: true });


export default PropertySchema;
