import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { LogsRepository } from './logs.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LogsController],
  providers: [LogsService, LogsRepository],
  exports: [LogsService],
})
export class LogsModule {}
