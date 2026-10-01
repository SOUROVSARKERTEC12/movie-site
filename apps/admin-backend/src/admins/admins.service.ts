import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminsRepository } from './admins.repository';
import { CreateAdminDto, UpdateAdminDto } from './dto/admin.dto';
import { SafeAdmin, Admin } from '../database/schema';

@Injectable()
export class AdminsService {
  constructor(private readonly adminsRepository: AdminsRepository) {}

  private excludePasswordHash(admin: Admin): SafeAdmin {
    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      createdAt: admin.createdAt,
    };
  }

  async create(createAdminDto: CreateAdminDto): Promise<SafeAdmin> {
    const result = await this.adminsRepository.create(createAdminDto);
    return this.excludePasswordHash(result);
  }

  async findAll(): Promise<SafeAdmin[]> {
    const allAdmins = await this.adminsRepository.findAll();
    return allAdmins.map(admin => this.excludePasswordHash(admin));
  }

  async findOne(id: string): Promise<SafeAdmin> {
    const admin = await this.adminsRepository.findOne(id);
    if (!admin) throw new NotFoundException('Admin not found');
    return this.excludePasswordHash(admin);
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<SafeAdmin> {
    const result = await this.adminsRepository.update(id, updateAdminDto);
    if (!result) throw new NotFoundException('Admin not found');
    return this.excludePasswordHash(result);
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const success = await this.adminsRepository.remove(id);
    if (!success) throw new NotFoundException('Admin not found');
    return { success: true };
  }
}
