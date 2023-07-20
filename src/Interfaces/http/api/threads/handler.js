const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const headerAuthorization = request.headers.authorization;
    console.log('ini authorization handler', headerAuthorization);
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    console.log('setelah addthreadusecase');
    console.log('request payload', request.payload);
    const addedThread = await addThreadUseCase.execute(request.payload, headerAuthorization);
    console.log('setelah addedThread');
    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;
