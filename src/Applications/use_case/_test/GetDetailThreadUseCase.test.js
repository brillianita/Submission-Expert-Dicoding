const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrate the get thread detail action correctly', async () => {
    // arrange
    const useCaseParam = {
      threadId: 'thread-123',
    };
    const expectedDetailThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'isi thread',
      date: '2021-08-08T07:19:00.775Z',
      username: 'user-123',
    };

    const expectedComments = [
      {
        id: 'comment-123',
        username: 'user1',
        date: '2021-08-08T07:19:09.775Z',
        content: 'comment1',
        is_delete: false,
      },
      {
        id: 'comment-234',
        username: 'user2',
        date: '2022-08-08T07:19:09.775Z',
        content: '**komentar telah dihapus**',
        is_delete: true,
      },
    ];
    // const expectedDetailThread = new DetailThread({
    //   id: 'thread-123',
    //   title: 'sebuah thread',
    //   body: 'isi thread',
    //   date: '2021-08-08T07:19:09.775Z',
    //   username: 'dicoding',
    //   comments: [],
    // });

    // const expectedComments = [
    //   new DetailComment({
    //     id: 'comment-123',
    //     username: 'user1',
    //     date: '2021-08-08T07:19:09.775Z',
    //     content: 'comment1',
    //   }),
    //   new DetailComment({
    //     id: 'comment-234',
    //     username: 'user2',
    //     date: '2022-08-08T07:19:09.775Z',
    //     content: 'comment2',
    //   }),
    // ];
    // eslint-disable-next-line max-len
    const mappedComments = expectedComments.map(({ is_delete: deleteComment, ...otherProperties }) => otherProperties);
    // const expectedCommentsByThread = [
    //   { ...expectedComments[0] },
    //   { ...expectedComments[1] },
    // ];

    const expectedCommentsByThread = [
      ...mappedComments,
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getDetailThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedDetailThread));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));
    console.log('ini expected detail thread', expectedDetailThread);
    console.log('ini expected detail comment', expectedComments);
    console.log('ini expected comment', expectedCommentsByThread);
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action
    const useCaseResult = await getDetailThreadUseCase.execute(useCaseParam);
    console.log('usecase result', useCaseResult);
    console.log('ini new detail thread', new DetailThread({
      ...expectedDetailThread, comments: expectedCommentsByThread,
    }));
    // assert
    expect(useCaseResult).toEqual(new DetailThread({
      ...expectedDetailThread, comments: expectedCommentsByThread,
    }));
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCaseParam.threadId);
  });
});
