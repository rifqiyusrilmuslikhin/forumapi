const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      thread: 'thread-h_123',
      comment: 'comment-_pby2-123',
      content: 'sebuah komentar',
      owner: 'user-123',
    };

    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: 'sebuah balasan',
      owner: 'user-123',
    });

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedReply));

    const getReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedReply = await getReplyUseCase.execute(useCasePayload);

    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(useCasePayload.comment);
    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply({
      thread: useCasePayload.thread,
      comment: useCasePayload.comment,
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    }));
  });
});
