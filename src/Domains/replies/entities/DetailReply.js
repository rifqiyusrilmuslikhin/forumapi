class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const replies = this._remappingPayload(payload);
    this.replies = replies;
  }

  _verifyPayload({ replies }) {
    if (!replies) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (!Array.isArray(replies)) {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _remappingPayload({ replies }) {
    return replies.map((reply) => ({
      id: reply.id,
      username: reply.username,
      date: reply.date,
      content: reply.is_deleted ? '**balasan telah dihapus**' : reply.content,
    }));
  }
}

module.exports = DetailReply;
