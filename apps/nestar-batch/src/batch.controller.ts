import { Controller, Get } from '@nestjs/common';
import { BatchService } from './batch.service';

@Controller()
export class BatchController {
  BatchService: any;
  constructor(private readonly nestarBatchService: BatchService) {}

  @Get()
  getHello(): string {
    return this.BatchService.getHello();
  }
}
