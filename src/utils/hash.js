const crypto = require("crypto");

// 12자리 UUID 생성 함수
function generateShortUUID(companyName) {
  const hash = crypto.createHash("sha256").update(companyName).digest("base64"); // 해시 + base64
  const cleanHash = hash.replace(/[^a-zA-Z0-9]/g, ""); // 특수문자 제거
  return cleanHash.slice(0, 12); // 앞에서 12자만 추출
}

module.exports = { generateShortUUID };
