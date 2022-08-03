const DetailReply = require('../DetailReply');

describe('a DetailReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      replies: {},
    };

    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should remap replies data correctly', () => {
    const payload = {
      replies: [
        {
          id: 'reply-321',
          username: 'johndoe',
          date: '2022-06-23 15:36:05',
          content: 'sebuah balasan',
          is_deleted: false,
        },
        {
          id: 'reply-123',
          username: 'dicoding',
          date: '2022-06-23 15:36:05',
          content: 'balasan telah dihapus',
          is_deleted: true,
        },
      ],
    };

    const { replies } = new DetailReply(payload);

    const expectedReply = [
      {
        id: 'reply-321',
        username: 'johndoe',
        date: '2022-06-23 15:36:05',
        content: 'sebuah balasan',
      },
      {
        id: 'reply-123',
        username: 'dicoding',
        date: '2022-06-23 15:36:05',
        content: '**balasan telah dihapus**',
      },
    ];

    expect(replies).toEqual(expectedReply);
  });

  it('should create DetailReply object correctly', () => {
    const payload = {
      replies: [
        {
          id: 'reply-321',
          username: 'johndoe',
          date: '2022-06-23 15:36:05',
          content: 'sebuah balasan',
        },
        {
          id: 'reply-123',
          username: 'dicoding',
          date: '2022-06-23 15:36:05',
          content: '**balasan telah dihapus**',
        },
      ],
    };

    const { replies } = new DetailReply(payload);

    expect(replies).toEqual(payload.replies);
  });
});
