const express = require("express");
const router = express.Router();

const invoiceController = require("../controllers/invoiceController");

router.get("/export", invoiceController.exportInvoice);

router.get("/:id", invoiceController.getInvoiceById);
router.get("/", invoiceController.getInvoiceByQuery);
router.post("/", invoiceController.createInvoice);
router.patch("/", invoiceController.updateInvoice);
router.delete("/:id", invoiceController.removeInvoice);

module.exports = router;
