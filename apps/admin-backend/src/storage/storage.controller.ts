import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { StorageService } from './storage.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateStoragePathDto, UpdateStoragePathDto, StoragePathResponseDto, StorageMetricsResponseDto } from './dto/storage.dto';

@Controller('storage')
@UseGuards(AuthGuard('jwt'))
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('paths')
  getPaths(): Promise<StoragePathResponseDto[]> {
    return this.storageService.findAllPaths();
  }

  @Post('paths')
  createPath(@Body() createDto: CreateStoragePathDto): Promise<StoragePathResponseDto> {
    return this.storageService.createPath(createDto);
  }

  @Put('paths/:id')
  updatePath(@Param('id') id: string, @Body() updateDto: UpdateStoragePathDto): Promise<StoragePathResponseDto> {
    return this.storageService.updatePath(id, updateDto);
  }

  @Delete('paths/:id')
  deletePath(@Param('id') id: string): Promise<StoragePathResponseDto> {
    return this.storageService.deletePath(id);
  }

  @Get('metrics')
  getMetrics(): Promise<StorageMetricsResponseDto> {
    return this.storageService.getMetrics();
  }
}
