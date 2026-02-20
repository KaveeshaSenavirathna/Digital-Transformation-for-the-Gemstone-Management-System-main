const ExcelJS = require("exceljs");
const Attendance = require("../../Models/Employee/AttendanceModel");
const Employee = require("../../Models/Employee/EmployeeModel");

// ===== MARK ATTENDANCE =====
exports.markAttendance = async (req, res) => {
  try {
    const { employeeId, status, leaveStartTime, leaveEndTime, leaveReason } = req.body;
    const date = new Date().toISOString().split("T")[0];

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    if (["Present", "Absent"].includes(status)) {
      const exists = await Attendance.findOne({
        employeeId,
        date,
        status: { $in: ["Present", "Absent"] },
      });
      if (exists) return res.status(400).json({ message: `Already marked as ${exists.status} today.` });
    }

    const attendance = new Attendance({
      employeeId,
      department: employee.department,
      designation: employee.designation,
      date,
      status,
      timeIn: status === "Present" ? new Date().toLocaleTimeString() : undefined,
      leaveStartTime: status === "Leave" ? leaveStartTime : undefined,
      leaveEndTime: status === "Leave" ? leaveEndTime : undefined,
      leaveReason: status === "Leave" ? leaveReason : undefined,
    });

    await attendance.save();
    res.status(201).json({ message: "Attendance marked successfully", attendance });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Duplicate attendance detected." });
    res.status(500).json({ message: err.message });
  }
};

