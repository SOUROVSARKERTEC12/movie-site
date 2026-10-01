import { describe, beforeEach, it, expect, afterEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('StorageModule (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let createdPathId: string;

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

  it('/api/v1/storage/paths (POST) - should create a storage path', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/storage/paths')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Main Storage',
        path: '/var/movies',
        maxLimitGb: 1000
      });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Main Storage');
    createdPathId = res.body.id;
  });

  it('/api/v1/storage/paths (GET) - should list storage paths', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/storage/paths')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('/api/v1/storage/paths/:id (PUT) - should update a storage path', async () => {
    const res = await request(app.getHttpServer())
      .put(`/api/v1/storage/paths/${createdPathId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Secondary Storage', maxLimitGb: 2000 });
    
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Secondary Storage');
    expect(res.body.maxLimitGb).toBe(2000);
  });

  it('/api/v1/storage/metrics (GET) - should retrieve real-time metrics', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/storage/metrics')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalMaxLimitGb');
    expect(res.body).toHaveProperty('totalUsedGb');
    expect(res.body).toHaveProperty('totalFreeGb');
  });

  it('/api/v1/storage/paths/:id (DELETE) - should delete a storage path', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/storage/paths/${createdPathId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
  });
});
