import { describe, beforeEach, it, expect, afterEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Users CRUD (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let createdUserId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@cineblack.com', password: 'password123' });
    token = loginRes.body.access_token;
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /api/v1/users - should create a user', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'testuser@example.com', name: 'Test User', password: 'securepass' });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('testuser@example.com');
    createdUserId = res.body.id;
  });

  it('GET /api/v1/users - should list users', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/v1/users/:id - should get a user', async () => {
    if (!createdUserId) return;
    const res = await request(app.getHttpServer())
      .get(`/api/v1/users/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdUserId);
  });

  it('PUT /api/v1/users/:id - should update a user', async () => {
    if (!createdUserId) return;
    const res = await request(app.getHttpServer())
      .put(`/api/v1/users/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Banned' });
    
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Banned');
  });

  it('DELETE /api/v1/users/:id - should delete a user', async () => {
    if (!createdUserId) return;
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/users/${createdUserId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
  });
});
