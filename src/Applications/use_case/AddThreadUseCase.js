const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository, authenticationTokenManager }) {
    this._threadRepository = threadRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload, token) {
    console.log('addThreaduseCase js');
    console.log('usecasepayload', useCasePayload);
    console.log('token usecase', token);
    const accessToken = await this._authenticationTokenManager
      .getTokenFromHeader(token);
    console.log('accesstoken usecase', accessToken);
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await this._authenticationTokenManager.decodePayload(accessToken);
    const newThread = new AddThread({ ...useCasePayload, owner });
    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;
