import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'super-secret-key-for-dev', // In production, use environment variable
      signOptions: { expiresIn: '60m' },
    }),
    AdminsModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
