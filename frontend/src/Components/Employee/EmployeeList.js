import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Employee/Nav/Sidebar";
import "../Employee/Nav/Sidebar.css";
import "../Styles/DisplayProcess.css";
// --- NEW CSS IMPORT ---
import "../Styles/EmployeeList.css"; 

function EmployeeList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Unused in this file, but kept for context

  // Fetch employees with search/filters
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append("name", search);
      if (departmentFilter) query.append("department", departmentFilter);
      if (designationFilter) query.append("designation", designationFilter);

      const res = await axios.get(`http://localhost:5000/api/employees?${query.toString()}`);
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, departmentFilter, designationFilter]);

  // Delete employee
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="display-process-container">
      <Sidebar />
      <div className="loading-text">Loading Employee Data...</div>
    </div>
  );

  return (
    <div className="display-process-container">
      <Sidebar />
      <div>
        <div style={{
          marginBottom: '30px',
          padding: '25px',
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #6f42c1',
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
              Registered Employee List ({employees.length})
            </h1>
            <p style={{
              margin: '0',
              color: '#666',
              fontSize: '1rem'
            }}>
              View and manage all registered employees in the system
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="filter-input"
          />

          <select 
            value={departmentFilter} 
            onChange={(e) => setDepartmentFilter(e.target.value)} 
            className="filter-select"
          >
            <option value="">All Departments</option>
            <option value="cutting">Cutting</option>
            <option value="polishing">Polishing</option>
            <option value="grading">Grading</option>
            <option value="logistics">Logistics</option>
            <option value="administration">Administration</option>
          </select>

          <select 
            value={designationFilter} 
            onChange={(e) => setDesignationFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Designations</option>
            <option value="Gem Cutter (Cut & Polish)">Gem Cutter (Cut & Polish)</option>
            <option value="Gem Cutter (Dopping)">Gem Cutter (Dopping)</option>
            <option value="Director">Director</option>
            <option value="HR Executive">HR Executive</option>
            <option value="Production Manager">Production Manager</option>
            <option value="Office Assistant">Office Assistant</option>
            <option value="Cleaning Officer">Cleaning Officer</option>
            <option value="Heat Treatment">Heat Treatment</option>
            <option value="Trainer">Trainer</option>
          </select>
          
          <button 
            onClick={() => navigate('/new_emp')} 
            style={{
              padding: '10px 20px',
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
            + Register New Employee
          </button>
        </div>

        {/* Employee Table */}
        <div className="table-responsive">
          <table className="employee-table">
            <thead>
              <tr>
                <th className="th-photo">Photo</th>
                <th className="th-name">Name</th>
                <th>Reg ID</th>
                <th>Age</th>
                <th>Address</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Birth Cert.</th>
                <th>ID Copy</th>
                <th>CV</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      {emp.photo ? (
                        <img 
                          src={`http://localhost:5000/uploads/${emp.photo}`} 
                          alt="Employee Photo" 
                          className="employee-photo"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="emp-name-cell">{emp.name}</td>
                    <td>{emp.registrationId}</td>
                    <td>{emp.age}</td>
                    <td>{emp.address}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>{emp.department}</td>
                    <td>{emp.designation}</td>
                    <td>
                      {emp.birthCertificate ? (
                        <a href={`http://localhost:5000/uploads/${emp.birthCertificate}`} target="_blank" rel="noopener noreferrer" className="doc-link">View</a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {emp.idCopy ? (
                        <a href={`http://localhost:5000/uploads/${emp.idCopy}`} target="_blank" rel="noopener noreferrer" className="doc-link">View</a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {emp.cv ? (
                        <a href={`http://localhost:5000/uploads/${emp.cv}`} target="_blank" rel="noopener noreferrer" className="doc-link">View</a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="actions-cell">
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                      }}>
                        <button 
                          onClick={() => navigate(`/employees/update/${emp._id}`)} 
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 4px rgba(0, 123, 255, 0.3)'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#0056b3';
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 4px 8px rgba(0, 123, 255, 0.4)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#007bff';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 4px rgba(0, 123, 255, 0.3)';
                          }}
                          title="Edit Employee Details"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => navigate(`/employees/print/${emp._id}`)} 
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            backgroundColor: '#17a2b8',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 4px rgba(23, 162, 184, 0.3)'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#138496';
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 4px 8px rgba(23, 162, 184, 0.4)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#17a2b8';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 4px rgba(23, 162, 184, 0.3)';
                          }}
                          title="Print ID Card"
                        >
                          Print ID
                        </button>
                        <button 
                          onClick={() => handleDelete(emp._id)} 
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
                          title="Delete Employee"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13" className="no-data-row">No employees found matching the current criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EmployeeList;