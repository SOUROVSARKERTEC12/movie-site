import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { AdminResponseDto } from '../admins/dto/admin.dto';

import { Request as ExpressRequest } from 'express';

interface RequestWithUser extends ExpressRequest {
  user: { userId: string; email: string };
}

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('admin/profile')
  getProfile(@Request() req: RequestWithUser): Promise<AdminResponseDto> {
    return this.authService.getProfile(req.user.userId);
  }
}
