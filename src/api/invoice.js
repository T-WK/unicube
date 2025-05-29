const express = require("express");
const router = express.Router();

const invoiceController = require("../controllers/invoiceController");
const { authorize, authMiddleware } = require("../utils/authorize");

router.get("/export", invoiceController.exportInvoice);
router.get("/:id", invoiceController.getInvoiceById);
router.get("/", invoiceController.getInvoiceByQuery);

router.post("/", authorize(["admin"]), invoiceController.createInvoice);
router.patch("/", authorize(["admin"]), invoiceController.updateInvoice);
router.delete("/:id", authorize(["admin"]), invoiceController.removeInvoice);

module.exports = router;
