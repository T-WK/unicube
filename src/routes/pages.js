const express = require("express");
const path = require("path");
const router = express.Router();
const { authorize } = require("../utils/authorize");
router.get("/", (req, res) => {
  //express 앱(app)을 넣고, root directory에 오면,
  res.sendFile(path.join(__dirname, "../../public/pages/index/index.html")); // index.html 파일을 응답으로 보낸다.
});

router.get("/invoice", (req, res) => {
  //express 앱(app)을 넣고, root directory에 오면,
  res.sendFile(
    path.join(__dirname, "../../public/pages/save-invoice/save-invoice.html"),
  ); // index.html 파일을 응답으로 보낸다.
});

router.get("/invoice/:invoiceId", (req, res) => {
  //express 앱(app)을 넣고, root directory에 오면,
  res.sendFile(
    path.join(__dirname, "../../public/pages/modify-invoice/modify-invoice.html"),
  ); // index.html 파일을 응답으로 보낸다.
});

router.get("/company", authorize(["admin"]), (req, res) => {
  //express 앱(app)을 넣고, root directory에 오면,

  res.sendFile(path.join(__dirname, "../../public/pages/company/company.html"));
});

router.get("/ocr", authorize(["admin"]), (req, res) => {
  //express 앱(app)을 넣고, root directory에 오면,

  res.sendFile(path.join(__dirname, "../../public/pages/ocr/ocr.html"));
});

router.get("/product", authorize(["admin"]), (req, res) => {
  //express 앱(app)을 넣고, root directory에 오면,
  res.sendFile(path.join(__dirname, "../../public/pages/product/product.html"));
});

router.get("/search", (req, res) => {
  //express 앱(app)을 넣고, root directory에 오면,
  res.sendFile(
    path.join(__dirname, "../../public/pages/invoice-chart/invoice-chart.html"),
  );
});

module.exports = router;
