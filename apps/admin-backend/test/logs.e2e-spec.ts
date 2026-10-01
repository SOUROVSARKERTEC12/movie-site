import { describe, beforeEach, it, expect, afterEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('LogsModule (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@cineblack.com', password: 'password123' });
    token = loginRes.body.access_token;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/v1/logs/audit (GET) - should return audit logs', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/logs/audit')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('/api/v1/logs/user-activity (GET) - should return user activities', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/logs/user-activity')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('/api/v1/logs/audit/reset (POST) - should reset audit logs', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/logs/audit/reset')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
  });

  it('/api/v1/logs/user-activity/reset (POST) - should reset user activities', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/logs/user-activity/reset')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
  });
});
