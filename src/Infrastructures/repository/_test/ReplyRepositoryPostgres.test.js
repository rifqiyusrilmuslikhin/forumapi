const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  it('should be instance of CommentRepository domain', () => {
    const replyRepositoryPostgres = new ReplyRepositoryPostgres({}, {}); // Dummy dependency

    expect(replyRepositoryPostgres).toBeInstanceOf(ReplyRepositoryPostgres);
  });

  describe('behavior test', () => {
    afterEach(async () => {
      await UsersTableTestHelper.cleanTable();
      await RepliesTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addReply function', () => {
      it('should persist new comment and return added reply correctly', async () => {
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
        await ThreadsTableTestHelper.addThread({ 
          id: 'thread-h_123', 
          title: 'sebuah thread',
          body: 'lorem ipsum dolorr sit amet',
          owner: 'user-123', 
        });
        await CommentsTableTestHelper.addComment({ id: 'comment-_pby2-123', owner: 'user-123' });

        const newReply = new AddReply({
          content: 'sebuah balasan',
          thread: 'thread-h_123',
          comment: 'comment-_pby2-123',
          owner: 'user-123',
        });

        const fakeIdGenerator = () => '123';
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

        const addedReply = await replyRepositoryPostgres.addReply(newReply);

        const reply = await RepliesTableTestHelper.findRepliesById('reply-123');
        expect(addedReply).toStrictEqual(new AddedReply({
          id: 'reply-123',
          content: 'sebuah balasan',
          owner: 'user-123',
        }));
        expect(reply).toHaveLength(1);
      });
    });

    describe('checkAvailabilityComment function', () => {
      it('should throw NotFoundError if comment not available', async () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
        const reply = 'xxx';

        // Action & Assert
        await expect(replyRepositoryPostgres.checkAvailabilityReply(reply))
          .rejects.toThrow(NotFoundError);
      });

      it('should not throw NotFoundError if comment available', async () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
        await ThreadsTableTestHelper.addThread({ 
          id: 'thread-h_123', 
          title: 'sebuah thread',
          body: 'lorem ipsum dolorr sit amet',
          owner: 'user-123', 
        });
        await CommentsTableTestHelper.addComment({ id: 'comment-_pby2-123', owner: 'user-123' });
        await RepliesTableTestHelper.addReply({ id: 'reply-123', body: 'sebuah balasan', owner: 'user-123' });

        // Action & Assert
        await expect(replyRepositoryPostgres.checkAvailabilityReply('reply-123'))
          .resolves.not.toThrow(NotFoundError);
      });
    });

    describe('verifyCommentOwner function', () => {
      it('should throw AuthorizationError if comment not belong to owner', async () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
        await UsersTableTestHelper.addUser({ id: 'user-321', username: 'johndoe' });
        await ThreadsTableTestHelper.addThread({ 
          id: 'thread-h_123', 
          title: 'sebuah thread',
          body: 'lorem ipsum dolorr sit amet',
          owner: 'user-123', 
        });
        await CommentsTableTestHelper.addComment({ id: 'comment-_pby2-123', content: 'sebuah comment', owner: 'user-321' });
        await RepliesTableTestHelper.addReply({
          id: 'reply-123', content: 'sebuah balasan', comment: 'comment-_pby2-123', owner: 'user-123',
        });

        // Action & Assert
        await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-321'))
          .rejects.toThrow(AuthorizationError);
      });

      it('should not throw AuthorizationError if comment is belongs to owner', async () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
        await ThreadsTableTestHelper.addThread({ 
          id: 'thread-h_123', 
          title: 'sebuah thread',
          body: 'lorem ipsum dolorr sit amet',
          owner: 'user-123', 
        });
        await CommentsTableTestHelper.addComment({ id: 'comment-_pby2-123', content: 'sebuah comment', owner: 'user-123' });
        await RepliesTableTestHelper.addReply({
          id: 'reply-123', content: 'sebuah balasan', comment: 'comment-_pby2-123', owner: 'user-123',
        });

        // Action & Assert
        await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123'))
          .resolves.not.toThrow(AuthorizationError);
      });
    });

    describe('deleteComment', () => {
      it('should delete comment from database', async () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
        await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
        await ThreadsTableTestHelper.addThread({ 
          id: 'thread-h_123', 
          title: 'sebuah thread',
          body: 'lorem ipsum dolorr sit amet',
          owner: 'user-123', 
        });
        await CommentsTableTestHelper.addComment({ id: 'comment-_pby2-123', thread: 'thread-h_123', content: 'sebuah comment', owner: 'user-123' });
        await RepliesTableTestHelper.addReply({
          id: 'reply-123', content: 'sebuah balasan', thread:'thread-h_123', comment: 'comment-_pby2-123', owner: 'user-123',
        });

        // Action
        await replyRepositoryPostgres.deleteReply('reply-123');

        // Assert
        const reply = await RepliesTableTestHelper.checkIsDeletedRepliesById('reply-123');
        expect(reply).toEqual(true);
      });
    });

    describe('getCommentsThread', () => {
      it('should get comments of thread', async () => {
        const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
        
        const userPayload = { 
          id: 'user-123', 
          username: 'dicoding', 
        };

        const threadPayload = {
          id: 'thread-h_123', 
          title: 'sebuah thread',
          body: 'lorem ipsum dolorr sit amet',
          owner: userPayload.id,
        };

        const commentPayload = {
          id: 'comment-_pby2-123',
          content: 'sebuah comment',
          thread: threadPayload.id,
          owner: userPayload.id,
        };

        const replyPayload = {
          id: 'reply-123',
          content: 'sebuah balasan',
          thread: threadPayload.id,
          comment: commentPayload.id,
          owner: userPayload.id,
        };

        await UsersTableTestHelper.addUser(userPayload);
        await ThreadsTableTestHelper.addThread(threadPayload);
        await CommentsTableTestHelper.addComment(commentPayload);
        await RepliesTableTestHelper.addReply(replyPayload);

        const replies = await replyRepositoryPostgres.getRepliesComment(threadPayload.id, commentPayload.id);

        expect(Array.isArray(replies)).toBe(true);
        expect(replies[0].id).toEqual(replyPayload.id);
        expect(replies[0].username).toEqual(userPayload.username);
        expect(replies[0].content).toEqual('sebuah balasan');
        expect(replies[0].date).toBeDefined();
      });
    });
  });
});
