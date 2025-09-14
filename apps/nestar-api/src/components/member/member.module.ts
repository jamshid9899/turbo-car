import { Module } from '@nestjs/common';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{name: "Member", schema: MemberModule}])
  ],
  providers: [MemberResolver, MemberService]
})
export class MemberModule {}
