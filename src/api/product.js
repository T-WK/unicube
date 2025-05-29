const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const { authorize, authMiddleware } = require("../utils/authorize");

router.post("/products", authorize(["admin"]), productController.createProduct);
router.get(
  "/products/:id",
  authorize(["admin"]),
  productController.getProductById,
);
router.get("/products", authorize(["admin"]), productController.getAllProducts);
router.put(
  "/products/:id",
  authorize(["admin"]),
  productController.updateProduct,
);
router.delete(
  "/products/:id",
  authorize(["admin"]),
  productController.deleteProduct,
);

module.exports = router;
