const express = require("express");
const router = express.Router();

const productRouter = require("./product");
const invoiceRouter = require("./invoice");
const companyRouter = require("./company");
const ocrRouter = require("./ocr");

// 각 리소스별 라우터 등록
router.use("/product", productRouter);
router.use("/invoice", invoiceRouter);
router.use("/company", companyRouter);
router.use("/ocr", ocrRouter);

module.exports = router;
