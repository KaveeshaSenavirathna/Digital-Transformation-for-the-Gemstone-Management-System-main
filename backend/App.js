require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Allow overriding the port via environment
const PORT = process.env.PORT || 5000;

//Employee
const employeeRoutes = require("./Routes/Employee/EmployeeRoutes");
const employeeAuthRoutes = require("./Routes/Employee/EmployeeAuthRoutes");
const attendanceRoutes = require("./Routes/Employee/AttendanceRoutes");
const taskRoutes = require("./Routes/Employee/TaskRoutes");
const performanceRoutes = require("./Routes/Employee/PerformanceRoutes");

//Finance
const workSummaryRoutes = require("./Routes/Finance/WorkSummaryRoute");
const productionSalaryRoutes = require("./Routes/Finance/ProductionSalaryRoutes");
const dailySalaryRoutes = require("./Routes/Finance/DailySalaryRoutes");

//Production and process
const PreformLotRouter = require("./Routes/Production & Process/PreformRoute");
const PreformProceedRoute = require("./Routes/Production & Process/PreformProceedRoute");
const CalibrateLotRouter = require("./Routes/Production & Process/ClibrateRoute");
const CalibrateProceedRoute = require("./Routes/Production & Process/CalibrateProceedRoute");
const CPLotRouter = require("./Routes/Production & Process/CutandPolishRoute");
const cplotProceedRoutes = require("./Routes/Production & Process/CutandPolishProceedRoutes");
const DopLotRouter = require("./Routes/Production & Process/DopRoute");
const dopRoutes = require("./Routes/Production & Process/DopProceedRoute");
//Inventory
const NewStoneLotRouter = require("./Routes/MainInventroy/NewSupplytRoute");
const NewlotLotRouter = require("./Routes/MainInventroy/NewLotRoute");
const rawMaterialRoutes = require("./Routes/MainInventroy/RawMaterialRoute");

//marketplace
const verifyToken = require("./middleware/authMiddleware");
const productRoutes = require("./Routes/Marketplace/Web_productRoutes");
const authRoutes = require("./Routes/Marketplace/authRoutes");
const userRoutes = require("./Routes/Marketplace/UserRoute");
const requestRoutes = require("./Routes/Marketplace/requestRoutes");

//dashboard registration
const dashboardRegistrationRoutes = require("./Routes/DashboardRegistrationRoutes");

//AI Recommendation
const aiRecommendationRoutes = require("./Routes/AIRecommendationRoutes");

//Consultation
const consultationRoutes = require("./Routes/ConsultationRoutes");

//CERTIFICATES
const certificateRoutes = require("./Routes/certification/CertificatesRoute");

// middleware
const app = express();
app.use(express.json());
app.use(cors());

//uploads
app.use("/uploads", express.static("uploads"));
app.use(
  "/uploads/products",
  express.static(path.join(__dirname, "uploads/products")),
);
app.use(
  "/uploads/certificates",
  express.static(path.join(__dirname, "uploads/certificates")),
);

//certificates
app.use("/certificates", certificateRoutes);
//customer and order
app.use("/products", productRoutes);
//marketplace
app.use("/auth", authRoutes); // login, register, forgot/reset
app.use("/users", userRoutes);
app.use("/requests", requestRoutes);

//dashboard registration
app.use("/api/dashboard-registration", dashboardRegistrationRoutes);

//AI Recommendation
app.use("/ai", aiRecommendationRoutes);

//Consultation
app.use("/api/consultation", consultationRoutes);

//Inventory
app.use("/rawmaterials", rawMaterialRoutes);
app.use("/newlot", NewlotLotRouter);
app.use("/supplylot", NewStoneLotRouter);
// Production and process
app.use("/dop", dopRoutes);
app.use("/doplot", DopLotRouter);
app.use("/cplotProceed", cplotProceedRoutes);
app.use("/cplot", CPLotRouter);
app.use("/calibrateproceed", CalibrateProceedRoute);
app.use("/calibratelot", CalibrateLotRouter);
app.use("/preformproceed", PreformProceedRoute);
app.use("/preformlot", PreformLotRouter);
//Employee
app.use("/performance", performanceRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/leaves", require("./Routes/Employee/LeaveRoutes"));
app.use("/api/attendance", attendanceRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/employee-auth", employeeAuthRoutes);

//Finance
app.use("/employees", workSummaryRoutes);
app.use("/production-salaries", productionSalaryRoutes);
app.use("/daily-salaries", dailySalaryRoutes);

// Example of protected route using JWT middleware
app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: `Hello ${req.user.id}, you have access!` });
});
//DB connection
//password - 6nm5iJRA98MHAp7V-

mongoose
  .connect(
    "mongodb+srv://User:6nm5iJRA98MHAp7V@cluster01.es08ubd.mongodb.net/DGMS",
  )
  .then(() => console.log("connected to mongoDB"))
  .then(() => {
    app.listen(PORT, () => console.log(`server listening on ${PORT}`));
  })
  .catch((err) => console.log(err));
