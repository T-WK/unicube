const ExcelJS = require("exceljs");
const invoiceModel = require("../models/invoiceModel");
const { formatInvoiceRows } = require("../utils/formatInvoice");
exports.getInvoiceById = async (req, res) => {
  const id = req.params.id;
  const company_id = req.company_id;
  try {
    const rows = await invoiceModel.findInvoiceById(id, company_id);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: "데이터 없음" });
    }

    // 기본 송장 데이터
    const [invoiceData] = formatInvoiceRows(rows);
    res.status(200).json({ success: true, invoiceData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.getInvoiceByQuery = async (req, res) => {
  const { dateFrom, dateTo, keyword } = req.query;
  try {
    const rows = await invoiceModel.findInvoiceByQuery(
      req.company_id,
      dateFrom,
      dateTo,
      keyword,
    );
    const invoiceList = formatInvoiceRows(rows);
    res.status(200).json({ success: true, invoiceList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.createInvoice = async (req, res) => {
  const { invoiceData, invoiceProduct } = req.body;
  try {
    const id = await invoiceModel.insertInvoice(invoiceData, invoiceProduct);
    res.status(201).json({ success: true, id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateInvoice = async (req, res) => {
  const { invoiceData, invoiceProduct } = req.body;
  try {
    const id = await invoiceModel.updateInvoice(invoiceData, invoiceProduct);

    res.status(200).json({ success: true, id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.exportInvoice = async (req, res) => {
  const { dateFrom, dateTo, keyword } = req.query;

  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Invoices");

    // 이미지 컬럼 제거 → 텍스트 컬럼만 유지
    sheet.columns = [
      { header: "ID", key: "id", width: 8 },
      { header: "고객이름", key: "name", width: 20 },
      { header: "전화번호", key: "phone", width: 20 },
      { header: "송장번호", key: "number", width: 25 },
      { header: "제품명", key: "productName", width: 30 },
      { header: "입고수량", key: "productAvailability", width: 15 },
      { header: "가능수량", key: "productAvailability", width: 15 },

      { header: "생성일", key: "createdAt", width: 15 },
    ];
    const rows = await invoiceModel.findInvoiceByQuery(
      req.company_id,
      dateFrom,
      dateTo,
      keyword,
    );
    const invoiceList = formatInvoiceRows(rows);
    if (invoiceList.length === 0) {
      return res.status(404).json({ success: false, error: "데이터 없음" });
    }
    // 이미지 삽입 제거 → 단순히 행만 추가
    invoiceList.forEach((row) => {
      const { id, name, phone, number, created_at, products } = row;
      products.forEach((product) => {
        const excelRow = [];
        excelRow.push(id);
        excelRow.push(name);
        excelRow.push(phone);
        excelRow.push(number);
        excelRow.push(product.name);
        excelRow.push(product.returned_quantity);
        excelRow.push(product.resalable_quantity);
        excelRow.push(new Date(created_at).toLocaleDateString());
        sheet.addRow(excelRow);
      });
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

exports.removeInvoice = async (req, res) => {
  const id = req.params.id;
  try {
    await invoiceModel.deleteInvoice(id);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
