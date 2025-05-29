const pool = require("../db");

async function insertInvoice(invoiceData, invoiceImgData, productImgData) {
  return await upsertInvoice(invoiceData, invoiceImgData, productImgData);
}

async function updateInvoice(invoiceData, invoiceImgData, productImgData) {
  return await upsertInvoice(invoiceData, invoiceImgData, productImgData);
}

async function getInvoiceById(id) {
  let conn;
  try {
    conn = await pool.getConnection();

    // 송장 데이터와 관련된 이미지 가져오기
    const [rows] = await conn.execute(
      `
        SELECT 
          i.id,
          i.customer_name AS customerName,
          i.phone_number AS phoneNumber,
          i.return_invoice_number AS returnInvoiceNumber,
          i.product_name AS productName,
          i.product_availability AS productAvailability,
          i.remarks,
          i.created_at AS createdAt,
          ii.image_type AS imageType,
          ii.image_data AS imageData
        FROM invoices i
        LEFT JOIN invoice_images ii ON i.id = ii.invoice_id
        WHERE i.id = ?
      `,
      [id],
    );
    return rows;
  } catch (err) {
    console.error("단건 조회 오류:", err);
  } finally {
    if (conn) conn.release();
  }
}

async function getInvoiceByQuery(dateFrom, dateTo, keyword, avail) {
  let conn;
  try {
    conn = await pool.getConnection();

    const where = [],
      params = [];
    if (dateFrom) {
      where.push("i.created_at >= ?");
      params.push(dateFrom + " 00:00:00");
    }
    if (dateTo) {
      where.push("i.created_at <= ?");
      params.push(dateTo + " 23:59:59");
    }
    if (keyword) {
      where.push("(i.customer_name LIKE ? OR i.return_invoice_number LIKE ?)");
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    if (avail) {
      where.push("i.product_availability = ?");
      params.push(avail);
    }
    const whereSQL = where.length ? "WHERE " + where.join(" AND ") : "";

    // 이미지 제거 → invoice_images LEFT JOIN 제거
    const [rows] = await conn.execute(
      `SELECT
          i.id,
          i.customer_name        AS customerName,
          i.phone_number         AS phoneNumber,
          i.return_invoice_number AS returnInvoiceNumber,
          i.product_name         AS productName,
          i.product_availability AS productAvailability,
          DATE_FORMAT(i.created_at,'%Y-%m-%d') AS createdAt
        FROM invoices i
        ${whereSQL}
        ORDER BY i.created_at DESC`,
      params,
    );

    return rows;
  } catch (err) {
    console.error("Export error:", err);
  } finally {
    if (conn) conn.release();
  }
}
async function upsertInvoice(invoiceData, invoiceImgData, productImgData) {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [invResult] = await conn.execute(
      `INSERT INTO invoices
        (customer_name, phone_number, return_invoice_number,
        product_name, product_availability, remarks)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        customer_name        = VALUES(customer_name),
        phone_number         = VALUES(phone_number),
        product_name         = VALUES(product_name),
        product_availability = VALUES(product_availability),
        remarks              = VALUES(remarks),
        id = LAST_INSERT_ID(id)`,
      [
        invoiceData.고객이름,
        invoiceData.전화번호,
        invoiceData.반송송장번호,
        invoiceData.제품명,
        invoiceData.제품가능여부,
        invoiceData.비고,
      ],
    );

    const invoiceId = invResult.insertId;

    const rows = [];
    if (invoiceImgData) {
      const base64 =
        invoiceImgData.includes(",") ?
          invoiceImgData.split(",")[1]
        : invoiceImgData;
      const buf = Buffer.from(base64, "base64");
      rows.push([invoiceId, "invoice", buf]);
    }

    if (productImgData) {
      const base64 =
        productImgData.includes(",") ?
          productImgData.split(",")[1]
        : productImgData;
      const buf = Buffer.from(base64, "base64");
      rows.push([invoiceId, "product", buf]);
    }

    if (rows.length) {
      const placeholders = rows.map(() => "(?,?,?)").join(",");
      const flat = rows.flat();

      await conn.execute(
        `INSERT INTO invoice_images (invoice_id, image_type, image_data)
         VALUES ${placeholders}
         ON DUPLICATE KEY UPDATE
           image_data = VALUES(image_data)`,
        flat,
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

module.exports = {
  insertInvoice,
  updateInvoice,
  getInvoiceByQuery,
  getInvoiceById,
  getInvoiceByIds,
};
