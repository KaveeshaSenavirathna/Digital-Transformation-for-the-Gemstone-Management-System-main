import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Employee/Nav/Sidebar"; // Import Sidebar
import "../Employee/Nav/Sidebar.css"; // Sidebar CSS
import "../Styles/EmployeeUpdate.css"; // Reuse styling from the Employee Form

function EmployeeUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- Sidebar State Management (Assuming collapse functionality) ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);
  // -----------------------------------------------------------------

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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FIX: Fetch only the specific employee by ID ---
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/employees/${id}`) // Use the specific ID endpoint
      .then((res) => {
        // Only set form fields that exist in the form state
        const employeeData = res.data;
        setForm({
          name: employeeData.name || "",
          age: employeeData.age || "",
          address: employeeData.address || "",
          email: employeeData.email || "",
          phone: employeeData.phone || "",
          department: employeeData.department || "",
          designation: employeeData.designation || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load employee data.");
        setLoading(false);
      });
  }, [id]);
  // ----------------------------------------------------

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
    
  // Note: Only new file selections are handled here. 
  // The server handles ignoring fields if a new file isn't uploaded.
  const handleFileChange = (e) =>
    setFiles({ ...files, [e.target.name]: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      Object.keys(files).forEach((key) => {
        if (files[key]) formData.append(key, files[key]);
      });

      await axios.put(`http://localhost:5000/api/employees/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/employees_list");
    } catch (err) {
      setError(err.response?.data?.message || "Error updating employee.");
      setLoading(false);
    }
  };

  const mainContentClass = `content-area ${isSidebarOpen ? '' : 'main-content--full'}`;

  if (loading) return (
    <div className="page-layout">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={mainContentClass}>
            <div className="loading-text">Loading Employee Data...</div>
        </div>
    </div>
  );

  return (
    <div className="page-layout">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        {/* Hamburger Icon if sidebar is closed */}
        {!isSidebarOpen && (
            <button className="sidebar-toggle-icon" onClick={toggleSidebar}>
                &#9776;
            </button>
        )}

        <div className={mainContentClass}>
            <div className="form-container">
                <h2 className="form-title">Update Employee: {form.name}</h2>
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit} className="employee-form" encType="multipart/form-data">
                    
                    {/* --- Text Input Fields (Reuse EmployeeForm structure) --- */}
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input name="name" id="name" value={form.name} onChange={handleChange} required className="form-input" />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="age">Age:</label>
                        <input name="age" id="age" type="number" value={form.age} onChange={handleChange} required className="form-input" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address:</label>
                        <input name="address" id="address" value={form.address} onChange={handleChange} required className="form-input" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input name="email" id="email" type="email" value={form.email} onChange={handleChange} required className="form-input" />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="phone">Phone:</label>
                        <input name="phone" id="phone" value={form.phone} onChange={handleChange} required className="form-input" />
                    </div>

                    {/* Department Select */}
                    <div className="form-group">
                        <label htmlFor="department">Department:</label>
                        <select name="department" id="department" value={form.department} onChange={handleChange} required className="form-select">
                            <option value="">Select Department</option>
                            <option value="cutting">Cutting</option>
                            <option value="polishing">Polishing</option>
                            <option value="grading">Grading</option>
                            <option value="logistics">Logistics</option>
                            <option value="administration">Administration</option>
                        </select>
                    </div>

                    {/* Designation Select */}
                    <div className="form-group">
                        <label htmlFor="designation">Designation:</label>
                        <select name="designation" id="designation" value={form.designation} onChange={handleChange} required className="form-select">
                            <option value="">Select Designation</option>
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
                    </div>

                    <h3 className="file-section-title">Upload New Documents (Leave blank to keep existing)</h3>

                    {/* File Inputs */}
                    <div className="form-group file-group">
                        <label htmlFor="photo">Employee Photo:</label>
                        <input name="photo" id="photo" type="file" onChange={handleFileChange} accept="image/*" className="file-input" />
                    </div>
                    <div className="form-group file-group">
                        <label htmlFor="birthCertificate">Birth Certificate:</label>
                        <input name="birthCertificate" id="birthCertificate" type="file" onChange={handleFileChange} accept="image/*,.pdf" className="file-input" />
                    </div>
                    <div className="form-group file-group">
                        <label htmlFor="idCopy">ID Copy:</label>
                        <input name="idCopy" id="idCopy" type="file" onChange={handleFileChange} accept="image/*,.pdf" className="file-input" />
                    </div>
                    <div className="form-group file-group">
                        <label htmlFor="cv">CV:</label>
                        <input name="cv" id="cv" type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="file-input" />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="button-group">
                       {/* Submit Button */}
                        <button type="submit" disabled={loading} className="submit-button update-btn">
                            {loading ? "Updating..." : "Update Employee"}
                        </button>
                        {/* Back Button */}
                        <button 
                            type="button" 
                            onClick={() => navigate('/employees_list')} 
                            className="back-button"
                        >
                            Go Back
                        </button>

                       
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}

export default EmployeeUpdate;