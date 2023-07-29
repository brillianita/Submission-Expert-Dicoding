const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
  it('should throw errror when invoke abstact behavior', async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action and Assert
    await expect(commentRepository.addComment({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
