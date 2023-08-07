const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // arrange

    const useCaseParam = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const userId = 'user-123';

    const mockCommentRepository = new CommentRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    mockCommentRepository.isCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAccess = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // action
    await deleteCommentUseCase.execute(useCaseParam, userId);

    // assert
    expect(mockCommentRepository.isCommentExist).toBeCalledWith({
      threadId: useCaseParam.threadId, commentId: useCaseParam.commentId,
    });
    expect(mockCommentRepository.verifyCommentAccess).toBeCalledWith({
      owner: userId, commentId: useCaseParam.commentId,
    });
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(useCaseParam.commentId);
  });
});
