import { describe, beforeEach, it, expect, afterEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { ZodValidationExceptionFilter } from '../src/filters/zod-validation-exception.filter';

describe('MoviesModule (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let createdMovieId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ZodValidationPipe());
    app.useGlobalFilters(new ZodValidationExceptionFilter());
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

  it('/api/v1/movies (POST) - should create a movie', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/movies')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Inception',
        originalTitle: 'Inception',
        description: 'A thief who steals corporate secrets...',
        category: 'Sci-Fi',
        subcategory: 'Thriller',
        releaseYear: 2010,
        rating: 8.8,
        duration: '2h 28m',
        language: 'English',
        quality: '4K',
        director: 'Christopher Nolan'
      });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Inception');
    createdMovieId = res.body.id;
  });

  it('/api/v1/movies (GET) - should return movies array', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/movies')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('/api/v1/movies/:id (GET) - should return single movie', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/movies/${createdMovieId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdMovieId);
  });

  it('/api/v1/movies/:id (PUT) - should update a movie', async () => {
    const res = await request(app.getHttpServer())
      .put(`/api/v1/movies/${createdMovieId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Inception (Updated)' });
    
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Inception (Updated)');
  });

  it('/api/v1/movies/:id (DELETE) - should delete a movie', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/v1/movies/${createdMovieId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
  });
});
