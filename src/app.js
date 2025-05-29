require("dotenv").config();
const express = require("express");
const apiRoutes = require("./api");
const pageRoutes = require("./routes/pages");
const path = require("path");

const app = express(); //가져온 express 모듈의 function을 이용해서 새로운 express 앱을 만든다.
const port = process.env.PORT || 3000; // .env에서 설정한 포트 또는 3000(기본) 포트

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", apiRoutes);
app.use("/", pageRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
}); //설정된 포트 에서 이 앱을 실행한다.
