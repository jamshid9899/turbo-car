import { Schema } from "mongoose";
import { RentalStatus, RentalType } from "../libs/enums/rental-booking.enum";

const RentalBookingSchema = new Schema(
  {
    rentalType: {
      type: String,
      enum: RentalType,
      default: RentalType.DAILY,
    },

    rentalStatus: {
      type: String,
      enum: RentalStatus,
      default: RentalStatus.PENDING,
    },

    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    renterId:   { type: Schema.Types.ObjectId, ref: "Member", required: true },
    ownerId:    { type: Schema.Types.ObjectId, ref: "Member", required: true },

    startDate: { type: Date, required: true },
    endDate:   { type: Date, required: true },

    dailyPrice: { type: Number, required: true },
    totalDays:  { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    deposit: { type: Number, default: 0 },
    depositStatus: {
      type: String,
      enum: RentalStatus,
      default: 'PENDING',
    },

    paymentMethod: {
      type: String,
      enum: RentalType,
    },

    paymentStatus: {
      type: String,
      enum: RentalStatus,
      default: 'PENDING',
    },

    paidAmount: { type: Number, default: 0 },

    pickupLocation: { type: String, required: true },
    returnLocation: { type: String, required: true },

    note: { type: String },

    initialMileage: { type: Number },
    finalMileage: { type: Number },

    initialFuelLevel: { type: Number, min: 0, max: 100 },
    finalFuelLevel:   { type: Number, min: 0, max: 100 },

    damageDescription: { type: String },
    damageImages:      { type: [String], default: [] },
    damageRepairCost:  { type: Number, default: 0 },
  },
  { timestamps: true, collection: "rentalBookings" }
);


export default RentalBookingSchema;
