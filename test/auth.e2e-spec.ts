import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/modules/users/entities/user.entity';
import { UserRole } from '../src/modules/users/entities/user.entity';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '3306'),
          username: process.env.DB_USERNAME || 'root',
          password: process.env.DB_PASSWORD || '',
          database: process.env.DB_DATABASE || 'nestjs_test',
          entities: [User],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'password123',
          role: UserRole.USER,
        })
        .expect(201)
        .expect(res => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toBe('test@example.com');
          expect(res.body.username).toBe('testuser');
          expect(res.body.role).toBe(UserRole.USER);
          expect(res.body.password).toBeUndefined();
        });
    });

    it('should not register with existing email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          username: 'anotheruser',
          password: 'password123',
          role: UserRole.USER,
        })
        .expect(409);
    });

    it('should login successfully', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('refresh_token');
          accessToken = res.body.access_token;
          refreshToken = res.body.refresh_token;
        });
    });

    it('should not login with wrong password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should refresh access token', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .send({
          refresh_token: refreshToken,
        })
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body.access_token).not.toBe(accessToken);
        });
    });

    it('should not refresh with invalid token', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .send({
          refresh_token: 'invalidtoken',
        })
        .expect(401);
    });
  });

  describe('Protected Routes', () => {
    it('should access protected route with valid token', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should not access protected route without token', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(401);
    });

    it('should not access protected route with invalid token', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);
    });
  });
}); 