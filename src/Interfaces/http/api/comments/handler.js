const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const headerAuthorization = request.headers.authorization;
    console.log('ini authorization handler', headerAuthorization);
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    console.log('setelah addcommenthandler');
    console.log('request payload', request.payload);
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
}

module.exports = CommentsHandler;
