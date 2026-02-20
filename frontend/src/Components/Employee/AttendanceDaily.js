import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import Sidebar from "../Employee/Nav/Sidebar";
import "../Employee/Nav/Sidebar.css";
import "../Styles/DisplayProcess.css";
import "../Styles/AttendancePage.css"; 

function AttendancePage() {
    // --- Sidebar State Management ---
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prev => !prev);
    }, []);
    // ----------------------------------

    const [daily, setDaily] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [status, setStatus] = useState("Present");
    const [leaveTime, setLeaveTime] = useState({ start: "", end: "", reason: "" });
    const [error, setError] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterDepartment, setFilterDepartment] = useState("All");
    const [filterDesignation, setFilterDesignation] = useState("All");

    // Fetch attendance list
    const fetchDaily = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:5000/api/attendance/daily");
            setDaily(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch employees and attendance on mount
    useEffect(() => {
        fetchDaily();
        const fetchEmployees = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/employees");
                setEmployees(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchEmployees();
    }, []);

    // Handle delete
    const handleDelete = async (id) => {
        if (!window.confirm("Delete attendance record?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/attendance/${id}`);
            fetchDaily();
        } catch (err) {
            console.error(err);
            alert("Failed to delete attendance");
        }
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEmployee) return setError("Please select an employee.");

        try {
            await axios.post("http://localhost:5000/api/attendance", {
                employeeId: selectedEmployee,
                status,
                leaveStartTime: status === "Leave" ? leaveTime.start : undefined,
                leaveEndTime: status === "Leave" ? leaveTime.end : undefined,
                leaveReason: status === "Leave" ? leaveTime.reason : undefined,
            });
            setError("");
            setLeaveTime({ start: "", end: "", reason: "" });
            setSelectedEmployee("");
            setStatus("Present");
            fetchDaily();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to mark attendance.");
        }
    };

    // Filter employees for dropdown
    const filteredEmployees = employees.filter((emp) =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.registrationId.toLowerCase().includes(search.toLowerCase())
    );

    // Filter attendance table
    const filteredAttendance = daily.filter((att) => {
        const name = att.employeeId?.name || "";
        const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === "All" || att.status === filterStatus;
        const empDepartment = att.employeeId?.department || att.department || "";
        const matchesDept = filterDepartment === "All" || empDepartment === filterDepartment;
        const empDesignation = att.employeeId?.designation || att.designation || "";
        const matchesDesig = filterDesignation === "All" || empDesignation === filterDesignation;
        return matchesSearch && matchesStatus && matchesDept && matchesDesig;
    });

    // Get unique departments and designations for filter dropdowns
    const departments = ["All", ...new Set(employees.map(emp => emp.department).filter(Boolean))];
    const designations = ["All", ...new Set(employees.map(emp => emp.designation).filter(Boolean))];

    const mainContentClass = `main-content ${isSidebarOpen ? '' : 'main-content--full'}`;

    if (loading) return (
        <div className="display-process-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div>
                <p className="loading-text">Loading Attendance Data...</p>
            </div>
        </div>
    );

    return (
        <div className="display-process-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Hamburger Icon if sidebar is closed */}
            {!isSidebarOpen && (
                <button className="sidebar-toggle-icon" onClick={toggleSidebar}>
                    &#9776;
                </button>
            )}

            <div>
                <div style={{
                    marginBottom: '30px',
                    padding: '25px',
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #007bff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h1 style={{
                            margin: '0 0 10px 0',
                            color: '#495057',
                            fontSize: '2rem',
                            fontWeight: '600'
                        }}>
                            Daily Attendance Tracker
                        </h1>
                        <p style={{
                            margin: '0',
                            color: '#666',
                            fontSize: '1rem'
                        }}>
                            Mark daily attendance and manage employee attendance records
                        </p>
                    </div>
                    <Link to="/attendancesummery">
                        <button 
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#007bff',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '500',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(0,123,255,0.3)'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#0056b3';
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 4px 8px rgba(0,123,255,0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#007bff';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 4px rgba(0,123,255,0.3)';
                            }}
                        >
                            View Attendance Summary →
                        </button>
                    </Link>
                </div>
                
                {/* Attendance Form */}
                <div className="attendance-form-container">
                    {error && <p className="form-error">{error}</p>}
                    <form onSubmit={handleSubmit} className="attendance-form">
                        <select
                            value={selectedEmployee}
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                            required
                        >
                            <option value="">Select Employee</option>
                            {filteredEmployees.map((emp) => (
                                <option key={emp._id} value={emp._id}>
                                    {emp.name} ({emp.registrationId})
                                </option>
                            ))}
                        </select>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="Leave">Leave</option>
                        </select>

                        {status === "Leave" && (
                            <>
                                <input
                                    type="time"
                                    value={leaveTime.start}
                                    onChange={(e) => setLeaveTime({ ...leaveTime, start: e.target.value })}
                                    placeholder="Leave Start"
                                    required
                                />
                                <input
                                    type="time"
                                    value={leaveTime.end}
                                    onChange={(e) => setLeaveTime({ ...leaveTime, end: e.target.value })}
                                    placeholder="Leave End"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Reason for Leave"
                                    value={leaveTime.reason}
                                    onChange={(e) => setLeaveTime({ ...leaveTime, reason: e.target.value })}
                                    required
                                />
                            </>
                        )}

                        <button 
                            type="submit" 
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#28a745',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 4px rgba(40, 167, 69, 0.3)'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#218838';
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.4)';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#28a745';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 4px rgba(40, 167, 69, 0.3)';
                            }}
                        >
                            Mark Attendance
                        </button>
                    </form>
                </div>

                {/* Filters */}
                <div className="filter-bar">
                    <input
                        placeholder="Search by Name/ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <label>Status:</label>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="All">All Statuses</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Leave">Leave</option>
                    </select>
                    <label>Department:</label>
                    <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
                        {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                    </select>
                    <label>Designation:</label>
                    <select value={filterDesignation} onChange={(e) => setFilterDesignation(e.target.value)}>
                        {designations.map(des => <option key={des} value={des}>{des}</option>)}
                    </select>
                </div>

                {/* Attendance Table */}
                <div className="table-responsive">
                    <table className="attendance-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Reg ID</th>
                                <th>Department</th>
                                <th>Designation</th>
                                <th>Status</th>
                                <th>Time In</th>
                                <th>Leave Start</th>
                                <th>Leave End</th>
                                <th>Reason</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAttendance.map((att) => (
                                <tr key={att._id}>
                                    <td>{att.employeeId?.name || "-"}</td>
                                    <td>{att.employeeId?.registrationId || "-"}</td>
                                    <td>{att.employeeId?.department || att.department || "-"}</td>
                                    <td>{att.employeeId?.designation || att.designation || "-"}</td>
                                    <td className={`status-${att.status?.toLowerCase()}`}>
                                        {att.status}
                                    </td>
                                    <td>{att.timeIn || "-"}</td>
                                    <td>{att.leaveStartTime || "-"}</td>
                                    <td>{att.leaveEndTime || "-"}</td>
                                    <td>{att.leaveReason || "-"}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleDelete(att._id)} 
                                            style={{
                                                padding: '6px 12px',
                                                fontSize: '0.8rem',
                                                fontWeight: '600',
                                                backgroundColor: '#dc3545',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                boxShadow: '0 2px 4px rgba(220, 53, 69, 0.3)'
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.backgroundColor = '#c82333';
                                                e.target.style.transform = 'translateY(-1px)';
                                                e.target.style.boxShadow = '0 4px 8px rgba(220, 53, 69, 0.4)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.backgroundColor = '#dc3545';
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = '0 2px 4px rgba(220, 53, 69, 0.3)';
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AttendancePage;