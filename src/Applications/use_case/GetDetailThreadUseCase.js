/* eslint-disable no-shadow */
class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;
    console.log('sebelum thread usecase', threadId);
    const threadDetail = await this._threadRepository.getDetailThread(threadId);
    console.log('setelah thread usecase');
    threadDetail.comments = await this._commentRepository.getCommentByThreadId(threadId);
    console.log('ini detail thread reslt', threadDetail);
    // for (let i = 0; i < threadDetail.comments.length; i += 1) {
    //   threadDetail.comments[i].replies = threadReplies
    //     .filter((reply) => reply.commentId === threadDetail.comments[i].id)
    //     .map((reply) => {
    //       const { commentId, ...replyDetail } = reply;
    //       return replyDetail;
    //     });
    // }

    return threadDetail;
  }
}

module.exports = GetDetailThreadUseCase;
