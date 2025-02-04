import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtService } from '@nestjs/jwt';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication & Authorization', () => {
    it('should require authentication for protected routes', () => {
      return request(app.getHttpServer())
        .get('/hello')
        .expect(401);
    });

    it('should allow access with valid JWT token', async () => {
      // Create a valid JWT token
      const token = jwtService.sign({ 
        sub: '1',
        email: 'test@example.com',
        name: 'Test User'
      });

      return request(app.getHttpServer())
        .get('/hello')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('Hello World!');
          expect(res.body.user).toBeDefined();
        });
    });

    it('should reject invalid JWT tokens', () => {
      return request(app.getHttpServer())
        .get('/hello')
        .set('Authorization', 'Bearer invalid.token')
        .expect(401);
    });
  });
});
