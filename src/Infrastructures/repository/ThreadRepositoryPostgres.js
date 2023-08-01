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

    const queryComment = {
      text: `SELECT comments.id, comments.is_delete, comments.content, comments.date, users.username,
      CASE WHEN comments.is_delete = TRUE THEN '**komentar telah dihapus**' else comments.content END AS content
      FROM comments
      INNER JOIN users ON comments.owner = users.id
      WHERE comments.thread_id = $1
      ORDER BY users.username DESC`,
      values: [threadId],
    };

    const resultComment = await this._pool.query(queryComment);
    const rowsComment = resultComment.rows;
    console.log('rowsComment', rowsComment);
    const thread = result.rows[0];
    thread.comments = rowsComment;
    console.log('thread', thread);
    return thread;

    // const resultComment = await this._pool.query(queryComment);
    // const rowsComment = resultComment.rows;
    // const objData = rowsComment.map((obj) => (obj.is_delete === true ? {
    //   ...obj,
    //   content: '**komentar telah dihapus**',
    // } : obj));
    // // eslint-disable-next-line no-param-reassign
    // objData.forEach((obj) => { delete obj.is_delete; });
    // const thread = result.rows[0];
    // thread.comments = objData;
    // return thread;
  }
}

module.exports = ThreadRepositoryPostgres;
