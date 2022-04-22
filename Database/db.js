const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  database: 'qna',
  port: '5432',
});

module.exports = pool;
