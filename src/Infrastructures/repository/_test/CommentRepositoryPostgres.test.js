const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  beforeAll(async () => {
    const userId = 'user-123';
    const threadId = 'thread-123';
    await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
  });

  describe('addComment function', () => {
    it('should create new comment and return added comment correctly', async () => {
      // Arrange

      // addComment
      const addComment = new AddComment({
        content: 'isi comment',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      // function fakeDateGenerator() {
      //   this.toISOString = () => '202021-08-08T07:22:33.555Z21';
      // }
      const fakeDateGenerator = () => '202021-08-08T07:22:33.555Z21';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeDateGenerator,
      );
      console.log('ini date di test', fakeDateGenerator);
      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
    });

    // it('should not throw NotFounderror if thread not available', async () => {
    //   // Arrange
    //   const addComment = new AddComment({
    //     content: 'isi comment',
    //     threadId: 'thread-345',
    //     owner: 'user-123',
    //   });
    //   const fakeIdGenerator = () => '123'; // stub!
    //   // function fakeDateGenerator() {
    //   //   this.toISOString = () => '202021-08-08T07:22:33.555Z21';
    //   // }
    //   const fakeDateGenerator = () => '202021-08-08T07:22:33.555Z21';
    //   const commentRepositoryPostgres = new CommentRepositoryPostgres(
    //     pool,
    //     fakeIdGenerator,
    //     fakeDateGenerator,
    //   );

    //   // Action & Assert
    // eslint-disable-next-line max-len, max-len
    //   await expect(commentRepositoryPostgres.addComment(addComment)).rejects.toThrowError(NotFoundError);
    // });

    it('should return added comment correctly', async () => {
      // Arrange

      // addComment
      const addComment = new AddComment({
        content: 'isi comment',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const fakeDateGenerator = () => '202021-08-08T07:22:33.555Z21';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
        fakeDateGenerator,
      );
      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: `comment-${fakeIdGenerator()}`,
        content: 'isi comment',
        owner: 'user-123',
      }));
    });
  });

  describe('isCommentExist function', () => {
    it('should throw NotFoundError when comment doesn\'t exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      await expect(commentRepositoryPostgres.isCommentExist({ threadId: 'thread-123', commentId: 'comment-234' }))
        .rejects.toThrowError('comment tidak ditemukan');
    });

    it('should find comment', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {},
        {},
      );

      await expect(commentRepositoryPostgres.isCommentExist({ threadId: 'thread-123', commentId: 'comment-123' }))
        .resolves.toBeUndefined();
      await expect(commentRepositoryPostgres.isCommentExist({ threadId: 'thread-123', commentId: 'comment-123' }))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentAccess function', () => {
    it('should throw AuthorizationError when user doesn\'t have access', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {},
        {},
      );
      await expect(commentRepositoryPostgres.verifyCommentAccess({
        threadId: 'thread-123', owner: 'user-234',
      })).rejects.toThrowError('gagal menghapus comment. Anda tidak memiliki akses');
    });

    it('should not throw error if user has authorization', async () => {
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {},
        {},
      );
      await expect(commentRepositoryPostgres.verifyCommentAccess({
        commentId: 'comment-123', owner: 'user-123',
      })).resolves.toBeUndefined();
      await expect(commentRepositoryPostgres.verifyCommentAccess({ commentId: 'comment-123', owner: 'user-123' }))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteCommentById', () => {
    it('should delete comment by id correctly', async () => {
      // arrange
      const addedComment = {
        commentId: 'comment-123',
        threadId: 'thread-123',
      };

      await CommentsTableTestHelper.addComment({
        id: addedComment.commentId, threadId: addedComment.threadId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      // action
      await commentRepositoryPostgres.deleteCommentById(addedComment.commentId);
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');

      // assert
      expect(comment[0].is_delete).toEqual(true);
    });

    it('should not throw NotFounderror if comment not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteCommentById('comment-345')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('getCommentByThreadId', () => {
    it('should retrieve all comments from a thread', async () => {
      const firstComment = {
        id: 'comment-1123', date: '2021-08-08T07:19:09.775Z', content: 'comment1',
      };
      const secondComment = {
        id: 'comment-234', date: '2022-08-08T07:19:09.775Z', content: 'comment2',
      };
      await CommentsTableTestHelper.addComment(firstComment);
      await CommentsTableTestHelper.addComment(secondComment);
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        {},
        {},
      );
      console.log('ini rows di test', [{ ...firstComment, username: 'dicoding' }, { ...secondComment, username: 'dicoding' }]);

      const commentDetails = await commentRepositoryPostgres.getCommentByThreadId('thread-123');
      expect(commentDetails).toEqual([
        { ...firstComment, username: 'dicoding' }, { ...secondComment, username: 'dicoding' }]);
    });
  });
});
