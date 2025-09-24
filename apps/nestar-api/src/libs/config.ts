import { ObjectId } from 'bson';

export const shapeIntoMongoObjectId = (target: any): ObjectId => {
  return typeof target === 'string' ? new ObjectId(target) : target;
};