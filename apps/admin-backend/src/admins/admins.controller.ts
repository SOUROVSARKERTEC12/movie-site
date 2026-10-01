import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateAdminDto, UpdateAdminDto } from './dto/admin.dto';
import { SafeAdmin } from '../database/schema';

@Controller('api/v1/admins')
@UseGuards(AuthGuard('jwt'))
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto): Promise<SafeAdmin> {
    return this.adminsService.create(createAdminDto);
  }

  @Get()
  findAll(): Promise<SafeAdmin[]> {
    return this.adminsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<SafeAdmin> {
    return this.adminsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto): Promise<SafeAdmin> {
    return this.adminsService.update(id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.adminsService.remove(id);
  }
}
