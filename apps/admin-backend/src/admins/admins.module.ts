import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';

import { AdminsRepository } from './admins.repository';

@Module({
  controllers: [AdminsController],
  providers: [AdminsService, AdminsRepository],
  exports: [AdminsRepository],
})
export class AdminsModule {}
