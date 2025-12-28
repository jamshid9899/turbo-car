import { Module } from '@nestjs/common';
import { MemberModule } from '../member/member.module';
import { AuthModule } from '../auth/auth.module';
import { FollowResolver } from './follow.resolver';
import { FollowService } from './follow.service';
import FollowSchema from '../../schemas/Follow.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Follow', schema: FollowSchema }]), AuthModule, MemberModule],
	providers: [FollowResolver, FollowService],
	exports: [FollowService],
})
export class FollowModule {}
