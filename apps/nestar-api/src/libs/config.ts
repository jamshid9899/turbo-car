import { ObjectId } from 'bson';

export const availableAgentSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews', 'memberRank']
export const shapeIntoMongoObjectId = (target: any): ObjectId => {
  return typeof target === 'string' ? new ObjectId(target) : target;
};