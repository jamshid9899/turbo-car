import { Field, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { ViewGroup } from '../../enums/view.enum';

@ObjectType() //dto
export class View {
 @Field(() => String)
 _id: ObjectId;

 @Field(() => ViewGroup)
 viewGroup: ViewGroup;

 @Field(() => String)
 viewRefId: ObjectId; //va nimani tomosha qilyapti

 @Field(() => String)
 memberId: ObjectId; //kim tomosha qilyapti

 @Field(() => Date)
 createdAt: Date;

 @Field(() => Date)
 updatedAt: Date;
}

