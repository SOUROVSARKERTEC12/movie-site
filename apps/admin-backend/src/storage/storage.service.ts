import { Injectable, NotFoundException } from '@nestjs/common';
import { StorageRepository } from './storage.repository';
import { CreateStoragePathDto, UpdateStoragePathDto, StoragePathResponseDto, StorageMetricsResponseDto } from './dto/storage.dto';
import * as fs from 'fs/promises';

@Injectable()
export class StorageService {
  constructor(private readonly storageRepository: StorageRepository) {}

  async createPath(createDto: CreateStoragePathDto): Promise<StoragePathResponseDto> {
    return this.storageRepository.create(createDto);
  }

  async findAllPaths(): Promise<StoragePathResponseDto[]> {
    return this.storageRepository.findAll();
  }

  async updatePath(id: string, updateDto: UpdateStoragePathDto): Promise<StoragePathResponseDto> {
    const result = await this.storageRepository.update(id, updateDto);
    if (!result) throw new NotFoundException('Storage path not found');
    return result;
  }

  async deletePath(id: string): Promise<StoragePathResponseDto> {
    const result = await this.storageRepository.delete(id);
    if (!result) throw new NotFoundException('Storage path not found');
    return result;
  }

  async getMetrics(): Promise<StorageMetricsResponseDto> {
    const paths = await this.storageRepository.findAll();
    
    let totalMaxLimitGb = 0;
    let totalUsedGb = 0;
    let totalFreeGb = 0;

    for (const p of paths) {
      totalMaxLimitGb += p.maxLimitGb;
      try {
        // Only works safely if the path actually exists
        // statfs returns block info. size = bsize * blocks, free = bsize * bfree
        const stats = await fs.statfs(p.path);
        const freeBytes = stats.bfree * stats.bsize;
        const totalBytes = stats.blocks * stats.bsize;
        const usedBytes = totalBytes - freeBytes;
        
        // Convert to GB
        const usedGb = usedBytes / (1024 * 1024 * 1024);
        const freeGb = freeBytes / (1024 * 1024 * 1024);
        
        totalUsedGb += usedGb;
        totalFreeGb += freeGb;
      } catch (e) {
        // If path doesn't exist or is inaccessible, assume full maxLimitGb is "free" or error it out.
        // For safety, we'll log it and just count its max limit but assume 0 used.
        console.warn(`Could not statfs path ${p.path}:`, e);
        totalFreeGb += p.maxLimitGb;
      }
    }

    return {
      totalMaxLimitGb,
      totalUsedGb,
      totalFreeGb,
    };
  }
}
