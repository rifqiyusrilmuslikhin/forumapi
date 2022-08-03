/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-_pby2-123', thread = 'thread-h_123', content = 'sebuah comment', owner = 'user-123', isDeleted = false,
  }) {
    const created_at = new Date().toLocaleString();
    const updated_at = created_at;
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, thread, content, owner, isDeleted, created_at, updated_at],
    };

    await pool.query(query);
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async checkIsDeletedCommentsById(id) {
    const query = {
      text: 'SELECT is_deleted FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0].is_deleted;
  },

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = 1 WHERE id = $1',
      values: [id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
