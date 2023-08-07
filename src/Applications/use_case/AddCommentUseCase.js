const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({
    threadRepository, commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, useCaseParam, owner) {
    await this._threadRepository.verifyAvailableThread(useCaseParam.threadId);
    const newComment = new AddComment({
      ...useCasePayload, owner, threadId: useCaseParam.threadId,
    });
    console.log('setelah newcomment usecase', newComment);
    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
