const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/", (req, res) => {
  //express 앱(app)을 넣고, root directory에 오면,
  res.sendFile(path.join(__dirname, "../../public/index.html")); // index.html 파일을 응답으로 보낸다.
});

router.get("/invoice", (req, res) => {
  //express 앱(app)을 넣고, root directory에 오면,
  res.sendFile(
    path.join(__dirname, "../../public/pages/save-invoice/save-invoice.html"),
  ); // index.html 파일을 응답으로 보낸다.
});

router.get("/company", (req, res) => {
  //express 앱(app)을 넣고, root directory에 오면,


  res.sendFile(path.join(__dirname, "../../public/pages/company/company.html"));
});

router.get("/ocr", (req, res) => {
  //express 앱(app)을 넣고, root directory에 오면,

  res.sendFile(path.join(__dirname, "../../public/pages/ocr/ocr.html"));
});

router.get("/product", (req, res) => {
  //express 앱(app)을 넣고, root directory에 오면,
  res.sendFile(path.join(__dirname, "../../public/pages/product/product.html"));
});

router.get("/search", (req, res) => {
  //express 앱(app)을 넣고, root directory에 오면,
  res.sendFile(path.join(__dirname, "../../public/pages/invoice-chart/invoice-chart.html"));
});


module.exports = router;
