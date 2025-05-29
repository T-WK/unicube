const express = require("express");
const router = express.Router();
const { callMyOcrApi } = require("../lib/naverOcr");
const { extractInvoiceData } = require("../lib/openai");
const { mapToKoreanFields } = require("../utils/mapper");
/**
 * POST /api/ocr
 * 클라이언트에서 base64 이미지 받음 → OCR → ChatGPT → JSON 반환
 */
router.post("/", async (req, res) => {
  try {
    const { image } = req.body; // base64
    const { text } = await callMyOcrApi(image);
    const invoiceData = await extractInvoiceData(text);

    krData = mapToKoreanFields(invoiceData);

    res.json({ success: true, ocrText: text, invoiceData: krData });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err.message });
  }
});

module.exports = router;
