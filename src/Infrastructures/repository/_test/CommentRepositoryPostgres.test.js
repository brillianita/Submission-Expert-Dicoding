const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
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
    // it('addComment function should throw NotFoundError when thread not available', async () => {
    //   // Arrange

    //   // addComment
    //   const payload = {
    //     content: 'isi comment',
    //     threadId: 'thread-1234',
    //     owner: 'user-123',
    //   };
    //   const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

    //   // Assert
    // eslint-disable-next-line max-len
    //   await expect(threadRepositoryPostgres.getDetailThread(payload.threadId)).rejects.toThrowError(NotFoundError);
    // });

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
});
