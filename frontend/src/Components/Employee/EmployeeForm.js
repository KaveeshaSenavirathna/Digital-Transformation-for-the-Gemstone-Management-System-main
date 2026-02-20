import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Employee/Nav/Sidebar";
import "../Employee/Nav/Sidebar.css";
import "../Styles/DisplayProcess.css";
import "../Styles/EmployeeForm.css";

function EmployeeForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    address: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
  });

  const [files, setFiles] = useState({
    photo: null,
    birthCertificate: null,
    idCopy: null,
    cv: null,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle text input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      // Append text fields
      for (const key in form) formData.append(key, form[key]);
      // Append files
      for (const key in files) if (files[key]) formData.append(key, files[key]);

      await axios.post(
        "http://localhost:5000/api/employees/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      navigate("/employees_list"); // Redirect after successful registration
    } catch (err) {
      setError(err.response?.data?.message || "Error registering employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="display-process-container">
      <Sidebar />
      {/* The form-container is placed inside a div to respect the sidebar's layout */}
      <div> 
        <div style={{
          marginBottom: '30px',
          padding: '25px',
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #fd7e14',
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
              Employee Registration Form
            </h1>
            <p style={{
              margin: '0',
              color: '#666',
              fontSize: '1rem'
            }}>
              Register new employees and add them to the system
            </p>
          </div>
        </div>
        
        <div className="form-container">
          {error && (
            <div className="error-message">{error}</div>
          )}
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="employee-form">
            
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input 
                id="name"
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                required 
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age:</label>
              <input
                id="age"
                name="age"
                type="number"
                min="18"
                value={form.age}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address:</label>
              <input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone:</label>
              <input
                id="phone"
                name="phone"
                value={form.phone}
                pattern="\d{10}"
                title="Enter 10 digit phone number"
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department:</label>
              <select
                id="department"
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                className="form-select"
              >
                {/* Note: Added a default disabled option for better UX */}
                <option value="" disabled>Select Department</option>
                <option value="human_resoure">Human resource</option>
                <option value="prduction&process">Production & Process</option>
                <option value="quality_assurance">Quality Assurance</option>
                <option value="administration">Administration</option>
                <option value="finance">Finance</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="designation">Designation:</label>
              <select
                id="designation"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="" disabled>Select Designation</option>
                <option value="Director">Director</option>
                <option value="HR Executive">HR Executive</option>
                <option value="factory_Manager">Factory Manager</option>
                <option value="Production_Manager">Production Manager</option>
                <option value="quality_assurance_officer">
                  Quality Assurance Officer
                </option>
                <option value="accountent">Accountant</option>
                <option value="systemmanager">System Manager</option>
                <option value="Office Assistant">Office Assistant</option>
                <option value="Gem Cutter (Cut & Polish)">
                  Gem Cutter (Cut & Polish)
                </option>
                <option value="Gem_calibarater">Gem Calibrator</option>
                <option value="Gem_preform">Gem Preform</option>
                <option value="dopper">Dopper</option>
                <option value="Cleaning_Officer">Cleaning Officer</option>
                <option value="Trainer">Trainer</option>
              </select>
            </div>
            
            {/* --- File Uploads Section --- */}
            <h3 className="file-section-title">Required Documents</h3>

            <div className="form-group file-group">
              <label htmlFor="photo">Employee Photo:</label>
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
            </div>

            <div className="form-group file-group">
              <label htmlFor="birthCertificate">Birth Certificate:</label>
              <input
                id="birthCertificate"
                name="birthCertificate"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="file-input"
              />
            </div>

            <div className="form-group file-group">
              <label htmlFor="idCopy">ID Copy:</label>
              <input
                id="idCopy"
                name="idCopy"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="file-input"
              />
            </div>

            <div className="form-group file-group">
              <label htmlFor="cv">CV:</label>
              <input
                id="cv"
                name="cv"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="file-input"
              />
            </div>
            
            <div className="button-group">
              <button 
                type="submit" 
                disabled={loading} 
                style={{
                  padding: '12px 30px',
                  backgroundColor: loading ? '#6c757d' : '#28a745',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(40, 167, 69, 0.3)',
                  minWidth: '180px'
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = '#218838';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = '#28a745';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 4px rgba(40, 167, 69, 0.3)';
                  }
                }}
              >
                {loading ? "Registering..." : "Register Employee"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EmployeeForm;