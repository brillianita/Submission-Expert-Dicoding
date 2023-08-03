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
    const accessToken = await this._authenticationTokenManager
      .getTokenFromHeader(useCaseHeader.authorization);
    await this._authenticationTokenManager.verifyAccessToken(accessToken);
    const { id: owner } = await this._authenticationTokenManager.decodePayload(accessToken);
    console.log('sebelum newcomment usecase', useCaseParam.threadId);
    await this._threadRepository.getDetailThread(useCaseParam.threadId);
    const newComment = new AddComment({
      ...useCasePayload, owner, threadId: useCaseParam.threadId,
    });
    console.log('setelah newcomment usecase', newComment);
    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
