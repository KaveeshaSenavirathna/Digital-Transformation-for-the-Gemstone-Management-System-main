import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
// --- NEW CSS IMPORT ---
import "../Styles/Attendancesummery.css";

function AttendanceDashboard() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [period, setPeriod] = useState("daily");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weekStart, setWeekStart] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [summary, setSummary] = useState([]);
  const [totals, setTotals] = useState({ Present: 0, Absent: 0, Leave: 0 });

  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch employees
  useEffect(() => {
    axios.get("http://localhost:5000/api/employees")
      .then(res => setEmployees(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch summary & calculate totals
  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/attendance/summary", {
        params: { period, date, weekStart, month, year }
      });
      setSummary(res.data);

      // Calculate totals
      const total = res.data.reduce(
        (acc, d) => {
          acc.Present += d.Present;
          acc.Absent += d.Absent;
          acc.Leave += d.Leave;
          return acc;
        },
        { Present: 0, Absent: 0, Leave: 0 }
      );
      setTotals(total);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [period, date, weekStart, month, year]);

  // Fetch summary on component load with default values
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);


  // Download filtered summary
  const downloadSummary = () => {
    const params = new URLSearchParams({ period, date, weekStart, month, year });
    window.open(`http://localhost:5000/api/attendance/summary/download?${params.toString()}`, "_blank");
  };

  // Download summary with totals
  const downloadTotals = () => {
    const params = new URLSearchParams({ period, date, weekStart, month, year });
    window.open(`http://localhost:5000/api/attendance/summary/download-with-totals?${params.toString()}`, "_blank");
  };

  // Fetch employee attendance
  const fetchEmployeeAttendance = async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/attendance/employee/details", {
        params: { employeeId, period, date, weekStart, month, year }
      });
      setEmployeeAttendance(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Download employee attendance
  const downloadEmployeeAttendance = () => {
    if (!employeeId) return alert("Select an employee first");
    const params = new URLSearchParams({ employeeId, period, date, weekStart, month, year });
    window.open(`http://localhost:5000/api/attendance/employee/download?${params.toString()}`, "_blank");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="page-title">Attendance Summary</h2>
        <button 
          onClick={() => navigate('/attendancenew')} 
          className="back-button"
        >
          &larr; Back to Daily Attendance
        </button>
      </div>

      {/* === Period Filter & Actions === */}
      <div className="filter-bar">
        <label>
          Period:
          <select value={period} onChange={e => setPeriod(e.target.value)} style={{ marginLeft: "10px" }}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>

        {period === "daily" && <input type="date" value={date} onChange={e => setDate(e.target.value)} />}
        {period === "weekly" && <input type="date" value={weekStart} onChange={e => setWeekStart(e.target.value)} />}
        {period === "monthly" && (
          <>
            <input type="number" min="1" max="12" value={month} onChange={e => setMonth(e.target.value)} placeholder="Month" style={{ width: "80px" }} />
            <input type="number" value={year} onChange={e => setYear(e.target.value)} placeholder="Year" style={{ width: "100px" }} />
          </>
        )}

        <button onClick={fetchSummary} className="view-summary-btn" disabled={loading}>
          {loading ? "Loading..." : "View Summary"}
        </button>
        <button onClick={downloadSummary} className="download-summary-btn">
          Download Summary
        </button>
        <button onClick={downloadTotals} className="download-totals-btn">
          Download Totals
        </button>
      </div>

      {/* === Department-wise Summary Cards === */}
      <h3 className="summary-section-title">Department-wise Summary</h3>
      <div className="summary-cards-container">
        {summary.map((d, idx) => (
          <div key={idx} className="summary-card">
            <h4>{d.department}</h4>
            <p>Present: {d.Present}</p>
            <p>Absent: {d.Absent}</p>
            <p>Leave: {d.Leave}</p>
          </div>
        ))}
      </div>

      {/* === Total Summary Card === */}
      <div className="summary-cards-container">
        <div className="summary-card total-card">
          <h3>Total</h3>
          <p>Present: {totals.Present}</p>
          <p>Absent: {totals.Absent}</p>
          <p>Leave: {totals.Leave}</p>
        </div>
      </div>

      {/* === Employee Attendance Details === */}
      <div className="employee-detail-section">
        <h3 className="summary-section-title">Employee Attendance Details</h3>
        <div className="employee-controls">
          <select value={employeeId} onChange={e => setEmployeeId(e.target.value)}>
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>{emp.name} ({emp.registrationId})</option>
            ))}
          </select>
          <button onClick={fetchEmployeeAttendance} className="view-summary-btn" disabled={loading}>
            View Attendance
          </button>
          <button onClick={downloadEmployeeAttendance} className="download-summary-btn">
            Download Excel
          </button>
        </div>

        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Time In</th>
              <th>Leave Start</th>
              <th>Leave End</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
                <tr><td colSpan="6" className="no-records">Loading employee details...</td></tr>
            ) : employeeAttendance.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-records">No records found for the selected employee and period.</td>
              </tr>
            ) : (
              employeeAttendance.map(att => (
                <tr key={att._id}>
                  <td>{att.date}</td>
                  <td className={`status-${att.status}`}>{att.status}</td>
                  <td>{att.timeIn || "-"}</td>
                  <td>{att.leaveStartTime || "-"}</td>
                  <td>{att.leaveEndTime || "-"}</td>
                  <td>{att.leaveReason || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceDashboard;