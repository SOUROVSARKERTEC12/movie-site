import { describe, beforeEach, it, expect, afterEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Categories CRUD (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let createdCategoryId: string;

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

  it('POST /api/v1/categories - should create a category', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Action', slug: 'action' });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Action');
    createdCategoryId = res.body.id;
  });

  it('GET /api/v1/categories - should list categories', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/categories')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/v1/categories/:id - should get a category', async () => {
    if (!createdCategoryId) return;
    const res = await request(app.getHttpServer())
      .get(`/api/v1/categories/${createdCategoryId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdCategoryId);
  });

  it('PUT /api/v1/categories/:id - should update a category', async () => {
    if (!createdCategoryId) return;
    const res = await request(app.getHttpServer())
      .put(`/api/v1/categories/${createdCategoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Action Movies' });
    
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Action Movies');
  });

  it('DELETE /api/v1/categories/:id - should delete a category', async () => {
    if (!createdCategoryId) return;
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/categories/${createdCategoryId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
  });
});
