import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Finance/Nav/Sidebar";
import "../Styles/DisplayProcess.css";

const SUMMARY_URL = "http://localhost:5000/employees/monthlysummary"
const ATTENDANCE_URL = "http://localhost:5000/employees/attendancesummary"

export default function EmployeeMonthlySummary() {
  const [summary, setSummary] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({
    employeeSummary: [],
    departmentSummary: [],
    designationSummary: [],
    totalEmployees: 0,
    totalSalary: 0
  });
  const [month, setMonth] = useState(new Date().getMonth() + 1); // current month
  const [year, setYear] = useState(new Date().getFullYear());
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterDesignation, setFilterDesignation] = useState("");
  const [activeTab, setActiveTab] = useState("production"); // "production" or "attendance"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching summary for month: ${month}, year: ${year}`);
      const res = await axios.get(`${SUMMARY_URL}?month=${month}&year=${year}`);
      console.log('Summary response:', res.data);
      setSummary(res.data.summary || []);
    } catch (err) {
      console.error('Error fetching summary:', err);
      setError('Failed to fetch summary data. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching attendance summary for month: ${month}, year: ${year}`);
      const params = new URLSearchParams({
        month: month,
        year: year
      });
      
      if (filterDepartment) params.append('department', filterDepartment);
      if (filterDesignation) params.append('designation', filterDesignation);
      
      const res = await axios.get(`${ATTENDANCE_URL}?${params}`);
      console.log('Attendance summary response:', res.data);
      setAttendanceSummary(res.data);
    } catch (err) {
      console.error('Error fetching attendance summary:', err);
      setError('Failed to fetch attendance data. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (activeTab === "production") {
      fetchSummary();
    } else if (activeTab === "attendance") {
      fetchAttendanceSummary();
    }
    // Paysheet is generated on demand, not automatically
  }, [month, year, activeTab, filterDepartment, filterDesignation]);

  const filteredSummary = summary.filter(
    (item) => !filterEmployee || item.employee_name === filterEmployee
  );

  const filteredAttendanceSummary = attendanceSummary.employeeSummary.filter(
    (item) => !filterEmployee || item.employeeName === filterEmployee
  );

  const uniqueEmployees = [...new Set(summary.map((s) => s.employee_name))];
  const uniqueDepartments = [...new Set(attendanceSummary.employeeSummary.map((s) => s.department))];
  const uniqueDesignations = [...new Set(attendanceSummary.employeeSummary.map((s) => s.designation))];

  console.log('Current summary data:', summary);
  console.log('Filtered summary:', filteredSummary);
  console.log('Current attendance data:', attendanceSummary);

  return (
    <div className="display-process-container">
      <Sidebar />
      <h1>Employee Monthly Summary</h1>

      {error && (
        <div style={{ color: 'red', margin: '10px 0', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab("production")}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: activeTab === "production" ? '#007bff' : '#f8f9fa',
            color: activeTab === "production" ? 'white' : 'black',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Production Summary
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === "attendance" ? '#007bff' : '#f8f9fa',
            color: activeTab === "attendance" ? 'white' : 'black',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Attendance & Salary Summary
        </button>
      </div>

      <div className="filters-section">
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ width: "100px" }}
        />

        <select value={filterEmployee} onChange={(e) => setFilterEmployee(e.target.value)}>
          <option value="">All Employees</option>
          {uniqueEmployees.map((emp) => (
            <option key={emp} value={emp}>{emp}</option>
          ))}
        </select>

        {activeTab === "attendance" && (
          <>
            <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
              <option value="">All Departments</option>
              {uniqueDepartments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select value={filterDesignation} onChange={(e) => setFilterDesignation(e.target.value)}>
              <option value="">All Designations</option>
              {uniqueDesignations.map((desig) => (
                <option key={desig} value={desig}>{desig}</option>
              ))}
            </select>
          </>
        )}
      </div>

      {activeTab === "production" ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Stage</th>
              <th>Stone Code</th>
              <th>Type</th>
              <th>Total Lots</th>
              <th>Total PCS</th>
              <th>Total CTS</th>
              <th>Rate per PCS</th>
              <th>Production Salary</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9">Loading...</td>
              </tr>
            ) : filteredSummary.length === 0 ? (
              <tr>
                <td colSpan="9">No data found for selected month/year</td>
              </tr>
            ) : (
              filteredSummary.map((item) => (
                <tr key={item._id + item.stage}>
                  <td>{item.employee_name}</td>
                  <td>{item.stage}</td>
                  <td>{item.stone_code || '-'}</td>
                  <td>{item.type || '-'}</td>
                  <td>{item.total_lots}</td>
                  <td>{item.total_pcs}</td>
                  <td>{item.total_cts}</td>
                  <td>Rs. {item.salaryRate || 0}</td>
                  <td style={{ color: 'blue', fontWeight: 'bold' }}>Rs. {item.productionSalary || 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : activeTab === "attendance" ? (
        <div>
          {/* Summary Cards */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#e3f2fd', 
              borderRadius: '8px', 
              minWidth: '150px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 5px 0', color: '#1976d2' }}>Total Employees</h3>
              <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>{attendanceSummary.totalEmployees}</p>
            </div>
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#e8f5e8', 
              borderRadius: '8px', 
              minWidth: '150px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 5px 0', color: '#388e3c' }}>Total Salary</h3>
              <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>Rs. {attendanceSummary.totalSalary?.toLocaleString()}</p>
            </div>
          </div>

          {/* Employee Attendance Table */}
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Registration ID</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Present Days</th>
                <th>Absent Days</th>
                <th>Leave Days</th>
                <th>Daily Rate</th>
                <th>Calculated Salary</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9">Loading...</td>
                </tr>
              ) : filteredAttendanceSummary.length === 0 ? (
                <tr>
                  <td colSpan="9">No attendance data found for selected month/year</td>
                </tr>
              ) : (
                filteredAttendanceSummary.map((item) => (
                  <tr key={item.employeeId}>
                    <td>{item.employeeName}</td>
                    <td>{item.registrationId}</td>
                    <td>{item.department}</td>
                    <td>{item.designation}</td>
                    <td style={{ color: 'green', fontWeight: 'bold' }}>{item.presentDays}</td>
                    <td style={{ color: 'red', fontWeight: 'bold' }}>{item.absentDays}</td>
                    <td style={{ color: 'orange', fontWeight: 'bold' }}>{item.leaveDays}</td>
                    <td>Rs. {item.dailyRate?.toLocaleString()}</td>
                    <td style={{ color: 'blue', fontWeight: 'bold' }}>Rs. {item.calculatedSalary?.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Department Summary */}
          {attendanceSummary.departmentSummary.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <h3>Department Summary</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Total Employees</th>
                    <th>Total Present Days</th>
                    <th>Total Absent Days</th>
                    <th>Total Leave Days</th>
                    <th>Total Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceSummary.departmentSummary.map((dept, index) => (
                    <tr key={index}>
                      <td>{dept.department}</td>
                      <td>{dept.totalEmployees}</td>
                      <td style={{ color: 'green' }}>{dept.totalPresentDays}</td>
                      <td style={{ color: 'red' }}>{dept.totalAbsentDays}</td>
                      <td style={{ color: 'orange' }}>{dept.totalLeaveDays}</td>
                      <td style={{ color: 'blue', fontWeight: 'bold' }}>Rs. {dept.totalSalary?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Designation Summary */}
          {attendanceSummary.designationSummary.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <h3>Designation Summary</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Designation</th>
                    <th>Total Employees</th>
                    <th>Total Present Days</th>
                    <th>Total Absent Days</th>
                    <th>Total Leave Days</th>
                    <th>Total Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceSummary.designationSummary.map((desig, index) => (
                    <tr key={index}>
                      <td>{desig.designation}</td>
                      <td>{desig.totalEmployees}</td>
                      <td style={{ color: 'green' }}>{desig.totalPresentDays}</td>
                      <td style={{ color: 'red' }}>{desig.totalAbsentDays}</td>
                      <td style={{ color: 'orange' }}>{desig.totalLeaveDays}</td>
                      <td style={{ color: 'blue', fontWeight: 'bold' }}>Rs. {desig.totalSalary?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );

  
}
