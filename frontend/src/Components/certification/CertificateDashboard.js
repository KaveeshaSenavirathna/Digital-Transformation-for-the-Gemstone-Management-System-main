import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaDownload, FaArrowLeft, FaMoon, FaSun, FaQrcode } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import "../Styles/CertificateDashboard.css";
import dashboardLogger from "../utils/dashboardLogger";

const CERT_URL = "http://localhost:5000/certificates";

function CertificateDashboard() {
  const [certs, setCerts] = useState([]);
  const [form, setForm] = useState({
    certificate_type: "",
    certificate_number: "",
    lab_name: "",
    issue_date: "",
    origin: "",
    variety: "",
    file: null,
  });
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterOrigin, setFilterOrigin] = useState("");
  const [filterVariety, setFilterVariety] = useState("");
  const [filterLab, setFilterLab] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    // Log dashboard access
    dashboardLogger.logDashboardAccess("Certificate Dashboard");
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    try {
      const res = await axios.get(CERT_URL);
      setCerts(res.data);
    } catch (err) {
      console.error("Error fetching certificates:", err);
      const errorMessage = err.response?.data?.error || err.message || "Failed to fetch certificates";
      alert(`Error: ${errorMessage}`);
    }
  };

  // ✅ Frontend validation
  const validateForm = () => {
    const errors = {};

    if (!form.certificate_type) errors.certificate_type = true;
    if (!form.certificate_number) errors.certificate_number = true;
    if (!form.lab_name) errors.lab_name = true;
    if (!form.issue_date) errors.issue_date = true;
    if (!form.origin) errors.origin = true;
    if (!form.variety) errors.variety = true;
    if (!form.file && !editingId) errors.file = true; // file required only on new certificate

    const today = new Date();
    const selectedDate = new Date(form.issue_date);
    if (!editingId && selectedDate < new Date(today.toDateString())) {
      errors.issue_date = true;
    }

    if (Object.keys(errors).length > 0) {
      // Highlight invalid fields
      Object.keys(errors).forEach((key) => {
        const el = document.querySelector(`[name="${key}"]`);
        if (el) el.classList.add("input-error");
      });
      return false;
    }

    // Remove previous error highlights
    const allInputs = document.querySelectorAll(".form-column input, .form-column select");
    allInputs.forEach((el) => el.classList.remove("input-error"));

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started");
    
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    console.log("Form data:", form);
    const fd = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null && form[key] !== "") {
        fd.append(key, form[key]);
        console.log(`Added to FormData: ${key} = ${form[key]}`);
      }
    });

    try {
      if (editingId) {
        await axios.put(`${CERT_URL}/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setEditingId(null);
      } else {
        await axios.post(CERT_URL, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setForm({
        certificate_type: "",
        certificate_number: "",
        lab_name: "",
        issue_date: "",
        origin: "",
        variety: "",
        file: null,
      });

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";

      await fetchCerts();
      setActiveSection("dashboard");
      alert(editingId ? "Certificate updated successfully!" : "Certificate added successfully!");
    } catch (err) {
      console.error("Error submitting form:", err);
      const errorMessage = err.response?.data?.error || err.message || "Unknown error occurred";
      alert(`Error submitting form: ${errorMessage}`);
    }
  };

  const handleEdit = (c) => {
    setEditingId(c._id);
    setForm({
      certificate_type: c.certificate_type,
      certificate_number: c.certificate_number,
      lab_name: c.lab_name,
      issue_date: c.issue_date?.substring(0, 10),
      origin: c.origin || "",
      variety: c.variety || "",
      file: null,
    });
    setActiveSection("add");
  };

  const resetForm = () => {
    setForm({
      certificate_type: "",
      certificate_number: "",
      lab_name: "",
      issue_date: "",
      origin: "",
      variety: "",
      file: null,
    });
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
    setActiveSection("dashboard");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete certificate?")) {
      try {
        await axios.delete(`${CERT_URL}/${id}`);
        await fetchCerts();
      } catch (err) {
        console.error("Error deleting certificate:", err);
        alert("Error deleting certificate.");
      }
    }
  };

  const showQRCode = (cert) => {
    setSelectedCert(cert);
    setShowQRModal(true);
  };

  const closeQRModal = () => {
    setShowQRModal(false);
    setSelectedCert(null);
  };

  const downloadQRCode = () => {
    if (selectedCert && selectedCert.qr_code) {
      const link = document.createElement('a');
      link.href = selectedCert.qr_code;
      link.download = `certificate-${selectedCert.certificate_number}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadZip = async (id, certNumber) => {
    try {
      const response = await axios.get(`${CERT_URL}/download-full/${id}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Certificate_${certNumber || id}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading ZIP:", err);
      alert("Failed to download certificate ZIP.");
    }
  };

  const filtered = certs.filter((c) => {
    const matchesSearch = Object.values(c)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesOrigin = filterOrigin ? c.origin === filterOrigin : true;
    const matchesVariety = filterVariety ? c.variety === filterVariety : true;
    const matchesLab = filterLab ? c.lab_name === filterLab : true;
    return matchesSearch && matchesOrigin && matchesVariety && matchesLab;
  });

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className={`cert-dashboard-container ${darkMode ? "cert-dark" : ""}`}>
      <nav className="sidebar">
        <div className="sidebar-profile">
          <div className="profile-avatar">C</div>
          <div className="profile-info">
            <div className="profile-name">Certificate</div>
          </div>
        </div>
        <ul className="nav-links">
          <li>
            <button
              className="nav-item"
              onClick={() => setActiveSection("dashboard")}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              className="nav-item"
              onClick={() => setActiveSection("add")}
            >
              Add Certificate
            </button>
          </li>
        </ul>
        <button className="nav-item back-btn" onClick={() => window.history.back()}>
          <FaArrowLeft /> Back
        </button>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Certificate Management</h1>
          <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {activeSection === "dashboard" && (
          <>
            <div className="filter-section">
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                value={filterOrigin}
                onChange={(e) => setFilterOrigin(e.target.value)}
              >
                <option value="">All Origins</option>
                {[...new Set(certs.map((c) => c.origin).filter(Boolean))].map(
                  (o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  )
                )}
              </select>
              <select
                value={filterVariety}
                onChange={(e) => setFilterVariety(e.target.value)}
              >
                <option value="">All Varieties</option>
                {[...new Set(certs.map((c) => c.variety).filter(Boolean))].map(
                  (v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  )
                )}
              </select>
              <select
                value={filterLab}
                onChange={(e) => setFilterLab(e.target.value)}
              >
                <option value="">All Labs</option>
                {[...new Set(certs.map((c) => c.lab_name).filter(Boolean))].map(
                  (l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  )
                )}
              </select>
            </div>

            <p className="cert-count">
              Total Certificates: {certs.length} | Filtered Results: {filtered.length}
            </p>

            <table className="cert-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Number</th>
                  <th>Lab Name</th>
                  <th>Issue Date</th>
                  <th>Origin</th>
                  <th>Variety</th>
                  <th>Actions</th>
                </tr>
              </thead>
              
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7}>No certificates found.</td>
                  </tr>
                ) : (
                  filtered.map((c, i) => (
                    <tr key={c._id} className={i % 2 === 0 ? "even" : "odd"}>
                      <td>{c.certificate_type}</td>
                      <td>{c.certificate_number}</td>
                      <td>{c.lab_name}</td>
                      <td>{c.issue_date?.substring(0, 10)}</td>
                      <td>{c.origin || "-"}</td>
                      <td>{c.variety || "-"}</td>
                      <td className="action-cell">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(c)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(c._id)}
                        >
                          <FaTrash />
                        </button>
                        <button
                          className="action-btn download-btn"
                          onClick={() =>
                            downloadZip(c._id, c.certificate_number)
                          }
                        >
                          <FaDownload style={{ marginRight: "6px" }} />
                        </button>
                        <button
                          className="action-btn qr-btn"
                          onClick={() => showQRCode(c)}
                          title="View QR Code"
                        >
                          <FaQrcode />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}

        {activeSection === "add" && (
          <form className="cert-form" onSubmit={handleSubmit}>
            <h3>{editingId ? "Update Certificate" : "Add New Certificate"}</h3>
            <div className="form-column">
              <select
                name="certificate_type"
                value={form.certificate_type}
                onChange={(e) =>
                  setForm({ ...form, certificate_type: e.target.value })
                }
                required
              >
                <option value="">Select Type</option>
                <option value="Identification">Identification</option>
                <option value="Test & Result">Test & Result</option>
              </select>

              <input
                name="certificate_number"
                placeholder="Certificate Number"
                value={form.certificate_number}
                onChange={(e) =>
                  setForm({ ...form, certificate_number: e.target.value })
                }
                required
              />

              <select
                name="lab_name"
                value={form.lab_name}
                onChange={(e) => setForm({ ...form, lab_name: e.target.value })}
                required
              >
                <option value="">Select Lab Name</option>
                <option value="GIA (Gemological Institute of America)">GIA (Gemological Institute of America)</option>
                <option value="IGI (International Gemological Institute)">IGI (International Gemological Institute)</option>
                <option value="HRD (Hoge Raad voor Diamant)">HRD (Hoge Raad voor Diamant)</option>
                <option value="EGL (European Gemological Laboratory)">EGL (European Gemological Laboratory)</option>
                <option value="AGS (American Gem Society)">AGS (American Gem Society)</option>
              </select>

              <input
                name="issue_date"
                type="date"
                min={today}
                value={form.issue_date}
                onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
                required
              />

              <input
                name="origin"
                placeholder="Origin"
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                required
              />

              <input
                name="variety"
                placeholder="Variety"
                value={form.variety}
                onChange={(e) => setForm({ ...form, variety: e.target.value })}
                required
              />

              <input
                name="file"
                type="file"
                onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                required={!editingId}
              />

              <div className="button-row">
                <button type="submit">{editingId ? "Update" : "Add"}</button>
                <button
                  type="button"
                  onClick={editingId ? cancelEdit : () => {
                    resetForm();
                    setActiveSection("dashboard");
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      {/* QR Code Modal */}
      {showQRModal && selectedCert && (
        <div className="qr-modal-overlay" onClick={closeQRModal}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="qr-modal-header">
              <h3>Certificate QR Code</h3>
              <button className="close-btn" onClick={closeQRModal}>
                ×
              </button>
            </div>
            <div className="qr-modal-content">
              <div className="qr-code-container">
                {selectedCert.qr_code ? (
                  <img 
                    src={selectedCert.qr_code} 
                    alt="Certificate QR Code" 
                    className="qr-code-image"
                  />
                ) : (
                  <div className="qr-placeholder">
                    <QRCodeSVG 
                      value={selectedCert.verification_url || `http://localhost:3000/verify-certificate/${selectedCert._id}`}
                      size={200}
                      className="qr-code-svg"
                    />
                  </div>
                )}
              </div>
              <div className="qr-info">
                <p><strong>Certificate Number:</strong> {selectedCert.certificate_number}</p>
                <p><strong>Lab:</strong> {selectedCert.lab_name}</p>
                <p><strong>Type:</strong> {selectedCert.certificate_type}</p>
                <p><strong>Verification URL:</strong></p>
                <p className="verification-url">
                  {selectedCert.verification_url || `http://localhost:3000/verify-certificate/${selectedCert._id}`}
                </p>
              </div>
              <div className="qr-actions">
                <button 
                  className="download-qr-btn" 
                  onClick={downloadQRCode}
                  disabled={!selectedCert.qr_code}
                >
                  <FaDownload /> Download QR Code
                </button>
                <button 
                  className="copy-url-btn" 
                  onClick={() => {
                    navigator.clipboard.writeText(selectedCert.verification_url || `http://localhost:3000/verify-certificate/${selectedCert._id}`);
                    alert('Verification URL copied to clipboard!');
                  }}
                >
                  Copy Verification URL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CertificateDashboard;
