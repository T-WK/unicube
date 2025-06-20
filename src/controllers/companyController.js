const CompanyModel = require("../models/companyModel");
const { generateShortUUID } = require("../utils/hash");
// 업체 생성
async function createCompany(req, res) {
  try {
    const { name, note } = req.body;
    const uuid = generateShortUUID(name);
    if (!name) {
      return res
        .status(400)
        .json({ message: "업체 이름과 접근 토큰은 필수입니다." });
    }
    const companyId = await CompanyModel.insertCompany({ name, uuid, note });
    res.status(201).json({ id: companyId, message: "업체가 생성되었습니다." });
  } catch (error) {
    console.error("업체 생성 컨트롤러 오류:", error);
    res.status(500).json({ message: "업체 생성 중 오류가 발생했습니다." });
  }
}

// 특정 업체 조회
async function getCompanyById(req, res) {
  try {
    const companyId = req.params.id;
    const company = await CompanyModel.findCompanyById(companyId);
    if (!company) {
      return res.status(404).json({ message: "업체를 찾을 수 없습니다." });
    }
    res.json(company);
  } catch (error) {
    console.error("업체 단건 조회 컨트롤러 오류:", error);
    res.status(500).json({ message: "업체 조회 중 오류가 발생했습니다." });
  }
}

async function getCompanyByName(req, res) {
  try {
    const { name } = req.query;
    if (!name) {
      // name이 비어 있으면 전체 조회
      const result = await CompanyModel.findAllCompanies();
      return res.json(result);
    } else {
      // 검색어가 있으면 검색 조회
      const result = await CompanyModel.findCompanyByName(name);
      return res.json(result);
    }
  } catch (error) {
    console.error("업체 단건 조회 컨트롤러 오류:", error);
    res.status(500).json({ message: "업체 조회 중 오류가 발생했습니다." });
  }
}

// 업체 리스트 조회
async function getAllCompanies(req, res) {
  try {
    const companies = await CompanyModel.findAllCompanies();
    res.json(companies);
  } catch (error) {
    console.error("업체 목록 조회 컨트롤러 오류:", error);
    res.status(500).json({ message: "업체 목록 조회 중 오류가 발생했습니다." });
  }
}

// 업체 업데이트
async function updateCompany(req, res) {
  try {
    const companyId = req.params.id;
    const { name, note } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ message: "업체 이름과 접근 토큰은 필수입니다." });
    }
    const updated = await CompanyModel.updateCompany(companyId, { name, note });
    if (!updated) {
      return res
        .status(404)
        .json({ message: "업체를 찾을 수 없거나 업데이트에 실패했습니다." });
    }
    res.json({ message: "업체가 업데이트되었습니다." });
  } catch (error) {
    console.error("업체 업데이트 컨트롤러 오류:", error);
    res.status(500).json({ message: "업체 업데이트 중 오류가 발생했습니다." });
  }
}

// 업체 삭제 (논리적 삭제)
async function deleteCompany(req, res) {
  try {
    const companyId = req.params.id;
    const deleted = await CompanyModel.deleteCompany(companyId);
    if (!deleted) {
      return res
        .status(404)
        .json({ message: "업체를 찾을 수 없거나 삭제에 실패했습니다." });
    }
    res.json({ message: "업체가 삭제되었습니다." });
  } catch (error) {
    console.error("업체 삭제 컨트롤러 오류:", error);
    res.status(500).json({ message: "업체 삭제 중 오류가 발생했습니다." });
  }
}

module.exports = {
  createCompany,
  getCompanyById,
  getCompanyByName,
  getAllCompanies,
  updateCompany,
  deleteCompany,
};
