const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const headerAuthorization = request.headers.authorization;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(request.payload, headerAuthorization);
    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getDetailThreadHandler(request, h) {
    console.log('sebelum panggil instance');
    const detailThread = this._container.getInstance(GetDetailThreadUseCase.name);
    console.log('setelah panggil instance');
    const data = await detailThread.execute(request.params);
    console.log('setelah panggil execute');
    const response = h.response({
      status: 'success',
      data: {
        thread: data,
      },
    });

    return response;
  }
}

module.exports = ThreadsHandler;
