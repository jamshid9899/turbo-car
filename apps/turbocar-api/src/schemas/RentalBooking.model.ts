import { Schema } from 'mongoose';
import { RentalStatus, RentalType } from '../libs/enums/rental-booking.enum';

const RentalBookingSchema = new Schema(
	{
		propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
		renterId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
		ownerId: { type: Schema.Types.ObjectId, ref: 'Member', required: true },

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

		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },

		totalPrice: { type: Number, required: true },
	},
	{ timestamps: true, collection: 'rentalBookings' },
);

export default RentalBookingSchema;
