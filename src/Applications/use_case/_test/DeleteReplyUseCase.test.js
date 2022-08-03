const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should throw error if use case payload not contain thread id and comment id', async () => {
    const useCasePayload = {};
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_VALID_PAYLOAD');
  });

  it('should throw error if payload not string', async () => {
    // Arrange
    const useCasePayload = {
      thread: 1,
      comment: 1,
      reply: 1,
      owner: 1,
    };
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-h_123',
      comment: 'comment-_pby2_123',
      reply: 'reply-123',
      owner: 'user_123',
    };
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.checkAvailabilityReply = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Act
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkAvailabilityThread)
      .toHaveBeenCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.checkAvailabilityComment)
      .toHaveBeenCalledWith(useCasePayload.comment);
    expect(mockReplyRepository.checkAvailabilityReply)
      .toHaveBeenCalledWith(useCasePayload.reply);
    expect(mockReplyRepository.verifyReplyOwner)
      .toHaveBeenCalledWith(useCasePayload.reply, useCasePayload.owner);
    expect(mockReplyRepository.deleteReply)
      .toHaveBeenCalledWith(useCasePayload.reply);
  });
});
