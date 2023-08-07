const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
    // this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload, owner) {
    // const accessToken = await this._authenticationTokenManager
    //   .getTokenFromHeader(token);
    // await this._authenticationTokenManager.verifyAccessToken(accessToken);
    // const { id: owner } = await this._authenticationTokenManager.decodePayload(accessToken);
    const newThread = new AddThread({ ...useCasePayload, owner });
    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;
