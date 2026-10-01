import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { StorageRepository } from './storage.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [StorageController],
  providers: [StorageService, StorageRepository],
  exports: [StorageService],
})
export class StorageModule {}
