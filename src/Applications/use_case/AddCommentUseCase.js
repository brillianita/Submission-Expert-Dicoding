const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({
    threadRepository, commentRepository, authenticationTokenManager,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload, useCaseParam, useCaseHeader) {
    console.log('sebelum accesstoken');
    const accessToken = await this._authenticationTokenManager
      .getTokenFromHeader(useCaseHeader.authorization);
    console.log('Setelah accesstoken usecase');
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await this._authenticationTokenManager.decodePayload(accessToken);
    // await this._threadRepository.getThreadById(useCaseParam.threadId);
    console.log('sebelum newcomment usecase');
    const newComment = new AddComment({
      ...useCasePayload, owner, threadId: useCaseParam.threadId,
    });
    console.log('setelah newcomment usecase', newComment);
    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
