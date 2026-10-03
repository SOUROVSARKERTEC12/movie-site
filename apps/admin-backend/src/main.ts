import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const configService = app.get(ConfigService);
  const swaggerUrls = configService.get<string[]>('SWAGGER_SERVER_URLS') || ['http://localhost:3000'];

  const configBuilder = new DocumentBuilder()
    .setTitle('CineBlack Enterprise API')
    .setDescription(`
      Core Administrative API for the CineBlack Platform.
      
      Features:
      * **Role-Based Access Control**
      * **Zod Validation** on all Inputs/Outputs
      * **Real-time Telemetry & Health**
    `)
    .setVersion('1.0.0')
    .setContact('CineBlack Engineering', 'https://cineblack.com', 'engineering@cineblack.com')
    .addBearerAuth(
      { 
        type: 'http', 
        scheme: 'bearer', 
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header'
      },
      'JWT-auth' // This name must match the @ApiBearerAuth() decorators
    );

  // Add all swagger servers from env
  swaggerUrls.forEach((url) => {
    configBuilder.addServer(url, 'Environment Server');
  });

  const config = configBuilder.build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, cleanupOpenApiDoc(document), {
    customSiteTitle: 'CineBlack API Documentation',
    swaggerOptions: {
      persistAuthorization: true, // Keeps user logged in across page reloads
      tagsSorter: 'alpha', // Sorts modules alphabetically
      operationsSorter: 'alpha',
    }
  });

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
}
bootstrap();
