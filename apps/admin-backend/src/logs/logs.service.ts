import { Injectable } from '@nestjs/common';
import { LogsRepository } from './logs.repository';
import { AuditLogResponseDto, UserActivityResponseDto } from './dto/log.dto';

@Injectable()
export class LogsService {
  constructor(private readonly logsRepository: LogsRepository) {}

  async findAllAuditLogs(): Promise<AuditLogResponseDto[]> {
    return this.logsRepository.findAllAuditLogs();
  }

  async resetAuditLogs(): Promise<void> {
    await this.logsRepository.resetAuditLogs();
  }

  async findAllUserActivities(): Promise<UserActivityResponseDto[]> {
    return this.logsRepository.findAllUserActivities();
  }

  async resetUserActivities(): Promise<void> {
    await this.logsRepository.resetUserActivities();
  }
}
