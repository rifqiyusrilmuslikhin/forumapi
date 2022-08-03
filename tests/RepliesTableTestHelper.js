/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123', thread = 'thread-h_123', comment = 'comment-_pby2-123', content = 'sebuah balasan', owner = 'user-123', isDeleted = false,
  }) {
    const created_at = new Date().toLocaleString();
    const updated_at = created_at;
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
      values: [id, thread, comment, content, owner, isDeleted, created_at, updated_at],
    };

    await pool.query(query);
  },

  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async checkIsDeletedRepliesById(id) {
    const query = {
      text: 'SELECT is_deleted FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0].is_deleted;
  },

  async deleteReply(id) {
    const query = {
      text: 'UPDATE replies SET is_deleted = 1 WHERE id = $1',
      values: [id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
