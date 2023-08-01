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

    const expectedDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'isi thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [],
    });

    const expectedComments = [
      new DetailComment({
        id: 'comment-123',
        username: 'user1',
        date: '2021-08-08T07:19:09.775Z',
        content: 'comment1',
      }),
      new DetailComment({
        id: 'comment-234',
        username: 'user2',
        date: '2022-08-08T07:19:09.775Z',
        content: 'comment2',
      }),
    ];

    const expectedCommentsByThread = [
      { ...expectedComments[0] },
      { ...expectedComments[1] },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getDetailThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedDetailThread));
    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // action
    const useCaseResult = await getDetailThreadUseCase.execute(useCaseParam);
    // assert
    expect(useCaseResult).toEqual(new DetailThread({
      ...expectedDetailThread, comments: expectedCommentsByThread,
    }));
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(useCaseParam.threadId);
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(useCaseParam.threadId);
  });
});
