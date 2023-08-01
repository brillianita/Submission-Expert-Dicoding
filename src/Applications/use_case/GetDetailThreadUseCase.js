/* eslint-disable no-shadow */
class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;
    const threadDetail = await this._threadRepository.getDetailThread(threadId);
    threadDetail.comments = await this._commentRepository.getCommentByThreadId(threadId);

    return threadDetail;
  }
}

module.exports = GetDetailThreadUseCase;
