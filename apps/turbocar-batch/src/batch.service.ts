import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from 'apps/turbocar-api/src/libs/dto/member/member';
import { Property } from 'apps/turbocar-api/src/libs/dto/property/property';
import { MemberStatus, MemberType } from 'apps/turbocar-api/src/libs/enums/member.enum';
import { PropertyStatus } from 'apps/turbocar-api/src/libs/enums/property.enum';
import { Model } from 'mongoose';

@Injectable()
export class BatchService {
	private logger: Logger = new Logger('BatchService');

	constructor(
		@InjectModel('Property') private readonly propertyModel: Model<Property>,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
	) {}

	/**
	 * BATCH ROLLBACK - Reset all ranks to 0
	 * Purpose: Prepare for fresh ranking calculation
	 */
	public async batchRollback(): Promise<void> {
		try {
			// Reset all active car ranks to 0
			const propertyResult = await this.propertyModel
				.updateMany(
					{
						propertyStatus: PropertyStatus.ACTIVE,
					},
					{ propertyRank: 0 },
				)
				.exec();

			// Reset all active agent ranks to 0
			const memberResult = await this.memberModel
				.updateMany(
					{
						memberStatus: MemberStatus.ACTIVE,
						memberType: MemberType.AGENT,
					},
					{ memberRank: 0 },
				)
				.exec();

			this.logger.debug(
				`✅ Rollback: ${propertyResult.modifiedCount} cars, ${memberResult.modifiedCount} agents`,
			);
		} catch (err) {
			this.logger.error('❌ Batch Rollback Error:', err);
			throw err;
		}
	}

	/**
	 * BATCH TOP PROPERTIES (CARS) - Calculate car rankings
	 * Formula: rank = (likes × 2) + (views × 1) + (comments × 1.5)
	 * Higher rank = more popular car
	 */
	public async batchTopProperties(): Promise<void> {
		try {
			const properties: Property[] = await this.propertyModel
				.find({
					propertyStatus: PropertyStatus.ACTIVE,
					propertyRank: 0,
				})
				.exec();

			if (!properties.length) {
				this.logger.debug('⚠️  No properties to rank');
				return;
			}

			const promisedList = properties.map(async (car: Property) => {
				const { _id, propertyLikes, propertyViews, propertyComments } = car;

				// TurboCar ranking formula for cars
				const rank = propertyLikes * 2 + propertyViews * 1 + (propertyComments || 0) * 1.5;

				return await this.propertyModel.findByIdAndUpdate(_id, { propertyRank: rank });
			});

			await Promise.all(promisedList);

			this.logger.debug(`✅ Ranked ${properties.length} cars`);
		} catch (err) {
			this.logger.error('❌ Batch Top Properties Error:', err);
			throw err;
		}
	}

	/**
	 * BATCH TOP AGENTS (DEALERS) - Calculate dealer rankings
	 * Formula: rank = (cars × 5) + (articles × 3) + (likes × 2) + (views × 1) + (followers × 1.5)
	 * Higher rank = more successful dealer
	 */
	public async batchTopAgents(): Promise<void> {
		try {
			const agents: Member[] = await this.memberModel
				.find({
					memberType: MemberType.AGENT,
					memberStatus: MemberStatus.ACTIVE,
					memberRank: 0,
				})
				.exec();

			if (!agents.length) {
				this.logger.debug('⚠️  No agents to rank');
				return;
			}

			const promisedList = agents.map(async (dealer: Member) => {
				const { _id, memberProperties, memberLikes, memberArticles, memberViews, memberFollowers } = dealer;

				// TurboCar ranking formula for dealers
				const rank =
					memberProperties * 5 +
					(memberArticles || 0) * 3 +
					memberLikes * 2 +
					memberViews * 1 +
					(memberFollowers || 0) * 1.5;

				return await this.memberModel.findByIdAndUpdate(_id, { memberRank: rank });
			});

			await Promise.all(promisedList);

			this.logger.debug(`✅ Ranked ${agents.length} dealers`);
		} catch (err) {
			this.logger.error('❌ Batch Top Agents Error:', err);
			throw err;
		}
	}

	public getHello(): string {
		return '🚗 Welcome to TurboCar BATCH Server!';
	}
}