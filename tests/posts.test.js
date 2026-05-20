import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/config/db.js';

describe('Posts Endpoints', () => {
  let authToken;
  let testUserId;

  beforeAll(async () => {
    const timestamp = Date.now();
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'posttestuser' + timestamp,
        email: 'posttest' + timestamp + '@example.com',
        password: 'Password123!'
      });
    
    authToken = registerRes.body.data.accessToken;
    testUserId = registerRes.body.data.user.id;
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('GET /api/posts', () => {
    it('should get all posts', async () => {
      const res = await request(app)
        .get('/api/posts')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
    });
  });

  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Post Title',
          content: 'This is the content of the test post.',
          authorId: testUserId
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.post).toHaveProperty('id');
      expect(res.body.data.post.title).toEqual('Test Post Title');
    });

    it('should not create post with missing fields', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Incomplete Post'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.status).toEqual('fail');
    });
  });

  describe('GET /api/posts/:id', () => {
    let postId;

    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Post for GET',
          content: 'Content for GET test.',
          authorId: testUserId
        });
      
      postId = createRes.body.data.post.id;
    });

    it('should get a single post by id', async () => {
      const res = await request(app)
        .get(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.post.id).toEqual(postId);
    });

    it('should return 404 for non-existent post', async () => {
      const res = await request(app)
        .get('/api/posts/99999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('PATCH /api/posts/:id', () => {
    let postId;

    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Original Title',
          content: 'Original content.',
          authorId: testUserId
        });
      
      postId = createRes.body.data.post.id;
    });

    it('should update a post', async () => {
      const res = await request(app)
        .patch(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Title',
          content: 'Updated content.'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.post.title).toEqual('Updated Title');
    });
  });

  describe('DELETE /api/posts/:id', () => {
    let postId;

    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Post to Delete',
          content: 'This post will be deleted.',
          authorId: testUserId
        });
      
      postId = createRes.body.data.post.id;
    });

    it('should delete a post', async () => {
      const res = await request(app)
        .delete(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(204);
    });
  });
});