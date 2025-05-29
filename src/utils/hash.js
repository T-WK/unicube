// 간단한 사용자 DB
const users = {
  user1: { id: "user1", role: "user" },
  admin: { id: "admin", role: "admin" },
};

// 해시 생성
const generateHash = (id) => {
  return crypto
    .createHash("sha256")
    .update(id + "secret_key")
    .digest("hex")
    .slice(0, 16);
};

// 해시 => 사용자 매핑
const accessMap = { user1: "user1", admin: "admin" };
Object.keys(users).forEach((id) => {
  //const hash = generateHash(id);
  accessMap[users[id]] = users[id];
});

module.exports = { accessMap };
