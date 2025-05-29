const pool = require("../db");

async function insertProduct(productData) {
  try {
    const [result] = await pool.execute(
      `INSERT INTO product (company_id, name, created_at)
       VALUES (?, ?, NOW())`,
      [productData.company_id, productData.name],
    );
    return result.insertId;
  } catch (error) {
    console.error("상품 생성 오류:", error);
    throw error;
  }
}

async function findProductById(id) {
  try {
    const [rows] = await pool.execute(
      `SELECT id, company_id, name, created_at, updated_at
       FROM product
       WHERE id = ? AND deleted_at IS NULL`,
      [id],
    );
    return rows[0] || null;
  } catch (error) {
    console.error("상품 단건 조회 오류:", error);
    throw error;
  }
}

async function findAllProducts(companyId) {
  try {
    const query = `
      SELECT p.id, p.company_id, p.name, p.created_at, p.updated_at, c.name AS company_name
      FROM product p
      JOIN company c ON p.company_id = c.id
      WHERE p.deleted_at IS NULL
      ${companyId ? "AND p.company_id = ?" : ""}
      ORDER BY p.created_at DESC
    `;
    const params = companyId ? [companyId] : [];
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error("상품 목록 조회 오류:", error);
    throw error;
  }
}

async function updateProduct(id, productData) {
  try {
    const [result] = await pool.execute(
      `UPDATE product
       SET company_id = ?,
           name = ?,
           updated_at = NOW()
       WHERE id = ? AND deleted_at IS NULL`,
      [productData.company_id, productData.name, id],
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("상품 수정 오류:", error);
    throw error;
  }
}

async function deleteProduct(id) {
  try {
    const [result] = await pool.execute(
      `UPDATE product
       SET deleted_at = NOW()
       WHERE id = ? AND deleted_at IS NULL`,
      [id],
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("상품 삭제 오류:", error);
    throw error;
  }
}

module.exports = {
  insertProduct,
  findProductById,
  findAllProducts,
  updateProduct,
  deleteProduct,
};
