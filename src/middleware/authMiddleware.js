const CompanyModel = require("../models/companyModel");

module.exports = async (req, res, next) => {
  const { hash } = req.params;
  if (hash !== "user1" && hash !== "admin")
    return res.status(403).send("Forbidden");
  if (hash === "admin") {
    req.company_id = "0"; // 컨트롤러에서 req.company_id가 0이면 전체조회 하도록 구현?
    next();
    return;
  }
  try {
    const company_id = await CompanyModel.getCompanyIdByAccessToken(hash);
    if (company_id) {
      req.company_id = company_id;
      next();
    } else {
      return res.status(404).send("토큰에 해당하는 업체를 찾을 수 없음");
    }
  } catch (error) {
    console.error("업체 반환 중 오류:", error);
    return res.status(500).send("Internal Server Error");
  }
};
