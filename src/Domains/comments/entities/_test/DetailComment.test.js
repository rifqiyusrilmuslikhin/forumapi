const DetailComment = require('../DetailComment');

describe('a DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      comments: {},
    };

    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should remap comments data correctly', () => {
    const payload = {
      comments: [
        {
          id: 'comment-_pby2-321',
          username: 'johndoe',
          date: '2022-06-23 15:36:05',
          content: 'sebuah comment',
          is_deleted: false,
        },
        {
          id: 'comment-_pby2-123',
          username: 'dicoding',
          date: '2022-06-23 15:36:05',
          content: 'komentar telah dihapus',
          is_deleted: true,
        },
      ],
    };

    const { comments } = new DetailComment(payload);

    const expectedComment = [
      {
        id: 'comment-_pby2-321',
        username: 'johndoe',
        date: '2022-06-23 15:36:05',
        content: 'sebuah comment',
      },
      {
        id: 'comment-_pby2-123',
        username: 'dicoding',
        date: '2022-06-23 15:36:05',
        content: '**komentar telah dihapus**',
      },
    ];

    expect(comments).toEqual(expectedComment);
  });

  it('should create DetailComment object correctly', () => {
    const payload = {
      comments: [
        {
          id: 'comment-_pby2-321',
          username: 'johndoe',
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
    };

    const { comments } = new DetailComment(payload);

    expect(comments).toEqual(payload.comments);
  });
});
