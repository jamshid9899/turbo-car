import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Schema } from 'mongoose';
import { MemberService } from '../member/member.service';
import { PropertyInput } from '../../libs/dto/property/property.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { Properties, Property } from '../../libs/dto/property/property';
import { PropertyStatus } from '../../libs/enums/property.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { ViewService } from '../view/view.service';
import { PropertyUpdate } from '../../libs/dto/property/property.update';
import moment from 'moment';
import { lookupAuthMemberLiked, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { LikeService } from '../like/like.service';
import { LikeGroup } from '../../libs/enums/like.enum';
import { LikeInput } from '../../libs/dto/like/like.input';
import { AgentPropertiesInquiry, AllPropertiesInquiry, OrdinaryInquiry, PropertiesInquiry, PropertySearchFilter } from '../../libs/dto/property/property.filter';


@Injectable()
export class PropertyService {
  memberStatsEditor(arg0: { _id: Schema.Types.ObjectId; targetKey: string; modifier: number; }) {
    throw new Error('Method not implemented.');
  }
  constructor(@InjectModel('Property') private readonly propertyModel: Model<Property>,
    private memberService: MemberService,
    private viewService: ViewService,
    private likeService: LikeService,
  ) { }

  public async createProperty(input: PropertyInput): Promise<Property> {
    try {
      const result = await this.propertyModel.create(input);
      await this.memberService.memberStatsEditor({
        _id: result.memberId,
        targetKey: 'memberProperties',
        modifier: 1,
      });
      return result;
    } catch (err) {
      console.log('Error, Service.model:', err);
      throw new BadRequestException(Message.CREATE_FAILED);
    }
  }

  public async getProperty(memberId: ObjectId, propertyId: ObjectId): Promise<Property> {
    const search: T = {
      _id: propertyId,
      propertyStatus: PropertyStatus.ACTIVE,
    };

    const targetProperty: Property = await this.propertyModel.findOne(search).lean().exec(); //hosil bolgan objectni modify qilish uchun
    console.log('DB search result:', search, targetProperty);
    if (!targetProperty) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    if (memberId) {
      const viewInput = { memberId: memberId, viewRefId: propertyId, viewGroup: ViewGroup.PROPERTY };
      const newView = await this.viewService.recordView(viewInput);
      if (newView) {
        await this.propertyStatsEditor({ _id: propertyId, targetKey: 'propertyViews', modifier: 1 });
        targetProperty.propertyViews++;
      }

      //meliked
      const likeInput = { memberId: memberId, likeRefId: propertyId, likeGroup: LikeGroup.PROPERTY };
      targetProperty.meLiked = await this.likeService.checkLikeExistence(likeInput)
    }
    targetProperty.memberData = await this.memberService.getMember(null, targetProperty.memberId);
    return targetProperty;
  }


  public async updateProperty(memberId: ObjectId, input: PropertyUpdate): Promise<Property> {
    let { propertyStatus, soldAt, deletedAt } = input;
    const search: T = {
      _id: input._id,
      memberId: memberId,
      propertyStatus: PropertyStatus.ACTIVE,
    };

    if (propertyStatus === PropertyStatus.SOLD) soldAt = moment().toDate();
    else if (propertyStatus === PropertyStatus.DELETE) deletedAt = moment().toDate();

    const result = await this.propertyModel.findOneAndUpdate(search, input, {
      new: true,
    })
      .exec();
    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

    if (soldAt || deletedAt) {
      await this.memberService.memberStatsEditor({
        _id: memberId,
        targetKey: 'memberProperties',
        modifier: -1,
      })
    }
    return result;
  }

  public async getProperties(memberId: ObjectId, input: PropertiesInquiry): Promise<Properties> {
  const match: T = { propertyStatus: PropertyStatus.ACTIVE };
  const sort: T = { [input.sort ?? 'createdAt']: input.direction ?? Direction.DESC };

  // ⭐⭐ ENG MUHIM O‘ZGARISH ⭐⭐
  this.shapeMatchQuery(match, input.filter);

  const result = await this.propertyModel.aggregate([
    { $match: match },
    { $sort: sort },
    {
      $facet: {
        list: [
          { $skip: (input.page - 1) * input.limit },
          { $limit: input.limit },
          lookupAuthMemberLiked(memberId),
          lookupMember,
          { $unwind: '$memberData' },
        ],
        metaCounter: [
          { $count: 'totalCount' } // ⭐ totalCount nomi MUHIM!
        ]
      }
    },
    {
      $project: {
        list: 1,
        totalCount: {
          $ifNull: [
            { $arrayElemAt: ['$metaCounter.totalCount', 0] },
            0
          ]
        }
      }
    }
  ]).exec();

  return result[0];
}



 private shapeMatchQuery(match: T, filter: PropertySearchFilter): void {
  if (!filter) return;

  const {
    locationList,
    typeList,
    conditionList,
    fuelTypeList,
    transmissionList,
    featuresList,
    brandList,
    cylindersList,
    colorList,
    minPrice,
    maxPrice,
    minMileage,
    maxMileage,
    minYear,
    maxYear,
    isForSale,
    isForRent,
    text,
  } = filter;

  if (locationList?.length) match.propertyLocation = { $in: locationList };
  if (typeList?.length) match.propertyType = { $in: typeList };
  if (conditionList?.length) match.propertyCondition = { $in: conditionList };
  if (fuelTypeList?.length) match.propertyFuelType = { $in: fuelTypeList };
  if (transmissionList?.length) match.propertyTransmission = { $in: transmissionList };
  if (featuresList?.length) match.propertyFeatures = { $in: featuresList };
  if (brandList?.length) match.propertyBrand = { $in: brandList };
  if (cylindersList?.length) match.propertyCylinders = { $in: cylindersList };
  if (colorList?.length) match.propertyColor = { $in: colorList };

  if (minPrice != null || maxPrice != null)
    match.propertyPrice = { $gte: minPrice ?? 0, $lte: maxPrice ?? 999999999 };

  if (minMileage != null || maxMileage != null)
    match.propertyMileage = { $gte: minMileage ?? 0, $lte: maxMileage ?? 999999999 };

  if (minYear != null || maxYear != null)
    match.propertyYear = { $gte: minYear ?? 1900, $lte: maxYear ?? 2100 };

  if (isForSale !== undefined) match.isForSale = isForSale;
  if (isForRent !== undefined) match.isForRent = isForRent;

  if (text) match.propertyTitle = { $regex: new RegExp(text, 'i') };
}




  /** FAVORITES */
  public async getFavorites(memberId: ObjectId, input: OrdinaryInquiry): Promise<Properties> {
    return await this.likeService.getFavoriteProperties(memberId, input);
  }

  /** VIEWS */
  public async getVisited(memberId: ObjectId, input: OrdinaryInquiry): Promise<Properties> {
    return await this.viewService.getVisitedProperties(memberId, input);
  }

 public async getAgentProperties(memberId: ObjectId, input: AgentPropertiesInquiry): Promise<Properties> {
  const { propertyStatus, propertyLocationList, isForSale, isForRent } = input.search;

  if (propertyStatus === PropertyStatus.DELETE) {
    throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);
  }

  const match: T = {
    memberId: memberId,
    propertyStatus: propertyStatus ?? { $ne: PropertyStatus.DELETE },
  };

  if (propertyLocationList?.length) {
    match.propertyLocation = { $in: propertyLocationList };
  }

  if (isForSale !== undefined) {
    match.isForSale = isForSale;
  }

  if (isForRent !== undefined) {
    match.isForRent = isForRent;
  }

  const sort: T = {
    [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
  };

  const result = await this.propertyModel.aggregate([
    { $match: match },
    { $sort: sort },
    {
      $facet: {
        list: [
          { $skip: (input.page - 1) * input.limit },
          { $limit: input.limit },
          lookupMember,
          { $unwind: '$memberData' },
        ],
        metaCounter: [
          { $count: 'totalCount' }   
        ]
      },
    },

   
    {
      $project: {
        list: 1,
        totalCount: {
          $ifNull: [
            { $arrayElemAt: ['$metaCounter.totalCount', 0] },
            0
          ]
        }
      }
    }
  ]).exec();

  return result[0];
}



  /**LIKES */
  public async likeTargetProperty(memberId: ObjectId, likeRefId: ObjectId): Promise<Property> {
    const target: Property = await this.propertyModel.findOne({
   _id: likeRefId,
   propertyStatus: { $in: [PropertyStatus.ACTIVE, PropertyStatus.RENTED] }
}).exec();
    if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    const input: LikeInput = {
      memberId: memberId,
      likeRefId: likeRefId,
      likeGroup: LikeGroup.PROPERTY,
    };

    const modifier: number = await this.likeService.toggleLike(input);
    const result = await this.propertyStatsEditor({ _id: likeRefId, targetKey: 'propertyLikes', modifier: modifier });

    if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
    return result;
  }

  /**ADMIN */
 /** ADMIN */
public async getAllPropertiesByAdmin(input: AllPropertiesInquiry): Promise<Properties> {
  const { propertyStatus, propertyLocationList } = input.search;

  const match: T = {};
  const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

  if (propertyStatus) match.propertyStatus = propertyStatus;
  if (propertyLocationList?.length) match.propertyLocation = { $in: propertyLocationList };

  const result = await this.propertyModel.aggregate([
    { $match: match },
    { $sort: sort },
    {
      $facet: {
        list: [
          { $skip: (input.page - 1) * input.limit },
          { $limit: input.limit },
          lookupMember,
          { $unwind: '$memberData' }
        ],
        metaCounter: [
          { $count: 'totalCount' }          // ⭐ TO‘G‘RI nom
        ],
      },
    },
    {
      $project: {
        list: 1,
        totalCount: {
          $ifNull: [
            { $arrayElemAt: ['$metaCounter.totalCount', 0] },
            0
          ]
        }
      }
    }
  ]).exec();

  if (!result.length) {
    throw new InternalServerErrorException(Message.NO_DATA_FOUND);
  }

  return result[0];
}


  public async updatePropertyByAdmin(input: PropertyUpdate): Promise<Property> {
    let { propertyStatus, soldAt, deletedAt } = input;
    const search: T = {
      _id: input._id,
      propertyStatus: PropertyStatus.ACTIVE,
    };

    if (propertyStatus === PropertyStatus.SOLD) soldAt = moment().toDate();
    else if (propertyStatus === PropertyStatus.DELETE) deletedAt = moment().toDate();

    const result = await this.propertyModel.findOneAndUpdate(search, input, {
      new: true,
    })
      .exec();
    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

    if (soldAt || deletedAt) {
      await this.memberService.memberStatsEditor({
        _id: result.memberId,
        targetKey: 'memberProperties',
        modifier: -1,
      })
    }
    return result;
  }

  public async removePropertyByAdmin(propertyId: ObjectId): Promise<Property> {
    const search: T = {
      _id: propertyId,
      propertyStatus: PropertyStatus.DELETE,
    };
    const result = await this.propertyModel.findOneAndDelete(search).exec();
    if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

    return result;
  }
  // property.service.ts

/** UPDATE BY OWNER (for rental automation) */
public async updatePropertyByOwner(
  ownerId: ObjectId, 
  input: Partial<PropertyUpdate>
): Promise<Property> {
  const result = await this.propertyModel.findOneAndUpdate(
    { 
      _id: input._id, 
      memberId: ownerId 
    },
    input,
    { new: true }
  ).exec();

  if (!result) {
    throw new InternalServerErrorException(Message.UPDATE_FAILED);
  }

  return result;
}

  public async propertyStatsEditor(input: StatisticModifier): Promise<Property> {
    const { _id, targetKey, modifier } = input;
    return await this.propertyModel.findByIdAndUpdate(
      _id,
      { $inc: { [targetKey]: modifier } },
      {
        new: true,
      },
    )
      .exec();
  }
}


  