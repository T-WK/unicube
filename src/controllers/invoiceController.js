//TBC
const invoiceModel = require("../models/invoiceModel");
exports.createInvoice = async (req, res) => {
  const { invoiceData, invoiceImgData, productImgData } = req.body;
  try {
    const id = await invoiceModel.insertInvoice(
      invoiceData,
      invoiceImgData,
      productImgData,
    );
    res.status(201).json({ success: true, id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateInvoice = async (req, res) => {
  const { invoiceData, invoiceImgData, productImgData } = req.body;
  try {
    const id = await invoiceModel.updateInvoice(
      invoiceData,
      invoiceImgData,
      productImgData,
    );

    res.status(200).json({ success: true, id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  const id = req.params.id;
  try {
    const rows = await invoiceModel.getInvoiceById(id);
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
    res.status(200).json({ success: true, invoiceData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.exportInvoice = async (req, res) => {
  const { dateFrom, dateTo, keyword, avail } = req.query;

  try {
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
    rows = invoiceModel.getInvoiceByQuery(dateFrom, dateTo, keyword, avail);
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
  }
};
