const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ commentRepository, threadRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newReply = new AddReply(useCasePayload);
    await this._threadRepository.checkAvailabilityThread(newReply.thread);
    await this._commentRepository.checkAvailabilityComment(newReply.comment);
    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
