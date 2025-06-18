require("dotenv").config();
const express = require("express");
const apiRoutes = require("./api");
const pageRoutes = require("./routes/pages");
const path = require("path");
const authMiddleware = require("./middleware/authMiddleware");

const app = express(); //가져온 express 모듈의 function을 이용해서 새로운 express 앱을 만든다.
const port = process.env.PORT || 3000; // .env에서 설정한 포트 또는 3000(기본) 포트

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(express.static(path.join(__dirname, "../public"), { index: false }));

app.use("/:hash", authMiddleware);
app.use("/:hash/api", apiRoutes);
app.use("/:hash", pageRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
