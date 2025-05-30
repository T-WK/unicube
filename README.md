# unicube

## public/

- 프론트엔드 코드

## src

- 백엔드 코드

node v22.16.0

```text
│  app.js             // start server
│
├─api                 // api router
│      company.js
│      index.js
│      invoice.js
│      ocr.js
│      product.js
│
├─controllers          // api controller
│      invoiceController.js
│
├─db                   // db connection
│      index.js
│
├─lib                  // third party service
│      naverOcr.js
│      openai.js
│
├─middleware            // middleware for authorization
│      authMiddleware.js
│
├─models                 // db query
│      invoiceModel.js
│      productModel.js
│
├─routes                // page router
│      pages.js
│
└─utils                 // functions
        authorize.js
        formatInvoice.js
        hash.js
        mapper.js

```

## install 목록

- package.json에 각 모듈의 버전 정보가 나와있음
  `dotenv` `express`
