import { Controller, Get, UseGuards } from '@nestjs/common';
import { SystemService } from './system.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('system')
@UseGuards(AuthGuard('jwt'))
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('storage')
  async getStorageTelemetry() {
    return this.systemService.getStorageTelemetry();
  }
}
