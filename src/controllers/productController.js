const ProductModel = require("../models/productModel");

// 상품 생성
async function createProduct(req, res) {
  try {
    const { company_id, name } = req.body;
    if (!company_id || !name) {
      return res
        .status(400)
        .json({ message: "업체 ID와 상품 이름은 필수입니다." });
    }
    const productId = await ProductModel.insertProduct({ company_id, name });
    res.status(201).json({ id: productId, message: "상품이 생성되었습니다." });
  } catch (error) {
    console.error("상품 생성 컨트롤러 오류:", error);
    res.status(500).json({ message: "상품 생성 중 오류가 발생했습니다." });
  }
}

// 특정 상품 조회
async function getProductById(req, res) {
  try {
    const productId = req.params.id;
    const product = await ProductModel.findProductById(productId);
    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }
    res.json(product);
  } catch (error) {
    console.error("상품 단건 조회 컨트롤러 오류:", error);
    res.status(500).json({ message: "상품 조회 중 오류가 발생했습니다." });
  }
}

async function getProductByName(req, res) {
  try {
    const { name } = req.query;
    if (!name) {
      // name이 비어 있으면 전체 조회
      const result = await ProductModel.findAllProducts();
      return res.json(result);
    } else {
      // 검색어가 있으면 검색 조회
      const result = await ProductModel.findProductByName(name);
      return res.json(result);
    }
  } catch (error) {
    console.error("상품 단건 조회 컨트롤러 오류:", error);
    res.status(500).json({ message: "상품 조회 중 오류가 발생했습니다." });
  }
}

// 상품 리스트 조회 (특정 업체별 필터링 가능)
async function getAllProducts(req, res) {
  try {
    const { companyId } = req.query; // Query parameter로 companyId를 받을 수 있도록 함
    const products = await ProductModel.findAllProducts(companyId);
    res.json(products);
  } catch (error) {
    console.error("상품 목록 조회 컨트롤러 오류:", error);
    res.status(500).json({ message: "상품 목록 조회 중 오류가 발생했습니다." });
  }
}

// 상품 업데이트
async function updateProduct(req, res) {
  try {
    const productId = req.params.id;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "상품 이름은 필수입니다." });
    }
    const updated = await ProductModel.updateProduct(productId, { name });
    if (!updated) {
      return res
        .status(404)
        .json({ message: "상품을 찾을 수 없거나 업데이트에 실패했습니다." });
    }
    res.json({ message: "상품이 업데이트되었습니다." });
  } catch (error) {
    console.error("상품 업데이트 컨트롤러 오류:", error);
    res.status(500).json({ message: "상품 업데이트 중 오류가 발생했습니다." });
  }
}

// 상품 삭제 (논리적 삭제)
async function deleteProduct(req, res) {
  try {
    const productId = req.params.id;
    const deleted = await ProductModel.deleteProduct(productId);
    if (!deleted) {
      return res
        .status(404)
        .json({ message: "상품을 찾을 수 없거나 삭제에 실패했습니다." });
    }
    res.json({ message: "상품이 삭제되었습니다." });
  } catch (error) {
    console.error("상품 삭제 컨트롤러 오류:", error);
    res.status(500).json({ message: "상품 삭제 중 오류가 발생했습니다." });
  }
}

async function getProductWithCompany(req, res) {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "상품 이름은 필수입니다." });
    }
    const product = await ProductModel.findProductWithCompany(name);
    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }
    res.json(product);
  } catch (error) {
    console.error("상품 및 업체 조회 컨트롤러 오류:", error);
    res
      .status(500)
      .json({ message: "상품 및 업체 조회 중 오류가 발생했습니다." });
  }
}
module.exports = {
  createProduct,
  getProductById,
  getProductByName,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductWithCompany,
};
