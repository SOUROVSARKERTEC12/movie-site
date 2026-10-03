import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { AdminsRepository } from '../admins/admins.repository';
import { AdminResponseDto } from '../admins/dto/admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private adminsRepository: AdminsRepository,
  ) {}

  async login(loginDto: LoginDto) {
    // Check if the user is the mock seeded admin
    // In a real scenario, we'd hash check against DB.
    const admin = await this.adminsRepository.findOneByEmail(loginDto.email);

    if (admin) {
      // Very simple mock password check (assuming plain text or seeded for tests)
      // Note: In production, use bcrypt.compare(loginDto.password, admin.passwordHash)
      if (admin.passwordHash !== loginDto.password) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return {
        access_token: this.jwtService.sign({ sub: admin.id, email: admin.email }),
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async getProfile(userId: string): Promise<AdminResponseDto> {
    const admin = await this.adminsRepository.findOne(userId);
    if (!admin) {
      throw new UnauthorizedException('User not found');
    }
    
    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      createdAt: admin.createdAt,
    };
  }
}
