const express = require('express');
const router = express.Router();

router.get('/', (req, res) => { //express 앱(app)을 넣고, root directory에 오면, 
    res.sendFile(path.join(__dirname, "../public/index.html")) // index.html 파일을 응답으로 보낸다.
});
  
module.exports = router;
