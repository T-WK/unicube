const pool = require('../db');
//지우고 다시 쓰셈 이런식으로
exports.findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
  return rows[0];
};

exports.insert = async ({ name, price }) => {
  const [result] = await pool.query(
    'INSERT INTO products (name, price) VALUES (?, ?)',
    [name, price]
  );
  return { id: result.insertId, name, price };
};