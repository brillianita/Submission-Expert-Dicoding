const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const headerAuthorization = request.headers.authorization;
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute(
      request.payload,
      request.params,
      request.headers,
    );
    console.log('setelah addedThread');
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
    console.log('ini params handler', request.params);
    await deleteCommentUseCase.execute(
      request.params,
      request.headers,
    );
    // await this._deleteCommentUseCase.execute(request.params, request.headers);
    return h.response({
      status: 'success',
    });
  }
}

module.exports = CommentsHandler;
