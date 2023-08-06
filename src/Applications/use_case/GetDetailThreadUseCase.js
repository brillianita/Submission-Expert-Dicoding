/* eslint-disable no-shadow */
class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCaseParam) {
    const { threadId } = useCaseParam;
    const threadDetail = await this._threadRepository.getDetailThread(threadId);
    const commentData = await this._commentRepository.getCommentByThreadId(threadId);
    // const objData = comments.map((obj) => (obj.is_delete === true ? {
    //   ...obj,
    //   content: '**komentar telah dihapus**',
    // } : obj));
    // // eslint-disable-next-line no-param-reassign
    // objData.forEach((obj) => { delete obj.is_delete; });
    // threadDetail.comments = objData;
    const comments = commentData.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_delete
        ? '**komentar telah dihapus**'
        : comment.content,
    }));
    threadDetail.comments = comments;
    console.log('ini thread detail', threadDetail);
    console.log('obj data', comments);
    return threadDetail;
  }
}

module.exports = GetDetailThreadUseCase;
