const express = require("express");
const router = express.Router();

const companyController = require("../controllers/companyController");
const { authorize } = require("../utils/authorize");

router.post("/", authorize(["admin"]), companyController.createCompany);
router.get("/:id", authorize(["admin"]), companyController.getCompanyById);
router.get("/", authorize(["admin"]), companyController.getAllCompanies);
router.patch("/:id", authorize(["admin"]), companyController.updateCompany);
router.delete("/:id", authorize(["admin"]), companyController.deleteCompany);

module.exports = router;
