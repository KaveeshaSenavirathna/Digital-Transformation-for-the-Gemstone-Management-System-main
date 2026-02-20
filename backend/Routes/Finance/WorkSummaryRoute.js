const express = require("express");
const router = express.Router();
const CalibrateProceed = require("../../Models/Production & Process/CalibrateProceedModel");
const CPLotProceed = require("../../Models/Production & Process/CutandPolishProceed");
const DOPProceed = require("../../Models/Production & Process/DopProceedModel");
const Attendance = require("../../Models/Employee/AttendanceModel");
const Employee = require("../../Models/Employee/EmployeeModel");
const ProductionSalary = require("../../Models/Finance/ProductionSalaryModel");
const DailySalary = require("../../Models/Finance/DailySalaryModel");

// GET /monthlysummary?month=10&year=2025
router.get("/monthlysummary", async (req, res) => {
  try {
    const month = parseInt(req.query.month); 
    const year = parseInt(req.query.year); 

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const aggregateStage = async (Model, employeeField, stageName) => {
      return Model.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end } } },
        {
          $addFields: {
            pcsNumeric: { $toDouble: { $ifNull: ["$pcs", 0] } },
            ctsNumeric: { $toDouble: { $ifNull: ["$cts", 0] } }
          }
        },
        {
          $group: {
            _id: `$${employeeField}`,
            employee_name: { $first: `$${employeeField.replace("_id", "_name")}` },
            stage: { $first: stageName },
            stone_code: { $first: "$stone_code" },
            type: { $first: "$type" },
            total_lots: { $sum: 1 },
            total_pcs: { $sum: "$pcsNumeric" },
            total_cts: { $sum: "$ctsNumeric" },
          },
        },
      ]);
    };

    // Aggregate data from all production stages
    const [dopData, calibrateData, cpData] = await Promise.all([
      aggregateStage(DOPProceed, "dop_id", "DOP"),
      aggregateStage(CalibrateProceed, "cal_id", "Calibrate"),
      aggregateStage(CPLotProceed, "cp_id", "Cut & Polish")
    ]);

    // Combine all data
    const allData = [...dopData, ...calibrateData, ...cpData];

    // Get production salary rates
    const salaryRates = await ProductionSalary.find({ isActive: true });
    
    // Calculate production salary for each record
    const dataWithSalary = allData.map(record => {
      // Find matching salary rate based on stone code and type
      let salaryRate = null;
      
      // First try to match by stone code
      if (record.stone_code) {
        salaryRate = salaryRates.find(rate => 
          rate.stoneCode === record.stone_code
        );
      }
      
      // If no match by stone code, try to match by type and stage
      if (!salaryRate) {
        salaryRate = salaryRates.find(rate => 
          (record.stage === "DOP" && rate.type.toLowerCase().includes("dop")) ||
          (record.stage === "Calibrate" && rate.type.toLowerCase().includes("calibrate")) ||
          (record.stage === "Cut & Polish" && rate.type.toLowerCase().includes("cut")) ||
          (record.type && rate.type.toLowerCase().includes(record.type.toLowerCase()))
        );
      }
      
      // If still no match, try to match by stage only
      if (!salaryRate) {
        salaryRate = salaryRates.find(rate => 
          rate.type.toLowerCase().includes(record.stage.toLowerCase())
        );
      }
      
      const productionSalary = salaryRate ? 
        Math.round(record.total_pcs * salaryRate.pricePerPcs) : 0;
      
      return {
        ...record,
        productionSalary,
        salaryRate: salaryRate?.pricePerPcs || 0
      };
    });

    res.status(200).json({ summary: dataWithSalary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching monthly summary" });
  }
});

