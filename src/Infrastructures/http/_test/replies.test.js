const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 401 if payload not access token', async () => {
      // Arrange
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        payload: {},
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 if payload not contain needed property', async () => {
      // Arrange
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };

      const threadPayload = {
        title: 'sebuah thread',
        body: 'lorem ipsum dolorr sit amet',
      };

      const commentPayload = {
        content: 'sebuah comment',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}`},
      });

      const commentResponse = JSON.parse(comment.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies`,
        payload: {},
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 if payload not meet data type specification', async () => {
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };

      const threadPayload = {
        title: 'sebuah thread',
        body: 'lorem ipsum dolorr sit amet',
      };

      const commentPayload = {
        content: 'sebuah comment',
      }

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}`},
      });

      const commentResponse = JSON.parse(comment.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies`,
        payload: { content: 123, },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena tipe data tidak sesuai');
    });

    it('should response 404 if thread id not valid', async () => {
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };

      const threadPayload = {
        title: 'sebuah thread',
        body: 'lorem ipsum dolorr sit amet',
      };

      const commentPayload = {
        content: 'sebuah comment',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}`},
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments/xxx/replies`,
        payload: {
          content: 'sebuah balasan',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('komentar tidak ditemukan di database');
    });

    it('should response 201 and return addedComment', async () => {
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };

      const threadPayload = {
        title: 'sebuah thread',
        body: 'lorem ipsum dolorr sit amet',
      };

      const commentPayload = {
        content: 'sebuah comment',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}`},
      });

      const commentResponse = JSON.parse(comment.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies`,
        payload: {
          content: 'sebuah balasan',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply.content).toEqual('sebuah balasan');
    });
  });

  describe('when DELETE /threads/{threadId}/comments', () => {
    it('should response 403 if another user delete the comment', async () => {
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const loginPayload2 = {
        username: 'johndoe',
        password: 'secret',
      };

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };

      const userPayload2 = {
        username: 'johndoe',
        password: 'secret',
        fullname: 'Johndoe',
      };

      const threadPayload = {
        title: 'sebuah thread',
        body: 'lorem ipsum dolorr sit amet',
      };

      const commentPayload = {
        content: 'sebuah comment',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload2,
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}`},
      });

      const commentResponse = JSON.parse(comment.payload);

      // Action
      const reply = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies`,
        payload: {
          content: 'sebuah balasan',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const replyResponse = JSON.parse(reply.payload);

      const authentication2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload2,
      });

      const responseAuth2 = JSON.parse(authentication2.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies/${replyResponse.data.addedReply.id}`,
        headers: { Authorization: `Bearer ${responseAuth2.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('anda tidak bisa menghapus balasan orang lain.');
    });

    it('should response 404 if comment not found', async () => {
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };

      const threadPayload = {
        title: 'sebuah thread',
        body: 'lorem ipsum dolorr sit amet',
      };

      const commentPayload = {
        content: 'sebuah comment',
      }

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}`},
      });

      const commentResponse = JSON.parse(comment.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies/xxx`,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('balasan tidak ditemukan di database');
    });

    it('should response 200 and return success', async () => {
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };

      const threadPayload = {
        title: 'sebuah thread',
        body: 'lorem ipsum dolorr sit amet',
      };

      const commentPayload = {
        content: 'sebuah comment',
      }

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload,
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      const responseAuth = JSON.parse(authentication.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const threadResponse = JSON.parse(thread.payload);

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}`},
      });

      const commentResponse = JSON.parse(comment.payload);

      // Action
      const replies = await server.inject({
        method: 'POST',
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies`,
        payload: {
          content: 'sebuah balasan',
        },
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const repliesResponse = JSON.parse(replies.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadResponse.data.addedThread.id}/comments/${commentResponse.data.addedComment.id}/replies/${repliesResponse.data.addedReply.id}`,
        headers: { Authorization: `Bearer ${responseAuth.data.accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
