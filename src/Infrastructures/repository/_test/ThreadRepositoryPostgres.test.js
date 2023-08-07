const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

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
  describe('getDetailThread function', () => {
    it('should return thread and comment correctly', async () => {
      // arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'User1123' });

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const detailThread = await threadRepositoryPostgres.getDetailThread('thread-123');
      const expectedDetailThread = {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'isi thread',
        date: '2021-08-08T07:22:33.555Z',
        username: 'User1123',
      };
      expect(detailThread).toEqual(expectedDetailThread);
    });

    it('should not throw NotFounderror if thread not available', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getDetailThread('thread-345')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('verifyAvailableThread function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-1')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'user-123',
        password: 'password-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyAvailableThread('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });
});
