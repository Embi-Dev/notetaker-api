// test/app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Types } from 'mongoose';
import { JWT } from './test.config';

describe('NotesController (e2e)', () => {
  let app: INestApplication;
  let createdNoteId: string;

  const MANUAL_JWT_TOKEN = JWT;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Notes CRUD Operations', () => {
    it('POST /notes - should create a new note', async () => {
      const response = await request(app.getHttpServer())
        .post('/notes')
        .set('Authorization', `Bearer ${MANUAL_JWT_TOKEN}`)
        .send({
          title: 'Test Note',
          content: 'This is a test note content',
          tags: ['test', 'e2e'],
        })
        .expect(201);

      expect(response.body).toHaveProperty('data._id');
      expect(response.body.message).toBe('Note created successfully');
      createdNoteId = response.body.data._id;
    });

    it('GET /notes - should retrieve user notes', async () => {
      const response = await request(app.getHttpServer())
        .get('/notes')
        .set('Authorization', `Bearer ${MANUAL_JWT_TOKEN}`)
        .expect(200);

      expect(response.body.notes).toBeInstanceOf(Array);
      expect(response.body.notes.length).toBeGreaterThanOrEqual(1);
    });

    it('GET /notes/:id - should get a specific note', async () => {
      const response = await request(app.getHttpServer())
        .get(`/notes/${createdNoteId}`)
        .set('Authorization', `Bearer ${MANUAL_JWT_TOKEN}`)
        .expect(200);

      expect(response.body._id).toBe(createdNoteId);
      expect(response.body.title).toBe('Test Note');
    });

    it('PUT /notes/:id - should update a note', async () => {
      const updatedData = {
        title: 'Updated Test Note',
        content: 'Updated content',
        tags: ['updated'],
      };

      const response = await request(app.getHttpServer())
        .put(`/notes/${createdNoteId}`)
        .set('Authorization', `Bearer ${MANUAL_JWT_TOKEN}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.title).toBe(updatedData.title);
      expect(response.body.content).toBe(updatedData.content);
    });

    it('GET /notes/:id - should return 404 for non-existent note', async () => {
      const fakeId = new Types.ObjectId().toString();
      await request(app.getHttpServer())
        .get(`/notes/${fakeId}`)
        .set('Authorization', `Bearer ${MANUAL_JWT_TOKEN}`)
        .expect(404);
    });

    it('POST /notes - should reject empty title (400)', async () => {
      await request(app.getHttpServer())
        .post('/notes')
        .set('Authorization', `Bearer ${MANUAL_JWT_TOKEN}`)
        .send({
          content: 'Content without title',
          tags: ['test'],
        })
        .expect(400);
    });
  });

  describe('Authentication Tests', () => {
    it('should reject requests without token (401)', async () => {
      await request(app.getHttpServer()).get('/notes').expect(401);
    });

    it('should reject requests with invalid token (401)', async () => {
      await request(app.getHttpServer())
        .get('/notes')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);
    });
  });
});
