import { Controller, Get, Logger } from '@nestjs/common';
import { BatchService } from './batch.service';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { BATCH_ROLLBACK, BATCH_TOP_AGENTS, BATCH_TOP_PROPERTIES } from './lib/config';

@Controller()
export class BatchController {
  private logger: Logger = new Logger('BatchController');
  constructor(private readonly batchService: BatchService) {}

  @Timeout(1000)
  handleTimeout() {
    this.logger.debug('BATCH SERVER READY!');
  }
  
@Cron('0 * * * * *', { name: BATCH_ROLLBACK })  // har daqiqaning boshida
public async batchRollback() {
  this.logger['context'] = BATCH_ROLLBACK;
  this.logger.debug('EXECUTED!');
  await this.batchService.batchRollback();
}

@Cron('20 * * * * *', { name: BATCH_TOP_PROPERTIES }) // har daqiqaning 20-soniyasida
public async batchProperties() {
  this.logger['context'] = BATCH_TOP_PROPERTIES;
  this.logger.debug('EXECUTED!');
  await this.batchService.batchProperties();
}

@Cron('40 * * * * *', { name: BATCH_TOP_AGENTS }) // har daqiqaning 40-soniyasida
public async batchAgents() {
  this.logger['context'] = BATCH_TOP_AGENTS;
  this.logger.debug('EXECUTED!');
  await this.batchService.batchAgents();
}


/** 
  @Interval(1000)
  handleInterval() {
    this.logger.debug('INTERVAL TEST');
  }*/
  @Get()
  getHello(): string {
    return this.batchService.getHello();
  }
}
