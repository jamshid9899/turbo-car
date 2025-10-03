import LikeSchema from "../../schemas/Like.model";
import { MongooseModule } from '@nestjs/mongoose';
import { LikeService } from "./like.service";
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Like', schema: LikeSchema }]), 
  ],
  providers: [ LikeService],
  exports: [ LikeService],
})
export class CommentModule {}
