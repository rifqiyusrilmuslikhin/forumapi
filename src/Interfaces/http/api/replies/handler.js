const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class ReplyHandler {
  constructor(container) {
    this._container = container;
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const { content } = request.payload;
    const { id: owner } = request.auth.credentials;
    const comment = request.params.commentId;
    const thread = request.params.threadId;

    const addedReply = await addReplyUseCase.execute({
      content, thread, comment, owner
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    const { id: owner } = request.auth.credentials;
    const thread = request.params.threadId;
    const comment = request.params.commentId;
    const reply = request.params.replyId;

    await deleteReplyUseCase.execute({
      thread, comment, reply, owner
    });

    return ({
      status: 'success',
    });
  }
}

module.exports = ReplyHandler;
