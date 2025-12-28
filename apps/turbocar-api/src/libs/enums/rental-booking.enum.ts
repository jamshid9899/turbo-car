import { registerEnumType } from '@nestjs/graphql';

export enum RentalType {
	DAILY = 'DAILY',
	WEEKLY = 'WEEKLY',
	HOURLY = 'HOURLY',
}
registerEnumType(RentalType, {
	name: 'RentalType',
});

export enum RentalStatus {
	PENDING = 'PENDING',
	CONFIRMED = 'CONFIRMED',
	CANCELLED = 'CANCELLED',
	FINISHED = 'FINISHED',
}
registerEnumType(RentalStatus, {
	name: 'RentalStatus',
});
