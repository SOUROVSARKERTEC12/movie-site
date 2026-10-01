import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { SystemModule } from './system/system.module';
import { AdminsModule } from './admins/admins.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { APP_PIPE, APP_FILTER } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { ZodValidationExceptionFilter } from './filters/zod-validation-exception.filter';

@Module({
  imports: [
    DatabaseModule, 
    AuthModule, 
    SystemModule, 
    AdminsModule, 
    UsersModule, 
    CategoriesModule
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
