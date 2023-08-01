const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist addThread', async () => {
      // Arrange

      // add user
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      // add thread
      const addThread = new AddThread({
        title: 'sebuah thread',
        body: 'isi thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange

      // add user
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      // add thread
      const addThread = new AddThread({
        title: 'sebuah thread',
        body: 'isi thread',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: `thread-${fakeIdGenerator()}`,
        title: 'sebuah thread',
        owner: 'user-123',
      }));
    });
  });
  describe('getRepliesByThreadId function', () => {
    it('should return thread and comment correctly', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'User1' });
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'User2' });

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      await CommentsTableTestHelper.addComment({ id: 'comment-123', owner: 'user-123', threadId: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-234', owner: 'user-234', threadId: 'thread-123' });
      console.log('sebelum threadrepositorypostgres test');
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      console.log('setelah threadrepositorypostgres test');
      const detailThread = await threadRepositoryPostgres.getDetailThread('thread-123');
      console.log('setelah detailThread test');
      const expectedDetailThread = {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'isi thread',
        date: '2021-08-08T07:22:33.555Z',
        username: 'User1',
        comments: [
          {
            id: 'comment-123',
            username: 'User1',
            date: '2021-08-08T07:22:33.555Z',
            content: 'isi comment',
          },
          {
            id: 'comment-234',
            username: 'User2',
            date: '2021-08-08T07:22:33.555Z',
            content: 'isi comment',
          },
        ],
      };
      expect(detailThread).toEqual(expectedDetailThread);
    });
  });
});
