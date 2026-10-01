import { describe, beforeEach, it, expect, afterEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Admins CRUD (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let createdAdminId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login to get token
    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'admin@cineblack.com', password: 'password123' });
    token = loginRes.body.access_token;
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /api/v1/admins - should create an admin', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/admins')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'newadmin@example.com', name: 'New Admin', password: 'securepass' });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('newadmin@example.com');
    createdAdminId = res.body.id;
  });

  it('GET /api/v1/admins - should list admins', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/admins')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/v1/admins/:id - should get an admin', async () => {
    if (!createdAdminId) return; // Skip if creation failed
    const res = await request(app.getHttpServer())
      .get(`/api/v1/admins/${createdAdminId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdAdminId);
  });

  it('PUT /api/v1/admins/:id - should update an admin', async () => {
    if (!createdAdminId) return;
    const res = await request(app.getHttpServer())
      .put(`/api/v1/admins/${createdAdminId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Admin' });
    
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated Admin');
  });

  it('DELETE /api/v1/admins/:id - should delete an admin', async () => {
    if (!createdAdminId) return;
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/admins/${createdAdminId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
  });
});
