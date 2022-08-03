/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addThread({
    id = 'thread-h_123', title = 'sebuah thread', body = 'lorem ipsum dolor sit amet', owner = 'user-123',
  }) {
    const created_at = new Date().toLocaleString();
    const updated_at = created_at;
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, title, body, owner, created_at, updated_at],
    };

    await pool.query(query);
  },

  async findThreadsById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;
