const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const {
      content, threadId, owner,
    } = addComment;

    const id = `comment-${this._idGenerator()}`;
    // const date = this._dateGenerator();
    const date = new Date().toISOString();
    // const qThread = {
    //   text: 'SELECT id FROM threads WHERE id = $1',
    //   values: [threadId],
    // };

    // const rThread = await this._pool.query(qThread);

    // if (!rThread.rowCount) {
    //   throw new NotFoundError('thread tidak ditemukan');
    // }

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, owner, threadId, date],
    };

    const result = await this._pool.query(query);
    console.log('ini rows', { ...result.rows[0] });
    return new AddedComment({ ...result.rows[0] });
  }

  async isCommentExist({ threadId, commentId }) {
    const query = {
      text: 'SELECT comments.content, comments.is_delete FROM comments INNER JOIN threads ON comments.thread_id = threads.id WHERE threads.id = $1 AND comments.id = $2 AND comments.is_delete = FALSE',
      values: [threadId, commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async verifyCommentAccess({ commentId, owner }) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError('gagal menghapus comment. Anda tidak memiliki akses');
    }
  }

  async deleteCommentById(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = TRUE WHERE id = $1 RETURNING id, is_delete',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async getCommentByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, comments.content, comments.date, comments.is_delete, users.username
      FROM comments
      INNER JOIN users ON comments.owner = users.id
      WHERE comments.thread_id = $1
      ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);
    console.log('ini rows', rows);
    return rows;
  }
}

module.exports = CommentRepositoryPostgres;
