const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const { authorize } = require("../utils/authorize");

router.post("/", authorize(["admin"]), productController.createProduct);
router.get(
  "/search",
  authorize(["admin"]),
  productController.getProductWithCompany,
);
router.get("/:id", authorize(["admin"]), productController.getProductById);
router.get("/", authorize(["admin"]), productController.getAllProducts);
router.patch("/:id", authorize(["admin"]), productController.updateProduct);
router.delete("/:id", authorize(["admin"]), productController.deleteProduct);

module.exports = router;
