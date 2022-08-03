const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentHandler {
  constructor(container) {
    this._container = container;
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const { content } = request.payload;
    const { id: owner } = request.auth.credentials;
    const thread = request.params.threadId;

    const addedComment = await addCommentUseCase.execute({
      content, thread, owner
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const { id: owner } = request.auth.credentials;
    const thread = request.params.threadId;
    const comment = request.params.commentId;

    await deleteCommentUseCase.execute({
      thread, comment, owner
    });

    return ({
      status: 'success',
    });
  }
}

module.exports = CommentHandler;
