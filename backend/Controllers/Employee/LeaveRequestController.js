const { google } = require("googleapis");
const path = require("path");
const LeaveRequest = require("../../Models/Employee/LeaveRequestModel");
const nodemailer = require("nodemailer");

// Load Google service account
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "../../config/holiday-request-473312-07cf4269899f.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

// Google Sheet config
const SHEET_ID = "1bCGJo273R2xivfGeouJLoed6qTDrY3jlJvj9E2AmPKE";
const RANGE = "Form Responses 1!A:J";

// Sync leave requests from Google Sheet to DB
exports.syncLeaveRequests = async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(200).json({ message: "No requests found" });
    }

    const requests = [];

    for (const row of rows.slice(1)) {
      const request = {
        timestamp: new Date(row[0]),
        email: row[1],
        name: row[2],
        employeeId: row[3],
        department: row[4],
        designation: row[5],
        leaveType: row[6],
        startDate: new Date(row[7]),
        endDate: new Date(row[8]),
        reason: row[9] || "",
      };

      // Avoid duplicates
      const exists = await LeaveRequest.findOne({
        email: request.email,
        employeeId: request.employeeId,
        startDate: request.startDate,
        endDate: request.endDate,
      });

      if (!exists) {
        await LeaveRequest.create(request);
      }

      requests.push(request);
    }

    res.status(200).json(requests);
  } catch (err) {
    console.error("Sync Error:", err);
    res.status(500).json({ message: "Error syncing leave requests" });
  }
};

// Get all leave requests
exports.getLeaveRequests = async (req, res) => {
  try {
    const requests = await LeaveRequest.find().sort({ timestamp: -1 });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve/Reject leave request
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminComment } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Leave request ID is required" });
    }

    if (!status || !["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await LeaveRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    // Update status and admin comment
    request.status = status;
    request.adminComment = adminComment || "";
    await request.save();

    // Send email notification (optional: wrap in try/catch)
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      const subject =
        status === "Approved"
          ? "✅ Leave Approved"
          : status === "Rejected"
          ? "❌ Leave Rejected"
          : "ℹ️ Leave Request Update";

      const text = `
Hello ${request.name},

Your leave request (${request.leaveType}) from ${request.startDate.toDateString()} to ${request.endDate.toDateString()} has been ${status}.

Comment: ${adminComment || "No additional comment."}

Regards,
HR Department
`;

      await transporter.sendMail({
        from: `"HR Department" <${process.env.MAIL_USER}>`,
        to: request.email,
        subject,
        text,
      });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr.message);
    }

    return res.status(200).json({ message: `Leave ${status}`, request });
  } catch (err) {
    console.error("Update Error:", err.message);
    return res.status(500).json({ message: "Failed to update leave status", error: err.message });
  }
};