const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  registerEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
  forgotPasswordByRegistrationId
} = require("../../Controllers/Employee/EmployeeController");

// Storage config for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});

const upload = multer({ storage });

// REGISTER Employee
router.post(
  "/register",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "birthCertificate", maxCount: 1 },
    { name: "idCopy", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ]),
  registerEmployee
);

// UPDATE Employee
router.put(
  "/:id",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "birthCertificate", maxCount: 1 },
    { name: "idCopy", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ]),
  updateEmployee
);

// DELETE Employee
router.delete("/:id", deleteEmployee);

// GET All Employees
router.get("/", getEmployees);

router.get("/:id", getEmployeeById);

// Employee forgot password by registration id
router.post("/forgot-password", forgotPasswordByRegistrationId);


module.exports = router;

