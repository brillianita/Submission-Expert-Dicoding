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

  async getDetailThread(threadId) {
    const query = {
      text: 'SELECT t.id, t.title, t.body, t.date, u.username FROM threads AS t INNER JOIN users AS u ON t.owner = u.id WHERE t.id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    return result.rows[0];
  }

  async verifyAvailableThread(threadId) {
    const query = {
      text: 'SELECT 1 FROM threads WHERE id = $1',
      values: [threadId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return rowCount;
  }
}

module.exports = ThreadRepositoryPostgres;
