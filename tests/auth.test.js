// Auth tests
const request = require('supertest');
const app = require('../src/app');
const { pool } = require('../src/config/db');
const bcrypt = require('bcryptjs');

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // Run teardown and setup to ensure clean state
    // In a real test suite, you might use migrations or fixtures
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'Password123!'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.user).toHaveProperty('id');
      expect(res.body.data.user.email).toEqual('test@example.com');
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');
    });

    it('should not register user with existing email', async () => {
      // First, create a user
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser2',
          email: 'test2@example.com',
          password: 'Password123!'
        });

      // Try to register with same email
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
      // Create a user first
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'loginuser',
          email: 'login@example.com',
          password: 'Password123!'
        });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'Password123!'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');
    });

    it('should not login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'WrongPassword'
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body.status).toEqual('error');
    });
  });
});