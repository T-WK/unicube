require("dotenv").config();
const express = require('express')
const app = express() //가져온 express 모듈의 function을 이용해서 새로운 express 앱을 만든다.
const port = process.env.PORT || 3000 // .env에서 설정한 포트 또는 3000(기본) 포트
const path = require("path");

app.get('/', (req, res) => { //express 앱(app)을 넣고, root directory에 오면, 
  res.send('Hello World!') //"Hello World!" 를 출력되게 해준다.
})

app.use(express.static(path.join(__dirname, "../public")));


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
}) //설정된 포트 에서 이 앱을 실행한다.