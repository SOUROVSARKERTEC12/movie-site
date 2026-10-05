import { Controller, Get, Post, UseGuards, HttpCode } from '@nestjs/common';
import { LogsService } from './logs.service';
import { AuthGuard } from '@nestjs/passport';
import { AuditLogResponseDto, UserActivityResponseDto } from './dto/log.dto';

@Controller('logs')
@UseGuards(AuthGuard('jwt'))
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get('audit')
  getAuditLogs(): Promise<AuditLogResponseDto[]> {
    return this.logsService.findAllAuditLogs();
  }

  @Post('audit/reset')
  @HttpCode(200)
  resetAuditLogs(): Promise<void> {
    return this.logsService.resetAuditLogs();
  }

  @Get('user-activity')
  getUserActivities(): Promise<UserActivityResponseDto[]> {
    return this.logsService.findAllUserActivities();
  }

  @Post('user-activity/reset')
  @HttpCode(200)
  resetUserActivities(): Promise<void> {
    return this.logsService.resetUserActivities();
  }
}
