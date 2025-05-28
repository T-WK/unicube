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
