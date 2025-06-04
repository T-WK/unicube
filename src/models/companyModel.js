const pool = require("../db");

async function insertCompany(companyData) {
  try {
    const [result] = await pool.execute(
      `INSERT INTO company (name, access_token, note, created_at)
       VALUES (?, ?, ?, NOW())`,
      [companyData.name, companyData.access_token, companyData.note],
    );
    return result.insertId;
  } catch (error) {
    console.error("업체 생성 오류:", error);
    throw error;
  }
}

async function findCompanyById(id) {
  try {
    const [rows] = await pool.execute(
      `SELECT id, name, access_token, note, created_at, updated_at
       FROM company
       WHERE id = ? AND deleted_at IS NULL`,
      [id],
    );
    return rows[0] || null;
  } catch (error) {
    console.error("업체 단건 조회 오류:", error);
    throw error;
  }
}

async function findAllCompanies() {
  try {
    const [rows] = await pool.execute(
      `SELECT id, name, access_token, note, created_at, updated_at
       FROM company
       WHERE deleted_at IS NULL
       ORDER BY created_at DESC`,
    );
    return rows;
  } catch (error) {
    console.error("업체 목록 조회 오류:", error);
    throw error;
  }
}

async function updateCompany(id, companyData) {
  try {
    const [result] = await pool.execute(
      `UPDATE company
       SET name = ?,
           access_token = ?,
           note = ?,
           updated_at = NOW()
       WHERE id = ? AND deleted_at IS NULL`,
      [companyData.name, companyData.access_token, companyData.note, id],
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("업체 수정 오류:", error);
    throw error;
  }
}

async function deleteCompany(id) {
  try {
    const [result] = await pool.execute(
      `UPDATE company
       SET deleted_at = NOW()
       WHERE id = ? AND deleted_at IS NULL`,
      [id],
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("업체 삭제 오류:", error);
    throw error;
  }
}

async function getCompanyIdByAccessToken(accessToken) {
  try {
    const [rows] = await pool.execute(
      `SELECT id
       FROM company
       WHERE access_token = ? AND deleted_at IS NULL`,
      [accessToken],
    );
    if (rows.length === 0) return null;
    return rows[0].id;
  } catch (error) {
    console.error("업체 번호 반환 오류:", error);
    throw error;
  }
}

module.exports = {
  insertCompany,
  findCompanyById,
  findAllCompanies,
  updateCompany,
  deleteCompany,
  getCompanyIdByAccessToken,
};
