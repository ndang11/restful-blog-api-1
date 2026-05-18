// Posts tests
const request = require('supertest');
const app = require('../src/app');
const { pool } = require('../src/config/db');

describe('Posts Endpoints', () => {
  let authToken;
  let testUserId;

  beforeAll(async () => {
    // Create a test user and get auth token
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'posttestuser',
        email: 'posttest@example.com',
        password: 'Password123!'
      });
    
    authToken = registerRes.body.data.accessToken;
    testUserId = registerRes.body.data.user.id;
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('GET /api/posts', () => {
    it('should get all posts (empty initially)', async () => {
      const res = await request(app)
        .get('/api/posts')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.posts).toEqual([]); // Should be empty initially
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
      expect(res.body.data.post.content).toEqual('This is the content of the test post.');
    });

    it('should not create post with missing fields', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Incomplete Post'
          // Missing content and authorId
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.status).toEqual('fail');
    });
  });

  describe('GET /api/posts/:id', () => {
    let postId;

    beforeEach(async () => {
      // Create a post for testing
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
      expect(res.body.data.post.title).toEqual('Test Post for GET');
    });

    it('should return 404 for non-existent post', async () => {
      const res = await request(app)
        .get('/api/posts/99999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(404);
      expect(res.body.status).toEqual('fail');
    });
  });

  describe('PATCH /api/posts/:id', () => {
    let postId;

    beforeEach(async () => {
      // Create a post for testing
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
      expect(res.body.data.post.content).toEqual('Updated content.');
    });
  });

  describe('DELETE /api/posts/:id', () => {
    let postId;

    beforeEach(async () => {
      // Create a post for testing
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

    it('should return 404 when trying to get deleted post', async () => {
      // First delete the post
      await request(app)
        .delete(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      // Try to get it
      const res = await request(app)
        .get(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(404);
    });
  });
});