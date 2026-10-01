import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { SystemModule } from './system/system.module';
import { AdminsModule } from './admins/admins.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { HealthModule } from './health/health.module';
import { MoviesModule } from './movies/movies.module';
import { LogsModule } from './logs/logs.module';
import { StorageModule } from './storage/storage.module';
import { APP_PIPE, APP_FILTER } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { ZodValidationExceptionFilter } from './filters/zod-validation-exception.filter';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validate: validateEnv,
    }),
    DatabaseModule, 
    AuthModule, 
    SystemModule, 
    AdminsModule, 
    UsersModule, 
    CategoriesModule,
    HealthModule,
    MoviesModule,
    LogsModule,
    StorageModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: ZodValidationExceptionFilter,
    }
  ],
})
export class AppModule {}
