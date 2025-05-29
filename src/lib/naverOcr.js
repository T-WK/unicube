require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

/**
 * 1) OCR API 호출 (base64 → 전체 텍스트)
 */
async function callMyOcrApi(base64Image) {
  const apiUrl = process.env.NCP_OCR_URL;
  const secretKey = process.env.NCP_OCR_SECRET;

  // payload 생성
  const requestId = uuidv4();
  const timestamp = Date.now();
  const payload = {
    version: "V2",
    requestId,
    timestamp,
    images: [
      {
        format: "png", // 혹은 jpg
        name: "invoice", // 원하는 이름
        data: base64Image.split(",")[1], // "data:image/...;base64," 제거
      },
    ],
  };

  // 헤더 세팅
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "X-OCR-SECRET": secretKey,
  };

  // API 호출
  const res = await axios.post(apiUrl, payload, { headers });
  if (res.status !== 200) {
    throw new Error(`OCR API error: ${res.status}`);
  }

  // 응답에서 모든 inferText 추출
  // images 배열마다 fields 배열이 있고, 각 필드의 inferText가 인식된 문자열입니다.
  const lines = [];
  res.data.images.forEach((img) => {
    img.fields.forEach((f) => {
      if (f.inferText) lines.push(f.inferText);
    });
  });

  return { text: lines.join("\n") };
}

module.exports = { callMyOcrApi };
