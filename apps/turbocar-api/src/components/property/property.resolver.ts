import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { PropertyService } from './property.service';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Properties, Property } from '../../libs/dto/property/property';
import { PropertyInput } from '../../libs/dto/property/property.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { PropertyUpdate } from '../../libs/dto/property/property.update';
import { AuthGuard } from '../auth/guards/auth.guard';
import {
	AgentPropertiesInquiry,
	AllPropertiesInquiry,
	OrdinaryInquiry,
	PropertiesInquiry,
} from '../../libs/dto/property/property.filter';

@Resolver()
export class PropertyResolver {
	constructor(private readonly propertyService: PropertyService) {}

	/** CREATE */
	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation(() => Property)
	async createProperty(@Args('input') input: PropertyInput, @AuthMember('_id') memberId: ObjectId): Promise<Property> {
		input.memberId = memberId;
		return await this.propertyService.createProperty(input);
	}

	/** GET ONE */
	@UseGuards(WithoutGuard)
	@Query(() => Property)
	async getProperty(@Args('propertyId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Property> {
		const propertyId = shapeIntoMongoObjectId(input);
		return await this.propertyService.getProperty(memberId, propertyId);
	}

	/** UPDATE (AGENT) */
	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation(() => Property)
	async updateProperty(@Args('input') input: PropertyUpdate, @AuthMember('_id') memberId: ObjectId): Promise<Property> {
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.propertyService.updateProperty(memberId, input);
	}

	/** PUBLIC LIST */
	@UseGuards(WithoutGuard)
	@Query(() => Properties)
	async getProperties(
		@Args('input') input: PropertiesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Properties> {
		return await this.propertyService.getProperties(memberId, input);
	}

	/** AGENT'S OWN PROPERTIES */
	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Query(() => Properties)
	async getAgentProperties(
		@Args('input') input: AgentPropertiesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Properties> {
		return await this.propertyService.getAgentProperties(memberId, input);
	}

	/** FAVORITES */
	@UseGuards(AuthGuard)
	@Query(() => Properties)
	async getFavorites(
		@Args('input') input: OrdinaryInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Properties> {
		return await this.propertyService.getFavorites(memberId, input);
	}

	/** VISITED HISTORY */
	@UseGuards(AuthGuard)
	@Query(() => Properties)
	async getVisited(@Args('input') input: OrdinaryInquiry, @AuthMember('_id') memberId: ObjectId): Promise<Properties> {
		return await this.propertyService.getVisited(memberId, input);
	}

	/** LIKE TOGGLE */
	@UseGuards(AuthGuard)
	@Mutation(() => Property)
	async likeTargetProperty(
		@Args('propertyId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Property> {
		const likeRefId = shapeIntoMongoObjectId(input);
		return await this.propertyService.likeTargetProperty(memberId, likeRefId);
	}

	/** ADMIN GET ALL */
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Properties)
	async getAllPropertiesByAdmin(@Args('input') input: AllPropertiesInquiry): Promise<Properties> {
		return await this.propertyService.getAllPropertiesByAdmin(input);
	}

	/** ADMIN UPDATE */
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Property)
	async updatePropertyByAdmin(@Args('input') input: PropertyUpdate): Promise<Property> {
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.propertyService.updatePropertyByAdmin(input);
	}

	/** ADMIN REMOVE */
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Property)
	public async removePropertyByAdmin(@Args('propertyId') input: string): Promise<Property> {
		const propertyId = shapeIntoMongoObjectId(input);
		return await this.propertyService.removePropertyByAdmin(propertyId);
	}
}
