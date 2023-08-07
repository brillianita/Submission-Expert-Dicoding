const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    console.log('ini request', request);
    console.log('ini request', request.auth.credentials);
    console.log('ini request', request.payload);
    const { id: owner } = request.auth.credentials;
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute(
      request.payload,
      request.params,
      owner,
    );
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
    const { id: owner } = request.auth.credentials;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute(
      request.params,
      owner,
    );
    // await this._deleteCommentUseCase.execute(request.params, request.headers);
    return h.response({
      status: 'success',
    });
  }
}

module.exports = CommentsHandler;
