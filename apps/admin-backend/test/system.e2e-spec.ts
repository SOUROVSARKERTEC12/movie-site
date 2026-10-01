import { describe, beforeEach, it, expect, afterEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('System Telemetry (e2e)', () => {
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

  describe('GET /api/v1/system/storage', () => {
    it('should return 401 Unauthorized if no token is provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/system/storage');
      
      expect(response.status).toBe(401);
    });

    it('should return storage metrics when authenticated', async () => {
      // 1. Get token
      const loginRes = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'admin@cineblack.com', password: 'password123' });
      
      const token = loginRes.body.access_token;

      // 2. Fetch storage stats
      const response = await request(app.getHttpServer())
        .get('/api/v1/system/storage')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('free');
      expect(response.body).toHaveProperty('used');
    });
  });
});
