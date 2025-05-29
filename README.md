# unicube

## public/
- 프론트엔드 코드

## src
- 백엔드 코드

── src
    ├── api                // api router
    │   ├── company.js
    │   ├── index.js
    │   ├── invoice.js
    │   ├── ocr.js
    │   └── product.js
    ├── app.js            // start backend server
    ├── controllers       // controller for api implementation
    │   └── invoiceController.js
    ├── db                // for db connection
    │   └── index.js
    ├── lib               // third party service
    │   ├── naverOcr.js
    │   └── openai.js
    ├── models            // execute db query
    │   ├── invoiceModel.js
    │   └── productModel.js
    ├── routes            // router for pages
    │   └── pages.js
    └── utils             // trivial functions
        └── mapper.js
## install 목록
- package.json에 각 모듈의 버전 정보가 나와있음
`dotenv` `express`
