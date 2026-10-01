import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class SystemService {
  async getStorageTelemetry() {
    try {
      // Check the storage telemetry of the current directory (or a specific upload dir)
      const uploadDir = path.resolve(process.cwd());
      
      const stats = await fs.statfs(uploadDir);
      
      const total = stats.blocks * stats.bsize;
      const free = stats.bfree * stats.bsize;
      const used = total - free;

      return {
        total,
        free,
        used,
      };
    } catch {
      // Fallback if statfs fails
      return {
        total: 0,
        free: 0,
        used: 0,
        error: 'Failed to retrieve storage telemetry',
      };
    }
  }
}