// ===== GET DAILY ATTENDANCE =====
exports.getDailyAttendance = async (req, res) => {
  try {
    const date = new Date().toISOString().split("T")[0];
    const records = await Attendance.find({ date })
      .populate("employeeId", "name registrationId department designation")
      .sort({ date: 1 });
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ===== UPDATE ATTENDANCE =====
exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, leaveStartTime, leaveEndTime, leaveReason } = req.body;

    const attendance = await Attendance.findById(id);
    if (!attendance) return res.status(404).json({ message: "Attendance not found" });

    attendance.status = status || attendance.status;
    attendance.timeIn = status === "Present" ? new Date().toLocaleTimeString() : attendance.timeIn;
    attendance.leaveStartTime = status === "Leave" ? leaveStartTime : undefined;
    attendance.leaveEndTime = status === "Leave" ? leaveEndTime : undefined;
    attendance.leaveReason = status === "Leave" ? leaveReason : undefined;

    await attendance.save();
    res.status(200).json({ message: "Attendance updated successfully", attendance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== DELETE ATTENDANCE =====
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Attendance.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Attendance not found" });
    res.status(200).json({ message: "Attendance deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== HELPER: buildDateFilter =====
const buildDateFilter = (period, date, weekStart, month, year) => {
  const today = new Date();
  if (period === "daily") return { date: date || today.toISOString().split("T")[0] };
  if (period === "weekly") {
    const startDate = weekStart ? new Date(weekStart) : today;
    const day = startDate.getDay();
    const start = new Date(startDate); start.setDate(startDate.getDate() - day);
    const end = new Date(start); end.setDate(start.getDate() + 6);
    return { date: { $gte: start.toISOString().split("T")[0], $lte: end.toISOString().split("T")[0] } };
  }
  if (period === "monthly") {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    return { date: { $gte: start.toISOString().split("T")[0], $lte: end.toISOString().split("T")[0] } };
  }
  return {};
};

// ===== GET DEPARTMENT-WISE SUMMARY =====
exports.getAttendanceSummary = async (req, res) => {
  try {
    const { period, date, weekStart, month, year } = req.query;
    const match = buildDateFilter(period, date, weekStart, month, year);

    const summary = await Attendance.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$department",
          Present: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
          Absent: { $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] } },
          Leave: { $sum: { $cond: [{ $eq: ["$status", "Leave"] }, 1, 0] } },
        },
      },
    ]);

    res.status(200).json(summary.map(r => ({
      department: r._id,
      Present: r.Present,
      Absent: r.Absent,
      Leave: r.Leave,
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== DOWNLOAD DEPARTMENT-WISE SUMMARY WITH TOTALS =====

// Download totals (department summary + total row)
exports.downloadSummaryWithTotals = async (req, res) => {
  try {
    const { period, date, weekStart, month, year } = req.query;
    let match = {};

    if (period === "daily" && date) match.date = date;
    else if (period === "weekly" && weekStart) {
      const start = new Date(weekStart);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      match.date = { $gte: start.toISOString().split("T")[0], $lte: end.toISOString().split("T")[0] };
    } else if (period === "monthly" && month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      match.date = { $gte: start.toISOString().split("T")[0], $lte: end.toISOString().split("T")[0] };
    } else return res.status(400).json({ message: "Invalid period" });

    const summary = await Attendance.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$department",
          Present: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
          Absent: { $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] } },
          Leave: { $sum: { $cond: [{ $eq: ["$status", "Leave"] }, 1, 0] } },
        },
      },
    ]);

    if (!summary.length) return res.status(404).json({ message: "No attendance data found" });

    const totals = summary.reduce(
      (acc, d) => {
        acc.Present += d.Present;
        acc.Absent += d.Absent;
        acc.Leave += d.Leave;
        return acc;
      },
      { Present: 0, Absent: 0, Leave: 0 }
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Summary");

    sheet.columns = [
      { header: "Department", key: "department", width: 25 },
      { header: "Present", key: "Present", width: 15 },
      { header: "Absent", key: "Absent", width: 15 },
      { header: "Leave", key: "Leave", width: 15 },
    ];

    summary.forEach(d => {
      sheet.addRow({ department: d._id, Present: d.Present, Absent: d.Absent, Leave: d.Leave });
    });

    const totalRow = sheet.addRow({ department: "TOTAL", Present: totals.Present, Absent: totals.Absent, Leave: totals.Leave });
    totalRow.font = { bold: true };

    const fileName = `attendance_summary_${period}_${date || weekStart || `${year}_${month}`}.xlsx`;
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ===== GET INDIVIDUAL EMPLOYEE ATTENDANCE =====
exports.getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId, period, date, weekStart, month, year } = req.query;
    if (!employeeId) return res.status(400).json({ message: "employeeId required" });

    const dateFilter = buildDateFilter(period, date, weekStart, month, year);
    const records = await Attendance.find({ employeeId, ...dateFilter })
      .populate("employeeId", "name registrationId department designation")
      .sort({ date: 1 });

    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== DOWNLOAD INDIVIDUAL EMPLOYEE ATTENDANCE =====
exports.downloadEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId, period, date, weekStart, month, year } = req.query;
    if (!employeeId) return res.status(400).json({ message: "employeeId required" });

    const dateFilter = buildDateFilter(period, date, weekStart, month, year);
    const records = await Attendance.find({ employeeId, ...dateFilter })
      .populate("employeeId", "name registrationId department designation")
      .sort({ date: 1 });

    if (!records.length) return res.status(404).json({ message: "No attendance data found" });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Employee Attendance");

    sheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Reg ID", key: "registrationId", width: 15 },
      { header: "Department", key: "department", width: 20 },
      { header: "Designation", key: "designation", width: 25 },
      { header: "Date", key: "date", width: 15 },
      { header: "Status", key: "status", width: 10 },
      { header: "Time In", key: "timeIn", width: 15 },
      { header: "Leave Start", key: "leaveStartTime", width: 15 },
      { header: "Leave End", key: "leaveEndTime", width: 15 },
      { header: "Reason", key: "leaveReason", width: 30 },
    ];

    records.forEach(r => {
      sheet.addRow({
        name: r.employeeId?.name || "",
        registrationId: r.employeeId?.registrationId || "",
        department: r.employeeId?.department || "",
        designation: r.employeeId?.designation || "",
        date: r.date,
        status: r.status,
        timeIn: r.timeIn || "",
        leaveStartTime: r.leaveStartTime || "",
        leaveEndTime: r.leaveEndTime || "",
        leaveReason: r.leaveReason || "",
      });
    });

    const fileName = `employee_attendance_${employeeId}_${period}_${date || weekStart || `${year}_${month}`}.xlsx`;
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Download filtered summary (department-wise)
exports.downloadAttendance = async (req, res) => {
  try {
    const { period, date, weekStart, month, year } = req.query;
    let match = {};

    // Date filtering logic
    if (period === "daily" && date) match.date = date;
    else if (period === "weekly" && weekStart) {
      const start = new Date(weekStart);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      match.date = { $gte: start.toISOString().split("T")[0], $lte: end.toISOString().split("T")[0] };
    } else if (period === "monthly" && month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      match.date = { $gte: start.toISOString().split("T")[0], $lte: end.toISOString().split("T")[0] };
    } else {
      return res.status(400).json({ message: "Invalid period or date parameters" });
    }

    const records = await Attendance.find(match)
      .populate("employeeId", "name registrationId department designation")
      .sort({ date: 1 });

    if (!records.length) return res.status(404).json({ message: "No attendance data found" });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Attendance");

    sheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Reg ID", key: "registrationId", width: 15 },
      { header: "Department", key: "department", width: 20 },
      { header: "Designation", key: "designation", width: 25 },
      { header: "Date", key: "date", width: 15 },
      { header: "Status", key: "status", width: 10 },
      { header: "Time In", key: "timeIn", width: 15 },
      { header: "Leave Start", key: "leaveStartTime", width: 15 },
      { header: "Leave End", key: "leaveEndTime", width: 15 },
      { header: "Reason", key: "leaveReason", width: 30 },
    ];

    records.forEach(r => {
      sheet.addRow({
        name: r.employeeId?.name || "",
        registrationId: r.employeeId?.registrationId || "",
        department: r.employeeId?.department || "",
        designation: r.employeeId?.designation || "",
        date: r.date,
        status: r.status,
        timeIn: r.timeIn || "",
        leaveStartTime: r.leaveStartTime || "",
        leaveEndTime: r.leaveEndTime || "",
        leaveReason: r.leaveReason || "",
      });
    });

    const fileName = `attendance_${period}_${date || weekStart || `${year}_${month}`}.xlsx`;
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTodayPresentCount = async (req, res) => {
  try {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    console.log("Querying present employees for date:", todayStr);

    const attendanceRecords = await Attendance.find({
      date: todayStr,
      status: "Present"
    });

    res.status(200).json({ count: attendanceRecords.length });
  } catch (error) {
    console.error("Error fetching present count:", error);
    res.status(500).json({ message: "Server Error" });
  }
};