// GET /attendancesummary?month=10&year=2025&department=finance&designation=accountent
router.get("/attendancesummary", async (req, res) => {
  try {
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);
    const department = req.query.department;
    const designation = req.query.designation;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    // Build filter for attendance
    const attendanceFilter = {
      date: {
        $gte: start.toISOString().split('T')[0],
        $lte: end.toISOString().split('T')[0]
      }
    };

    if (department) attendanceFilter.department = department;
    if (designation) attendanceFilter.designation = designation;

    // Get attendance data with employee details
    const attendanceData = await Attendance.find(attendanceFilter)
      .populate('employeeId', 'name registrationId department designation')
      .sort({ date: 1 });

    // Validate attendance data
    if (!attendanceData || !Array.isArray(attendanceData)) {
      return res.status(400).json({ 
        message: "No attendance data found for the specified criteria" 
      });
    }

    // Get daily salary rates
    const dailySalaryRates = await DailySalary.find({ isActive: true });
    
    // Create a map for quick lookup
    const salaryRateMap = {};
    dailySalaryRates.forEach(rate => {
      // Skip rates with null or missing employeeId
      if (rate.employeeId) {
        salaryRateMap[rate.employeeId.toString()] = rate.dailyRate;
      } else {
        console.warn('Skipping salary rate with missing employeeId:', rate._id);
      }
    });

    // Group attendance by employee
    const employeeSummary = {};
    
    attendanceData.forEach(record => {
      try {
        // Skip records with null or missing employeeId
        if (!record.employeeId || !record.employeeId._id) {
          console.warn('Skipping attendance record with missing employeeId:', record._id);
          return;
        }

        const empId = record.employeeId._id.toString();
        const empName = record.employeeId.name || 'Unknown Employee';
        const empRegId = record.employeeId.registrationId || 'N/A';
        const empDept = record.employeeId.department || 'Unknown Department';
        const empDesig = record.employeeId.designation || 'Unknown Designation';

      if (!employeeSummary[empId]) {
        const dailyRate = salaryRateMap[empId] || 1000; // Default daily rate if not found
        employeeSummary[empId] = {
          employeeId: empId,
          employeeName: empName,
          registrationId: empRegId,
          department: empDept,
          designation: empDesig,
          totalDays: 0,
          presentDays: 0,
          absentDays: 0,
          leaveDays: 0,
          attendanceDetails: [],
          dailyRate: dailyRate,
          calculatedSalary: 0
        };
      }

      employeeSummary[empId].totalDays++;
      employeeSummary[empId].attendanceDetails.push({
        date: record.date,
        status: record.status,
        timeIn: record.timeIn,
        leaveReason: record.leaveReason
      });

        if (record.status === 'Present') employeeSummary[empId].presentDays++;
        else if (record.status === 'Absent') employeeSummary[empId].absentDays++;
        else if (record.status === 'Leave') employeeSummary[empId].leaveDays++;
      } catch (error) {
        console.error('Error processing attendance record:', record._id, error.message);
        // Continue processing other records
      }
    });

    // Calculate salary for each employee
    Object.values(employeeSummary).forEach(emp => {
      emp.calculatedSalary = Math.round(emp.presentDays * emp.dailyRate);
    });

    // Get summary by department and designation
    const departmentSummary = {};
    const designationSummary = {};

    Object.values(employeeSummary).forEach(emp => {
      // Department summary
      if (!departmentSummary[emp.department]) {
        departmentSummary[emp.department] = {
          department: emp.department,
          totalEmployees: 0,
          totalPresentDays: 0,
          totalAbsentDays: 0,
          totalLeaveDays: 0,
          totalSalary: 0
        };
      }
      departmentSummary[emp.department].totalEmployees++;
      departmentSummary[emp.department].totalPresentDays += emp.presentDays;
      departmentSummary[emp.department].totalAbsentDays += emp.absentDays;
      departmentSummary[emp.department].totalLeaveDays += emp.leaveDays;
      departmentSummary[emp.department].totalSalary += emp.calculatedSalary;

      // Designation summary
      if (!designationSummary[emp.designation]) {
        designationSummary[emp.designation] = {
          designation: emp.designation,
          totalEmployees: 0,
          totalPresentDays: 0,
          totalAbsentDays: 0,
          totalLeaveDays: 0,
          totalSalary: 0
        };
      }
      designationSummary[emp.designation].totalEmployees++;
      designationSummary[emp.designation].totalPresentDays += emp.presentDays;
      designationSummary[emp.designation].totalAbsentDays += emp.absentDays;
      designationSummary[emp.designation].totalLeaveDays += emp.leaveDays;
      designationSummary[emp.designation].totalSalary += emp.calculatedSalary;
    });

    res.status(200).json({
      employeeSummary: Object.values(employeeSummary),
      departmentSummary: Object.values(departmentSummary),
      designationSummary: Object.values(designationSummary),
      totalEmployees: Object.keys(employeeSummary).length,
      totalSalary: Object.values(employeeSummary).reduce((sum, emp) => sum + emp.calculatedSalary, 0)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching attendance summary" });
  }
});

module.exports = router;
