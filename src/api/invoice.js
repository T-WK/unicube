const express = require('express');
const router = express.Router();

const mysql = require("mysql2/promise");
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONN_LIMIT,
});

router.post("/upsert", async (req, res) => {
    const { invoiceData, invoiceImgData, productImgData } = req.body;
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.beginTransaction();
  
      // 1) invoices 테이블 upsert
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
        ]
      );
      // invResult.insertId 에는 INSERT된 id 또는 UPDATE된 기존 id가 들어있음
      const invoiceId = invResult.insertId;
  
      // 2) invoice_images 테이블 upsert
      // 준비할 값 배열
      const imgArgs = [];
      const rows = [];
  
      if (invoiceImgData) {
        const base64 = invoiceImgData.includes(",")
          ? invoiceImgData.split(",")[1]
          : invoiceImgData;
        const buf = Buffer.from(base64, "base64");
        rows.push([invoiceId, "invoice", buf]);
      }
      
      if (productImgData) {
        const base64 = productImgData.includes(",")
          ? productImgData.split(",")[1]
          : productImgData;
        const buf = Buffer.from(base64, "base64");
        rows.push([invoiceId, "product", buf]);
      }
  
      if (rows.length) {
        // 다중 행 upsert
        // INSERT INTO invoice_images (invoice_id,image_type,image_data) VALUES (?,?,?),(?,?,?) ...
        // ON DUPLICATE KEY UPDATE image_data = VALUES(image_data)
        const placeholders = rows.map(() => "(?,?,?)").join(",");
        const flat = rows.flat();
  
        await conn.execute(
          `INSERT INTO invoice_images (invoice_id, image_type, image_data)
           VALUES ${placeholders}
           ON DUPLICATE KEY UPDATE
             image_data = VALUES(image_data)`,
          flat
        );
      }
  
      await conn.commit();
      res.json({ success: true, id: invoiceId });
    } catch (err) {
      if (conn) await conn.rollback();
      console.error("Upsert 오류:", err);
      res.status(500).json({ success: false, error: err.message });
    } finally {
      if (conn) conn.release();
    }
});
  

router.get("/export", async (req, res) => {
    const { dateFrom, dateTo, keyword, avail } = req.query;
    let conn;
    try {
      conn = await pool.getConnection();
  
      const where = [], params = [];
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
        params
      );
  
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Invoices");
  
      // 이미지 컬럼 제거 → 텍스트 컬럼만 유지
      sheet.columns = [
        { header: "ID", key: "id", width: 8 },
        { header: "고객이름", key: "customerName", width: 20 },
        { header: "전화번호", key: "phoneNumber", width: 20 },
        { header: "반송송장번호", key: "returnInvoiceNumber", width: 25 },
        { header: "제품명", key: "productName", width: 30 },
        { header: "제품가능여부(O/X)", key: "productAvailability", width: 15 },
        { header: "생성일", key: "createdAt", width: 15 },
      ];
  
      // 이미지 삽입 제거 → 단순히 행만 추가
      rows.forEach((row) => {
        sheet.addRow(row);
      });
  
      const buffer = await workbook.xlsx.writeBuffer();
      res
        .status(200)
        .set({
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="invoices_${
            dateFrom || "all"
          }_${dateTo || "all"}.xlsx"`,
        })
        .send(buffer);
    } catch (err) {
      console.error("Export error:", err);
      res.status(500).json({ success: false, error: err.message });
    } finally {
      if (conn) conn.release();
    }
});


router.get("/:id", async (req, res) => {
    const id = req.params.id;
    
    let conn;
    try {
      conn = await pool.getConnection();
  
      // 송장 데이터와 관련된 이미지 가져오기
      const [rows] = await conn.execute(`
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
      `, [id]);
  
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

  app.get("/", async (req, res) => {
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
        params
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
        [...params, parseInt(pageSize, 10), offset]
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