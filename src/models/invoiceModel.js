const pool = require("../db");

async function insertInvoice(invoiceData, invoiceProductData) {
  let conn;
  try {
    const inv_img = invoiceData.invoice_image;
    const prod_img = invoiceData.product_image;
    if (inv_img) {
      const base64 = inv_img.includes(",") ? inv_img.split(",")[1] : inv_img;
      const buf = Buffer.from(base64, "base64");
      invoiceData.invoice_image = buf;
    }
    if (prod_img) {
      const base64 = prod_img.includes(",") ? prod_img.split(",")[1] : prod_img;
      const buf = Buffer.from(base64, "base64");
      invoiceData.product_image = buf;
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [result] = await conn.execute(
      `INSERT INTO invoice
        (company_id, name, phone, number, invoice_image, product_image,created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        invoiceData.company_id,
        invoiceData.name,
        invoiceData.phone,
        invoiceData.number,
        invoiceData.invoice_image ?? null,
        invoiceData.product_image ?? null,
      ],
    );
    const invoiceId = result.insertId;

    if (invoiceProductData.length > 0) {
      const values = invoiceProductData.map((ip) => [
        invoiceId,
        ip.product_id,
        ip.returned_quantity,
        ip.resalable_quantity,
        ip.note ?? null,
      ]);

      // (?, ?, ?, ?, ?), (?, ?, ?, ?, ?) ...
      const placeholders = invoiceProductData
        .map(() => "(?, ?, ?, ?, ?)")
        .join(", ");

      await conn.execute(
        `INSERT INTO invoice_product (invoice_id, product_id, returned_quantity, resalable_quantity, note)
          VALUES ${placeholders}`,
        values.flat(),
      );
    }

    await conn.commit();
    return invoiceId;
  } catch (err) {
    if (conn) await conn.rollback();
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

async function updateInvoice(invoiceData, invoiceProductData) {
  let conn;
  try {
    const inv_img = invoiceData.invoice_image;
    const prod_img = invoiceData.product_image;
    if (inv_img) {
      const base64 = inv_img.includes(",") ? inv_img.split(",")[1] : inv_img;
      const buf = Buffer.from(base64, "base64");
      invoiceData.invoice_image = buf;
    }
    if (prod_img) {
      const base64 = prod_img.includes(",") ? prod_img.split(",")[1] : prod_img;
      const buf = Buffer.from(base64, "base64");
      invoiceData.product_image = buf;
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    await conn.execute(
      `UPDATE invoice
        SET company_id = ?,
            name = ?,
            phone = ?,
            number = ?,
            invoice_image = ?,
            product_image = ?,
            updated_at = NOW()
        WHERE id = ?`,
      [
        invoiceData.company_id,
        invoiceData.name,
        invoiceData.phone,
        invoiceData.number,
        invoiceData.invoice_image ?? null,
        invoiceData.product_image ?? null,
        invoiceData.id,
      ],
    );
    //delte original product
    await conn.execute("DELETE FROM invoice_product WHERE invoice_id = ?", [
      invoiceData.id,
    ]);
    //insert new product
    if (invoiceProductData.length > 0) {
      const values = invoiceProductData.map((ip) => [
        invoiceData.id,
        ip.product_id,
        ip.returned_quantity,
        ip.resalable_quantity,
        ip.note ?? null,
      ]);

      // (?, ?, ?, ?, ?), (?, ?, ?, ?, ?) ...
      const placeholders = invoiceProductData
        .map(() => "(?, ?, ?, ?, ?)")
        .join(", ");

      await conn.execute(
        `INSERT INTO invoice_product (invoice_id, product_id, returned_quantity, resalable_quantity, note)
          VALUES ${placeholders}`,
        values.flat(),
      );
    }

    await conn.commit();
  } catch (err) {
    if (conn) await conn.rollback();
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

async function findInvoiceById(id, company_id) {
  let conn;
  try {
    conn = await pool.getConnection();
    if (company_id) {
      where = `AND i.company_id = ${company_id}`;
    }
    // 송장 데이터와 관련된 이미지 가져오기
    const [rows] = await conn.execute(
      `SELECT 
        i.id AS invoice_id,
        i.company_id,
        i.name,
        i.phone,
        i.number,
        i.invoice_image,
        i.product_image,
        i.created_at,
        i.updated_at,
        i.deleted_at,

        ip.returned_quantity,
        ip.resalable_quantity,
        ip.note,

        p.name AS product_name

      FROM invoice i
      JOIN invoice_product ip ON i.id = ip.invoice_id
      JOIN product p ON ip.product_id = p.id
      WHERE i.id = ? AND i.deleted_at IS NULL ${where} ORDER BY i.id;`,
      [id],
    );
    return rows;
  } catch (err) {
    console.error("단건 조회 오류:", err);
    return [];
  } finally {
    if (conn) conn.release();
  }
}

async function findInvoiceByQuery(company_id, dateFrom, dateTo, keyword) {
  let conn;
  try {
    conn = await pool.getConnection();

    const where = [],
      params = [];
    if (company_id !== "0") {
      where.push("i.company_id = ?");
      params.push(company_id);
    }
    if (dateFrom) {
      where.push("i.created_at >= ?");
      params.push(dateFrom + " 00:00:00");
    }
    if (dateTo) {
      where.push("i.created_at <= ?");
      params.push(dateTo + " 23:59:59");
    }
    if (keyword) {
      where.push("(i.name LIKE ? OR i.number LIKE ?)");
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    where.push("i.deleted_at IS NULL");

    const whereSQL = where.length ? "WHERE " + where.join(" AND ") : "";

    const [rows] = await conn.execute(
      `SELECT
          i.id AS invoice_id,
          i.company_id,
          i.name,
          i.phone,
          i.number,
          i.created_at,
          i.updated_at,
          i.deleted_at,

          ip.returned_quantity,
          ip.resalable_quantity,
          ip.note,

          p.name AS product_name
        FROM invoice i
        JOIN invoice_product ip ON i.id = ip.invoice_id
        JOIN product p ON ip.product_id = p.id
        ${whereSQL}
        ORDER BY i.id DESC`,
      params,
    );

    return rows;
  } catch (err) {
    console.error("Export error:", err);
    return [];
  } finally {
    if (conn) conn.release();
  }
}

async function deleteInvoice(id) {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.execute("UPDATE invoice SET deleted_at = NOW() WHERE id = ?", [
      id,
    ]);
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

module.exports = {
  insertInvoice,
  updateInvoice,
  findInvoiceByQuery,
  findInvoiceById,
  deleteInvoice,
};
