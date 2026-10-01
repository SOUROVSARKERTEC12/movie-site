import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateAdminDto, UpdateAdminDto, AdminResponseDto } from './dto/admin.dto';

@Controller('admins')
@UseGuards(AuthGuard('jwt'))
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    return this.adminsService.create(createAdminDto);
  }

  @Get()
  findAll(): Promise<AdminResponseDto[]> {
    return this.adminsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<AdminResponseDto> {
    return this.adminsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto): Promise<AdminResponseDto> {
    return this.adminsService.update(id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.adminsService.remove(id);
  }
}
