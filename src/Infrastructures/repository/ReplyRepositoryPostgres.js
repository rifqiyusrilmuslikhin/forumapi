const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { content, thread, comment, owner } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toLocaleString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, FALSE ,$6, $7) RETURNING id, content, owner',
      values: [id, thread, comment, content, owner, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    return new AddedReply({...result.rows[0]});
  }

  async checkAvailabilityReply(reply) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [reply],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('balasan tidak ditemukan di database');
    }
  }

  async verifyReplyOwner(reply, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
      values: [reply, owner],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new AuthorizationError('anda tidak bisa menghapus balasan orang lain.');
    }
  }

  async deleteReply(reply) {
    const query = {
      text: 'UPDATE replies SET is_deleted = TRUE WHERE id = $1',
      values: [reply],
    };

    await this._pool.query(query);
  }

  async getRepliesComment(thread, comment) {
    const query = {
      text: 'SELECT replies.id, users.username, replies.created_at as date, replies.content, replies.is_deleted FROM replies JOIN users ON users.id = replies.owner WHERE thread = $1 AND comment = $2 ORDER BY replies.created_at ASC',
      values: [thread, comment],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }

}

module.exports = ReplyRepositoryPostgres;
