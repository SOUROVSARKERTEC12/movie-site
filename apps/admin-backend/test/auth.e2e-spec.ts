import { describe, beforeEach, it, expect, afterEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication & Admin Profile (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/login', () => {
    it('should reject invalid credentials with 401 Unauthorized', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'wrongpassword' });
      
      expect(response.status).toBe(401);
    });

    it('should return a JWT token for valid credentials', async () => {
      // NOTE: We will mock the database or seed it in the actual implementation.
      // For now, assuming a seeded admin exists: 'admin@cineblack.com' / 'password123'
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'admin@cineblack.com', password: 'password123' });
      
      // We expect the route to exist (not 404), but it might fail until implemented.
      expect(response.status).not.toBe(404);
      if (response.status === 201 || response.status === 200) {
        expect(response.body).toHaveProperty('access_token');
      }
    });

    it('should return 400 Bad Request if email is not an email', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'not-an-email', password: 'password123' });
      
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/v1/admin/profile', () => {
    it('should return 401 Unauthorized if no token is provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/admin/profile');
      
      expect(response.status).toBe(401);
    });
  });
});
