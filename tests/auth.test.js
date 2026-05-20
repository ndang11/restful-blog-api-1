import request from 'supertest';
import app from '../src/app.js';
import { pool } from '../src/config/db.js';
import bcrypt from 'bcryptjs';

describe('Auth Endpoints', () => {
  afterAll(async () => {
    await pool.end();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser' + Date.now(),
          email: 'test' + Date.now() + '@example.com',
          password: 'Password123!'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.user).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');
    });

    it('should not register user with existing email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser2',
          email: 'test2@example.com',
          password: 'Password123!'
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'anotheruser',
          email: 'test2@example.com',
          password: 'Password123!'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.status).toEqual('fail');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user with correct credentials', async () => {
      const timestamp = Date.now();
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'loginuser' + timestamp,
          email: 'login' + timestamp + '@example.com',
          password: 'Password123!'
        });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login' + timestamp + '@example.com',
          password: 'Password123!'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');
    });

    it('should not login with incorrect password', async () => {
      const timestamp = Date.now();
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'loginuser2' + timestamp,
          email: 'login2' + timestamp + '@example.com',
          password: 'Password123!'
        });
      
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login2' + timestamp + '@example.com',
          password: 'WrongPassword'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body.status).toEqual('fail');
    });
  });
});