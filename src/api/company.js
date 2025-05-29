const express = require("express");
const router = express.Router();

const companyController = require("../controllers/companyController");
const { authorize, authMiddleware } = require("../utils/authorize");

router.post("/company", authorize(["admin"]), companyController.createCompany);
router.get(
  "/company/:id",
  authorize(["admin"]),
  companyController.getCompanyById,
);
router.get("/company", authorize(["admin"]), companyController.getAllCompanies);
router.put(
  "/company/:id",
  authorize(["admin"]),
  companyController.updateCompany,
);
router.delete(
  "/company/:id",
  authorize(["admin"]),
  companyController.deleteCompany,
);

module.exports = router;
