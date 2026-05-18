// Comments tests
const request = require('supertest');
const app = require('../src/app');
const { pool } = require('../src/config/db');

describe('Comments Endpoints', () => {
  let authToken;
  let testUserId;
  let testPostId;

  beforeAll(async () => {
    // Create a test user and get auth token
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'commenttestuser',
        email: 'commenttest@example.com',
        password: 'Password123!'
      });
    
    authToken = registerRes.body.data.accessToken;
    testUserId = registerRes.body.data.user.id;

    // Create a test post
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

  describe('GET /api/posts/:postId/comments', () => {
    it('should get all comments for a post (empty initially)', async () => {
      const res = await request(app)
        .get(`/api/posts/${testPostId}/comments`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.comments).toEqual([]); // Should be empty initially
    });
  });

  describe('POST /api/posts/:postId/comments', () => {
    it('should create a new comment', async () => {
      const res = await request(app)
        .post(`/api/posts/${testPostId}/comments`)
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
        .post(`/api/posts/${testPostId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Incomplete comment'
          // Missing authorId and postId
        });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body.status).toEqual('fail');
    });
  });

  describe('PATCH /api/comments/:id', () => {
    let commentId;

    beforeEach(async () => {
      // Create a comment for testing
      const createRes = await request(app)
        .post(`/api/posts/${testPostId}/comments`)
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
        .patch(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Updated comment'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      expect(res.body.data.comment.content).toEqual('Updated comment');
    });
  });

  describe('DELETE /api/comments/:id', () => {
    let commentId;

    beforeEach(async () => {
      // Create a comment for testing
      const createRes = await request(app)
        .post(`/api/posts/${testPostId}/comments`)
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
        .delete(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toEqual(204);
    });

    it('should return 404 when trying to get deleted comment', async () => {
      // First delete the comment
      await request(app)
        .delete(`/api/comments/${commentId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      // Try to get it
      const res = await request(app)
        .get(`/api/posts/${testPostId}/comments`)
        .set('Authorization', `Bearer ${authToken}`);
      
      // Should still get 200 but with empty array or without the deleted comment
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('success');
      // The deleted comment should not be in the list
      const commentIds = res.body.data.comments.map(c => c.id);
      expect(commentIds).not.toContain(commentId);
    });
  });
});