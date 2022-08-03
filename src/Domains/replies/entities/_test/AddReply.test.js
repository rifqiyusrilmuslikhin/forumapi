const AddReply = require('../AddReply');

describe('a AddReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      thread: 'thread-h_123',
      comment: 'comment-_pby2_123',
      owner: 'user-123',
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      thread: 'thread-h_123',
      comment: 'comment-_pby2_123',
      owner: 'user-123',
      content: true,
    };

    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create new comment object correctly', () => {
    const payload = {
      thread: 'thread-h_123',
      comment: 'comment-_pby2_123',
      owner: 'user-123',
      content: 'sebuah balasan',
    };

    const { content, thread, comment, owner } = new AddReply(payload);

    expect(content).toEqual(payload.content);
    expect(thread).toEqual(payload.thread);
    expect(comment).toEqual(payload.comment);
    expect(owner).toEqual(payload.owner);
  });
});
