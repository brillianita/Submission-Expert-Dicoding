const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(request) {
    const { title, body, owner } = request;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();
    console.log('ini', date);
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date],
    };

    const { rows } = await this._pool.query(query);

    return new AddedThread(rows[0]);
  }

  async getThreadById(threadId) {
    const query = {
      text: 'SELECT id_thread FROM threads WHERE id_thread = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    return result.rows;
  }
}

module.exports = ThreadRepositoryPostgres;
