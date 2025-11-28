import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import RentalBookingSchema from '../../schemas/RentalBooking.model';
import { RentalService } from './rental.service';
import { RentalResolver } from './rental.resolver';
import { MemberModule } from '../member/member.module';
import { PropertyModule } from '../property/property.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'RentalBooking', schema: RentalBookingSchema }]),
    MemberModule,
    PropertyModule,
    AuthModule,
  ],
  providers: [RentalResolver, RentalService],
  exports: [RentalService],
})
export class RentalModule {}

