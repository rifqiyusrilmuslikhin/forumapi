const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailThreadUseCase = require('../DetailThreadUseCase');

describe('DetailThreadUseCase', () => {
  it('should get return detail thread correctly', async () => {
    const useCasePayload = {
      thread: 'thread-h_123',
    };

    const expectedThread = {
      id: 'thread-h_123',
      title: 'sebuah thread',
      body: 'lorem ipsum dolor sit amet',
      date: '2022-06-23 15:36:05',
      username: 'dicoding',
    };

    const expectedComment = [
      {
        id: 'comment-_pby2-123',
        username: 'dicoding',
        date: '2022-06-23 15:36:05',
        content: 'sebuah comment',
        is_deleted: false,
      },
      {
        id: 'comment-_pby2-123',
        username: 'dicoding',
        date: '2022-06-23 15:36:05',
        content: 'sebuah comment',
        is_deleted: true,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
    mockThreadRepository.getDetailThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComment));

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const detailThread = await detailThreadUseCase.execute(useCasePayload);

    expect(mockThreadRepository.getDetailThread)
      .toHaveBeenCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.getCommentsThread)
      .toHaveBeenCalledWith(useCasePayload.thread);
    expect(detailThread).toStrictEqual({
      thread: {
        id: 'thread-h_123',
        title: 'sebuah thread',
        body: 'lorem ipsum dolor sit amet',
        date: '2022-06-23 15:36:05',
        username: 'dicoding',
        comments: [
          {
            id: 'comment-_pby2-123',
            username: 'dicoding',
            date: '2022-06-23 15:36:05',
            content: 'sebuah comment',
          },
          {
            id: 'comment-_pby2-123',
            username: 'dicoding',
            date: '2022-06-23 15:36:05',
            content: '**komentar telah dihapus**',
          },
        ],
      },
    });
  });
});
