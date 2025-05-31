const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/", (req, res) => {
  //express 앱(app)을 넣고, root directory에 오면,
  res.sendFile(path.join(__dirname, "../../public/index.html")); // index.html 파일을 응답으로 보낸다.
});

router.get("/company", (req, res) => {
  //express 앱(app)을 넣고, root directory에 오면,
  res.sendFile(path.join(__dirname, "../../public/pages/company.html")); // index.html 파일을 응답으로 보낸다.
});

router.get("/ocr", (req, res) => {
  //express 앱(app)을 넣고, root directory에 오면,
  res.sendFile(path.join(__dirname, "../../public/pages/ocr.html")); // index.html 파일을 응답으로 보낸다.
});

module.exports = router;
