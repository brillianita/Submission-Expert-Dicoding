const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  it('should be an instance of ThreadRepository domain', () => {
    const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {});

    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
  });
  describe('behavior test', () => {
    afterEach(async () => {
      await ThreadsTableTestHelper.cleanTable();
      await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
      await pool.end();
    });

    describe('addThread function', () => {
      it('should create new thread and return added thread correctly', async () => {
        // arrange

        /* arranging for add pe-existing */
        await UsersTableTestHelper.addUser({
          id: 'user-123',
          username: 'dicoding',
          password: 'secret_password',
          fullname: 'Dicoding Indonesia',
        });

        /* arranging for mocks and stubs for thread repository */
        const fakeThreadIdGenerator = (x = 10) => '123';
        function fakeDateGenerator() {
          this.toISOString = () => '2021';
        }

        /* arranging for thread repository */
        const newThread = new AddThread({
          title: 'lorem ipsum',
          body: 'dolor sit amet',
          owner: 'user-123',
        });

        const threadRepositoryPostgres = new ThreadRepositoryPostgres(
          pool,
          fakeThreadIdGenerator,
          fakeDateGenerator,
        );

        // action
        const addedThread = await threadRepositoryPostgres.addThread(newThread);

        // assert
        const threads = await ThreadsTableTestHelper.findThreadById(addedThread.id);
        expect(addedThread).toStrictEqual(new AddedThread({
          id: `thread-${fakeThreadIdGenerator()}`,
          title: 'lorem ipsum',
          owner: 'user-123',
        }));
        expect(threads).toBeDefined();
      });
    });

    describe('addThread function', () => {
      it('should create new thread and return added thread correctly', async () => {
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
          id: 'thread-123',
          title: 'sebuah thread',
          owner: 'user-123',
        }));
      });
    });
  });
});
