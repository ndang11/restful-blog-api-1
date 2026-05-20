import request from 'supertest';
import app from '../src/app.js';
import pool from '../src/config/db.js';

describe('Comments Endpoints', () => {
  let authToken;
  let testUserId;
  let testPostId;

  beforeAll(async () => {
    const timestamp = Date.now();
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'commenttestuser' + timestamp,
        email: 'commenttest' + timestamp + '@example.com',
        password: 'Password123!'
      });
    
    authToken = registerRes.body.data.accessToken;
    testUserId = registerRes.body.data.user.id;

    const postRes = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Post for Comment Testing',
        content: 'This post is for testing comments.',
        authorId: testUserId
      });
    
    testPostId = postRes.body.data.post.id;
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('GET /api/comments/:postId/comments', () => {
    it('should get all comments for a post', async () => {
      const res = await request(app)
        .get(`/api/comments/${testPostId}/comments`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
    });
  });

  describe('POST /api/comments/:postId/comments', () => {
    it('should create a new comment', async () => {
      const res = await request(app)
        .post(`/api/comments/${testPostId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'This is a test comment.',
          authorId: testUserId,
          postId: testPostId
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.comment).toHaveProperty('id');
      expect(res.body.data.comment.content).toEqual('This is a test comment.');
    });

    it('should not create comment with missing fields', async () => {
      const res = await request(app)
        .post(`/api/comments/${testPostId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Incomplete comment'
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.status).toEqual('fail');
    });
  });

  describe('PATCH /api/comments/comments/:id', () => {
    let commentId;

    beforeEach(async () => {
      const createRes = await request(app)
        .post(`/api/comments/${testPostId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Original comment',
          authorId: testUserId,
          postId: testPostId
        });
      
      commentId = createRes.body.data.comment.id;
    });

    it('should update a comment', async () => {
      const res = await request(app)
        .patch(`/api/comments/comments/${commentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Updated comment'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.comment.content).toEqual('Updated comment');
    });
  });

  describe('DELETE /api/comments/comments/:id', () => {
    let commentId;

    beforeEach(async () => {
      const createRes = await request(app)
        .post(`/api/comments/${testPostId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Comment to delete',
          authorId: testUserId,
          postId: testPostId
        });
      
      commentId = createRes.body.data.comment.id;
    });

    it('should delete a comment', async () => {
      const res = await request(app)
        .delete(`/api/comments/comments/${commentId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(204);
    });
  });
});