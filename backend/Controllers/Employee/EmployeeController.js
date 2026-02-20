const Employee = require("../../Models/Employee/EmployeeModel");
const jwt = require("jsonwebtoken");
const { sendResetEmail } = require("../../utils/emailService");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

exports.registerEmployee = async (req, res) => {
  try {
    const { name, age, address, email, phone, department, designation } =
      req.body;

    const registrationId = "EMP" + Date.now();

    const newEmployee = new Employee({
      name,
      registrationId,
      age,
      address,
      email,
      phone,
      department,
      designation,
      photo: req.files?.photo ? req.files.photo[0].filename : "",
      birthCertificate: req.files?.birthCertificate
        ? req.files.birthCertificate[0].filename
        : "",
      idCopy: req.files?.idCopy ? req.files.idCopy[0].filename : "",
      cv: req.files?.cv ? req.files.cv[0].filename : "",
    });

    await newEmployee.save();
    res
      .status(201)
      .json({
        message: "Employee registered successfully",
        employee: newEmployee,
      });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists!` });
    }
    res.status(400).json({ message: error.message });
  }
};

// controllers/EmployeeController.js
exports.getEmployees = async (req, res) => {
  try {
    const { name, department, designation } = req.query;
    const query = {};

    if (name) query.name = { $regex: name, $options: "i" }; // case-insensitive
    if (department) query.department = department;
    if (designation) query.designation = designation;

    const employees = await Employee.find(query);
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    // Update normal fields
    Object.keys(req.body).forEach((key) => {
      employee[key] = req.body[key];
    });

    // Handle file updates
    if (req.files) {
      const fileFields = ["photo", "birthCertificate", "idCopy", "cv"];
      fileFields.forEach((field) => {
        if (req.files[field]) {
          // Remove old file if exists
          if (employee[field]) {
            const oldPath = path.join(__dirname, "../../uploads", employee[field]);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
          }
          // Save new file name
          employee[field] = req.files[field][0].filename;
        }
      });
    }

    await employee.save();
    res.status(200).json({ message: "Employee updated successfully", employee });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Send password reset email to employee by registrationId
exports.forgotPasswordByRegistrationId = async (req, res) => {
  try {
    const { registrationId } = req.body;
    if (!registrationId) {
      return res.status(400).json({ message: "registrationId is required" });
    }

    const employee = await Employee.findOne({ registrationId });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const secret = process.env.JWT_SECRET || "your-secret-key";
    const token = jwt.sign({ rid: employee.registrationId, scope: "employee" }, secret, { expiresIn: "15m" });

    await sendResetEmail(employee.email, token);

    return res.json({ message: "Password reset email sent" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to send reset email", error: err?.message });
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // files will be saved in uploads/
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) cb(null, true);
  else cb(new Error("Only images and documents (pdf, doc, docx) are allowed"));
};

const upload = multer({ storage, fileFilter });

// Middleware to handle multiple files
exports.uploadFiles = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "birthCertificate", maxCount: 1 },
  { name: "idCopy", maxCount: 1 },
  { name: "cv", maxCount: 1 }, // ✅ CV upload
]);
