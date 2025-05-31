const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const { authorize, authMiddleware } = require("../utils/authorize");

router.post("/", authorize(["admin"]), productController.createProduct);
router.get("/:id", authorize(["admin"]), productController.getProductById);
router.get("/", authorize(["admin"]), productController.getAllProducts);
router.put("/:id", authorize(["admin"]), productController.updateProduct);
router.delete("/:id", authorize(["admin"]), productController.deleteProduct);

module.exports = router;
