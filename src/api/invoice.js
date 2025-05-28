const express = require("express");
const router = express.Router();

const invoiceController = require("../controllers/invoiceController");

router.post("/", invoiceController.createInvoice);
router.patch("/", invoiceController.updateInvoice);

router.get("/export", invoiceController.exportInvoice);

router.get("/:id", async (req, res) => {
  const id = req.params.id;

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

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: "데이터 없음" });
    }
    // 기본 송장 데이터
    const invoiceData = {
      id: rows[0].id,
      customer_name: rows[0].customerName,
      phone_number: rows[0].phoneNumber,
      return_invoice_number: rows[0].returnInvoiceNumber,
      product_name: rows[0].productName,
      product_availability: rows[0].productAvailability,
      remarks: rows[0].remarks,
      created_at: rows[0].createdAt,
      invoiceImgData: null, // 기본값은 null
      productImgData: null, // 기본값은 null
    };

    // 이미지 데이터를 imageType에 따라 분리하여 저장
    rows.forEach((row) => {
      if (row.imageType === "invoice") {
        invoiceData.invoiceImgData = row.imageData.toString("base64"); // base64로 변환하여 저장
      } else if (row.imageType === "product") {
        invoiceData.productImgData = row.imageData.toString("base64"); // base64로 변환하여 저장
      }
    });

    res.json({ success: true, data: invoiceData });
  } catch (err) {
    console.error("단건 조회 오류:", err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

router.get("/", async (req, res) => {
  const {
    dateFrom,
    dateTo,
    keyword,
    avail,
    page = 1,
    pageSize = 10,
  } = req.query;

  let conn;
  try {
    conn = await pool.getConnection();

    // 1) WHERE 절 동적 구성
    const where = [];
    const params = [];

    if (dateFrom) {
      where.push("created_at >= ?");
      params.push(`${dateFrom} 00:00:00`);
    }
    if (dateTo) {
      where.push("created_at <= ?");
      params.push(`${dateTo} 23:59:59`);
    }
    if (keyword) {
      where.push("(customer_name LIKE ? OR return_invoice_number LIKE ?)");
      params.push(`%${keyword}%`, `%${keyword}%`);
    }
    if (avail) {
      where.push("product_availability = ?");
      params.push(avail);
    }

    const whereSQL = where.length ? "WHERE " + where.join(" AND ") : "";

    // 2) 전체 건수 조회 (페이징 계산용)
    const [countRows] = await conn.execute(
      `SELECT COUNT(*) AS totalCount
           FROM invoices
           ${whereSQL}`,
      params,
    );
    const totalCount = countRows[0].totalCount;
    const totalPages = Math.ceil(totalCount / pageSize);
    const currentPage = Math.max(1, Math.min(parseInt(page, 10), totalPages));

    // 3) 실제 데이터 조회
    const offset = (currentPage - 1) * pageSize;
    const [rows] = await conn.query(
      `SELECT
           id,
           customer_name        AS customerName,
           phone_number         AS phoneNumber,
           return_invoice_number AS returnInvoiceNumber,
           product_name         AS productName,
           product_availability AS productAvailability,
           DATE_FORMAT(created_at, '%Y-%m-%d') AS createdAt
         FROM invoices
         ${whereSQL}
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
      [...params, parseInt(pageSize, 10), offset],
    );

    res.json({
      success: true,
      data: rows,
      page: currentPage,
      totalPages,
      totalCount,
    });
  } catch (err) {
    console.error("DB 조회 오류:", err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    if (conn) await conn.release();
  }
});

module.exports = router;
