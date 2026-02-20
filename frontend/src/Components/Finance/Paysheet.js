import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Finance/Nav/Sidebar";
import "../Styles/DisplayProcess.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SUMMARY_URL = "http://localhost:5000/employees/monthlysummary"
const ATTENDANCE_URL = "http://localhost:5000/employees/attendancesummary"

export default function Paysheet() {
  const [paysheetData, setPaysheetData] = useState([]);
  const [filteredPaysheetData, setFilteredPaysheetData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1); // current month
  const [year, setYear] = useState(new Date().getFullYear());
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterDesignation, setFilterDesignation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Apply filters whenever filter values or paysheet data changes
  useEffect(() => {
    let filtered = paysheetData;
    
    if (filterDepartment) {
      filtered = filtered.filter(emp => 
        emp.department.toLowerCase().includes(filterDepartment.toLowerCase())
      );
    }
    
    if (filterDesignation) {
      filtered = filtered.filter(emp => 
        emp.designation.toLowerCase().includes(filterDesignation.toLowerCase())
      );
    }
    
    setFilteredPaysheetData(filtered);
  }, [paysheetData, filterDepartment, filterDesignation]);

  const generatePaysheet = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Generating paysheet for month: ${month}, year: ${year}`);
      
      // Fetch both production and attendance data
      const [productionRes, attendanceRes] = await Promise.all([
        axios.get(`${SUMMARY_URL}?month=${month}&year=${year}`),
        axios.get(`${ATTENDANCE_URL}?month=${month}&year=${year}`)
      ]);

      const productionData = productionRes.data.summary || [];
      const attendanceData = attendanceRes.data.employeeSummary || [];

      // Combine data to create paysheet
      const paysheet = [];
      
      // Process attendance-based employees
      attendanceData.forEach(attendance => {
        const productionRecords = productionData.filter(p => p.employee_name === attendance.employeeName);
        const totalProductionSalary = productionRecords.reduce((sum, p) => sum + (p.productionSalary || 0), 0);
        
        paysheet.push({
          employeeId: attendance.employeeId,
          employeeName: attendance.employeeName,
          registrationId: attendance.registrationId,
          department: attendance.department,
          designation: attendance.designation,
          presentDays: attendance.presentDays,
          absentDays: attendance.absentDays,
          leaveDays: attendance.leaveDays,
          dailyRate: attendance.dailyRate,
          attendanceSalary: attendance.calculatedSalary,
          productionSalary: totalProductionSalary,
          totalSalary: attendance.calculatedSalary + totalProductionSalary,
          productionRecords: productionRecords
        });
      });

      // Process production-only employees (if any)
      const attendanceEmployeeNames = attendanceData.map(a => a.employeeName);
      const productionOnlyEmployees = productionData.filter(p => !attendanceEmployeeNames.includes(p.employee_name));
      
      productionOnlyEmployees.forEach(production => {
        paysheet.push({
          employeeId: production._id,
          employeeName: production.employee_name,
          registrationId: 'N/A',
          department: 'Production',
          designation: 'Production Worker',
          presentDays: 0,
          absentDays: 0,
          leaveDays: 0,
          dailyRate: 0,
          attendanceSalary: 0,
          productionSalary: production.productionSalary || 0,
          totalSalary: production.productionSalary || 0,
          productionRecords: [production]
        });
      });

      setPaysheetData(paysheet);
      setFilteredPaysheetData(paysheet);
      console.log('Paysheet generated:', paysheet);
    } catch (err) {
      console.error('Error generating paysheet:', err);
      setError('Failed to generate paysheet. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPaysheetPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Monthly Paysheet', 14, 22);
    doc.setFontSize(12);
    doc.text(`Month: ${month}/${year}`, 14, 32);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 38);
    
    // Table data
    const tableData = filteredPaysheetData.map(emp => [
      emp.employeeName,
      emp.registrationId,
      emp.department,
      emp.designation,
      emp.presentDays,
      emp.absentDays,
      emp.leaveDays,
      `Rs. ${emp.dailyRate}`,
      `Rs. ${emp.attendanceSalary}`,
      `Rs. ${emp.productionSalary}`,
      `Rs. ${emp.totalSalary}`
    ]);
    
    // Table
    autoTable(doc, {
      head: [['Employee', 'ID', 'Department', 'Designation', 'Present Days', 'Absent Days', 'Leave Days', 'Daily Rate', 'Attendance Salary', 'Production Salary', 'Total Salary']],
      body: tableData,
      startY: 45,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
    
    // Summary
    const totalSalary = filteredPaysheetData.reduce((sum, emp) => sum + emp.totalSalary, 0);
    const totalEmployees = filteredPaysheetData.length;
    
    doc.setFontSize(12);
    doc.text(`Total Employees: ${totalEmployees}`, 14, doc.lastAutoTable.finalY + 20);
    doc.text(`Total Salary: Rs. ${totalSalary.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 30);
    
    doc.save(`paysheet_${month}_${year}.pdf`);
  };

  const downloadPaysheetExcel = () => {
    // Create CSV content
    const headers = ['Employee Name', 'Registration ID', 'Department', 'Designation', 'Present Days', 'Absent Days', 'Leave Days', 'Daily Rate', 'Attendance Salary', 'Production Salary', 'Total Salary'];
    const csvContent = [
      headers.join(','),
      ...filteredPaysheetData.map(emp => [
        emp.employeeName,
        emp.registrationId,
        emp.department,
        emp.designation,
        emp.presentDays,
        emp.absentDays,
        emp.leaveDays,
        emp.dailyRate,
        emp.attendanceSalary,
        emp.productionSalary,
        emp.totalSalary
      ].join(','))
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `paysheet_${month}_${year}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadIndividualPaysheet = (employee) => {
    const doc = new jsPDF();
    
    // Company Header
    doc.setFontSize(24);
    doc.text('GEMSTONE MANAGEMENT SYSTEM', 14, 22);
    doc.setFontSize(16);
    doc.text('Monthly Paysheet', 14, 32);
    
    // Employee Details Section
    doc.setFontSize(12);
    doc.text(`Employee Name: ${employee.employeeName}`, 14, 45);
    doc.text(`Registration ID: ${employee.registrationId}`, 14, 52);
    doc.text(`Department: ${employee.department}`, 14, 59);
    doc.text(`Designation: ${employee.designation}`, 14, 66);
    doc.text(`Period: ${month}/${year}`, 14, 73);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 80);
    
    // Attendance Details
    doc.setFontSize(14);
    doc.text('Attendance Details', 14, 95);
    doc.setFontSize(10);
    
    const attendanceData = [
      ['Present Days', employee.presentDays],
      ['Absent Days', employee.absentDays],
      ['Leave Days', employee.leaveDays],
      ['Daily Rate', `Rs. ${employee.dailyRate?.toLocaleString()}`],
      ['Attendance Salary', `Rs. ${employee.attendanceSalary?.toLocaleString()}`]
    ];
    
    autoTable(doc, {
      head: [['Item', 'Value']],
      body: attendanceData,
      startY: 100,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
      columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 40 } }
    });
    
    // Production Details (if any)
    if (employee.productionRecords && employee.productionRecords.length > 0) {
      doc.setFontSize(14);
      doc.text('Production Details', 14, doc.lastAutoTable.finalY + 20);
      doc.setFontSize(10);
      
      const productionData = employee.productionRecords.map(record => [
        record.stage,
        record.stone_code || '-',
        record.type || '-',
        record.total_pcs,
        record.total_cts,
        `Rs. ${record.salaryRate || 0}`,
        `Rs. ${record.productionSalary || 0}`
      ]);
      
      autoTable(doc, {
        head: [['Stage', 'Stone Code', 'Type', 'PCS', 'CTS', 'Rate/PCS', 'Salary']],
        body: productionData,
        startY: doc.lastAutoTable.finalY + 25,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });
    }
    
    // Salary Summary
    doc.setFontSize(14);
    doc.text('Salary Summary', 14, doc.lastAutoTable.finalY + 20);
    doc.setFontSize(10);
    
    const salaryData = [
      ['Attendance Salary', `Rs. ${employee.attendanceSalary?.toLocaleString()}`],
      ['Production Salary', `Rs. ${employee.productionSalary?.toLocaleString()}`],
      ['Total Salary', `Rs. ${employee.totalSalary?.toLocaleString()}`]
    ];
    
    autoTable(doc, {
      head: [['Component', 'Amount']],
      body: salaryData,
      startY: doc.lastAutoTable.finalY + 25,
      styles: { fontSize: 12 },
      headStyles: { fillColor: [41, 128, 185] },
      columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 40 } },
      bodyStyles: { 
        2: { 
          fillColor: [220, 248, 198], 
          fontStyle: 'bold',
          fontSize: 14
        }
      }
    });
    
    // Footer
    doc.setFontSize(8);
    doc.text('This is a computer generated paysheet.', 14, doc.lastAutoTable.finalY + 30);
    doc.text('For any queries, please contact HR Department.', 14, doc.lastAutoTable.finalY + 37);
    
    // Save with employee name
    const fileName = `${employee.employeeName.replace(/\s+/g, '_')}_paysheet_${month}_${year}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="display-process-container">
      <Sidebar />
      <h1>Paysheet Generation</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px', padding: '10px', backgroundColor: '#ffe6e6', border: '1px solid red', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {/* Paysheet Generation Section */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Generate Paysheet</h3>
        <p>Generate paysheet for all employees combining attendance and production data for {month}/{year}</p>
        
        {/* Month/Year Selection */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center' }}>
          <div>
            <label>Month:</label>
            <select value={month} onChange={(e) => setMonth(e.target.value)} style={{ marginLeft: '5px', padding: '5px' }}>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Year:</label>
            <select value={year} onChange={(e) => setYear(e.target.value)} style={{ marginLeft: '5px', padding: '5px' }}>
              {[...Array(10)].map((_, i) => {
                const yearOption = new Date().getFullYear() - 5 + i;
                return (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={generatePaysheet}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Generating...' : 'Generate Paysheet'}
          </button>
          
          {paysheetData.length > 0 && (
            <>
              <button
                onClick={downloadPaysheetPDF}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Download All PDF
              </button>
              <button
                onClick={downloadPaysheetExcel}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Download Excel (CSV)
              </button>
              <button
                onClick={() => {
                  filteredPaysheetData.forEach((emp, index) => {
                    setTimeout(() => downloadIndividualPaysheet(emp), index * 1000);
                  });
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6f42c1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                title="Downloads individual paysheets for all employees (with 1-second delay between downloads)"
              >
                Download All Individual PDFs
              </button>
            </>
          )}
        </div>

        {/* Paysheet Summary Cards */}
        {filteredPaysheetData.length > 0 && (
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#e3f2fd', 
              borderRadius: '8px', 
              minWidth: '150px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 5px 0', color: '#1976d2' }}>Total Employees</h3>
              <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>{filteredPaysheetData.length}</p>
            </div>
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#e8f5e8', 
              borderRadius: '8px', 
              minWidth: '150px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 5px 0', color: '#388e3c' }}>Total Salary</h3>
              <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
                Rs. {filteredPaysheetData.reduce((sum, emp) => sum + emp.totalSalary, 0).toLocaleString()}
              </p>
            </div>
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#fff3e0', 
              borderRadius: '8px', 
              minWidth: '150px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 5px 0', color: '#f57c00' }}>Avg Salary</h3>
              <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
                Rs. {Math.round(filteredPaysheetData.reduce((sum, emp) => sum + emp.totalSalary, 0) / filteredPaysheetData.length).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filter Section */}
      {paysheetData.length > 0 && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 15px 0' }}>Filter Paysheet Data</h4>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label>Department:</label>
              <select 
                value={filterDepartment} 
                onChange={(e) => setFilterDepartment(e.target.value)}
                style={{ marginLeft: '5px', padding: '5px', minWidth: '150px' }}
              >
                <option value="">All Departments</option>
                {[...new Set(paysheetData.map(emp => emp.department))].map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Designation:</label>
              <select 
                value={filterDesignation} 
                onChange={(e) => setFilterDesignation(e.target.value)}
                style={{ marginLeft: '5px', padding: '5px', minWidth: '150px' }}
              >
                <option value="">All Designations</option>
                {[...new Set(paysheetData.map(emp => emp.designation))].map(desig => (
                  <option key={desig} value={desig}>{desig}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                setFilterDepartment("");
                setFilterDesignation("");
              }}
              style={{
                padding: '5px 15px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
          </div>
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            Showing {filteredPaysheetData.length} of {paysheetData.length} employees
          </div>
        </div>
      )}

      {/* Paysheet Table */}
      {filteredPaysheetData.length > 0 && (
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
              <th>Attendance Salary</th>
              <th>Production Salary</th>
              <th>Total Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPaysheetData.map((emp, index) => (
              <tr key={index}>
                <td>{emp.employeeName}</td>
                <td>{emp.registrationId}</td>
                <td>{emp.department}</td>
                <td>{emp.designation}</td>
                <td style={{ color: 'green', fontWeight: 'bold' }}>{emp.presentDays}</td>
                <td style={{ color: 'red', fontWeight: 'bold' }}>{emp.absentDays}</td>
                <td style={{ color: 'orange', fontWeight: 'bold' }}>{emp.leaveDays}</td>
                <td>Rs. {emp.dailyRate?.toLocaleString()}</td>
                <td style={{ color: 'blue' }}>Rs. {emp.attendanceSalary?.toLocaleString()}</td>
                <td style={{ color: 'purple' }}>Rs. {emp.productionSalary?.toLocaleString()}</td>
                <td style={{ color: 'green', fontWeight: 'bold', fontSize: '16px' }}>
                  Rs. {emp.totalSalary?.toLocaleString()}
                </td>
                <td>
                  <button
                    onClick={() => downloadIndividualPaysheet(emp)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                    title="Download Individual Paysheet"
                  >
                    📄 Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
