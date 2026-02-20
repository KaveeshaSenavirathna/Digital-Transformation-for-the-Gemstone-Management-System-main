import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Production & Process/Nav/Sidebar";
import "../Production & Process/Nav/Sidebar.css";
import "../Styles/DisplayProcess.css";

function Insert_Process() {
  const navigate = useNavigate();
  const [step, setStep] = useState("Preform");

  const [formData, setFormData] = useState({
    lot_no: "",
    stone_code: "",
    type: "",
    size: "",
    shape: "",
    color_note: "",
    side: "",
    pcs: "",
    cts: "",
    currentStage_id: "",
    cal_id: "",
    cal_name: "",
    dop_id: "",
    dop_name: "",
    cp_id: "",
    cp_name: "",
    clarity_note: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Automatically prefix "LOT" for lot_no
    if (name === "lot_no") {
      value = value.startsWith("LOT") ? value : `LOT${value}`;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let url = "";
    switch (step) {
      case "Preform":
        url = "http://localhost:5000/preformlot";
        break;
      case "Calibrate":
        url = "http://localhost:5000/calibratelot";
        break;
      case "Dop":
        url = "http://localhost:5000/doplot";
        break;
      case "CutPolish":
        url = "http://localhost:5000/cplot";
        break;
      default:
        return;
    }

    try {
      await axios.post(url, formData);
      alert(`${step} process inserted successfully!`);

      // Reset form
      setFormData({
        lot_no: "",
        stone_code: "",
        type: "",
        size: "",
        shape: "",
        color_note: "",
        side: "",
        pcs: "",
        cts: "",
        currentStage_id: "",
        cal_id: "",
        cal_name: "",
        dop_id: "",
        dop_name: "",
        cp_id: "",
        cp_name: "",
        clarity_note: "",
      });

      navigate("/display_process");
    } catch (err) {
      console.error("Error inserting process:", err);
      alert("Failed to insert process");
    }
  };

  return (
    <div className="display-process-container">
      <Sidebar />

      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 20px 0', color: '#495057', fontSize: '2rem', fontWeight: '600' }}>
          Insert Process Data
        </h1>
        <p style={{ margin: '0', color: '#666', fontSize: '1rem' }}>
          Add new process data to the gemstone production system
        </p>
      </div>

      {/* Step Selection Card */}
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#fff', 
        borderRadius: '10px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#495057', fontSize: '1.2rem' }}>
          Process Step Selection
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <label htmlFor="step-select" style={{ 
            fontSize: '1rem', 
            fontWeight: '500', 
            color: '#333',
            minWidth: '100px'
          }}>
            Select Step:
          </label>
          <select
            id="step-select"
            value={step}
            onChange={(e) => setStep(e.target.value)}
            style={{
              padding: '10px 15px',
              fontSize: '1rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              backgroundColor: '#fff',
              color: '#333',
              cursor: 'pointer',
              minWidth: '200px',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
          >
            <option value="Preform">Preform Process</option>
            <option value="Calibrate">Calibrate Process</option>
            <option value="Dop">DOP Process</option>
            <option value="CutPolish">Cut & Polish Process</option>
          </select>
        </div>
      </div>

      {/* Form Card */}
      <div style={{ 
        padding: '30px', 
        backgroundColor: '#fff', 
        borderRadius: '10px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{ margin: '0 0 25px 0', color: '#495057', fontSize: '1.3rem', borderBottom: '2px solid #e9ecef', paddingBottom: '10px' }}>
          Process Information
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '20px',
            marginBottom: '30px'
          }}>
            {/* Lot No */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                color: '#333',
                marginBottom: '5px'
              }}>
                Lot Number *
              </label>
              <input
                type="text"
                name="lot_no"
                value={formData.lot_no}
                onChange={handleChange}
                placeholder="Enter number only (e.g., 001)"
                style={{
                  padding: '12px 15px',
                  fontSize: '1rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  color: '#333',
                  transition: 'border-color 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                required
              />
            </div>

            {/* Stone Code */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                color: '#333',
                marginBottom: '5px'
              }}>
                Stone Code *
              </label>
              <select
                name="stone_code"
                value={formData.stone_code}
                onChange={handleChange}
                style={{
                  padding: '12px 15px',
                  fontSize: '1rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  color: '#333',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                required
              >
                <option value="">--Select Stone Code--</option>
                <option value="SC001">SC001 - Premium Quality</option>
                <option value="SC002">SC002 - Standard Quality</option>
                <option value="SC003">SC003 - Commercial Quality</option>
              </select>
            </div>

            {/* Type */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                color: '#333',
                marginBottom: '5px'
              }}>
                Gemstone Type *
              </label>
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                style={{
                  padding: '12px 15px',
                  fontSize: '1rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  color: '#333',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                required
              >
                <option value="">--Select Gemstone Type--</option>
                <option value="Ruby">Ruby</option>
                <option value="Sapphire">Sapphire</option>
                <option value="Emerald">Emerald</option>
              </select>
            </div>

            {/* Size */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                color: '#333',
                marginBottom: '5px'
              }}>
                Size Category *
              </label>
              <select 
                name="size" 
                value={formData.size} 
                onChange={handleChange}
                style={{
                  padding: '12px 15px',
                  fontSize: '1rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  color: '#333',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                required
              >
                <option value="">--Select Size Category--</option>
                <option value="Small">Small (0.5-2.0 carats)</option>
                <option value="Medium">Medium (2.1-5.0 carats)</option>
                <option value="Large">Large (5.1+ carats)</option>
              </select>
            </div>

            {/* Shape */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                color: '#333',
                marginBottom: '5px'
              }}>
                Cut Shape *
              </label>
              <select 
                name="shape" 
                value={formData.shape} 
                onChange={handleChange}
                style={{
                  padding: '12px 15px',
                  fontSize: '1rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  color: '#333',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                required
              >
                <option value="">--Select Cut Shape--</option>
                <option value="Round">Round Brilliant</option>
                <option value="Oval">Oval</option>
                <option value="Square">Square (Princess)</option>
              </select>
            </div>

            {/* Color Note */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                color: '#333',
                marginBottom: '5px'
              }}>
                Color Grade *
              </label>
              <select
                name="color_note"
                value={formData.color_note}
                onChange={handleChange}
                style={{
                  padding: '12px 15px',
                  fontSize: '1rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  color: '#333',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                required
              >
                <option value="">--Select Color Grade--</option>
                <option value="White">White (D-F)</option>
                <option value="Yellow">Yellow (G-J)</option>
                <option value="Blue">Blue (Fancy)</option>
              </select>
            </div>

            {/* Side (Conditional) */}
            {step !== "Preform" && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: '600', 
                  color: '#333',
                  marginBottom: '5px'
                }}>
                  Processing Side *
                </label>
                <select 
                  name="side" 
                  value={formData.side} 
                  onChange={handleChange}
                  style={{
                    padding: '12px 15px',
                    fontSize: '1rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    color: '#333',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#007bff'}
                  onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  required
                >
                  <option value="">--Select Processing Side--</option>
                  <option value="Top">Top Side</option>
                  <option value="Bottom">Bottom Side</option>
                  <option value="Both">Both Sides</option>
                </select>
              </div>
            )}

            {/* PCS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                color: '#333',
                marginBottom: '5px'
              }}>
                Pieces (PCS) *
              </label>
              <input
                type="number"
                name="pcs"
                value={formData.pcs}
                onChange={handleChange}
                min="1"
                placeholder="Enter number of pieces"
                style={{
                  padding: '12px 15px',
                  fontSize: '1rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  color: '#333',
                  transition: 'border-color 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                required
              />
            </div>

            {/* CTS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                color: '#333',
                marginBottom: '5px'
              }}>
                Carats (CTS) *
              </label>
              <input
                type="number"
                name="cts"
                value={formData.cts}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                placeholder="Enter carat weight"
                style={{
                  padding: '12px 15px',
                  fontSize: '1rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  color: '#333',
                  transition: 'border-color 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                required
              />
            </div>

            {/* Current Stage ID */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                color: '#333',
                marginBottom: '5px'
              }}>
                Current Stage *
              </label>
              <select
                name="currentStage_id"
                value={formData.currentStage_id}
                onChange={handleChange}
                style={{
                  padding: '12px 15px',
                  fontSize: '1rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  color: '#333',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                required
              >
                <option value="">--Select Current Stage--</option>
                <option value="ST01">ST01 - Initial Processing</option>
                <option value="ST02">ST02 - Quality Check</option>
                <option value="ST03">ST03 - Final Inspection</option>
              </select>
            </div>

            {/* Calibrate fields (Conditional) */}
            {step === "Calibrate" && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: '600', 
                    color: '#333',
                    marginBottom: '5px'
                  }}>
                    Calibrator ID *
                  </label>
                  <input
                    type="text"
                    name="cal_id"
                    value={formData.cal_id}
                    onChange={handleChange}
                    placeholder="Enter calibrator ID"
                    style={{
                      padding: '12px 15px',
                      fontSize: '1rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      color: '#333',
                      transition: 'border-color 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#007bff'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    required
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: '600', 
                    color: '#333',
                    marginBottom: '5px'
                  }}>
                    Calibrator Name *
                  </label>
                  <input
                    type="text"
                    name="cal_name"
                    value={formData.cal_name}
                    onChange={handleChange}
                    placeholder="Enter calibrator name"
                    style={{
                      padding: '12px 15px',
                      fontSize: '1rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      color: '#333',
                      transition: 'border-color 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#007bff'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    required
                  />
                </div>
              </>
            )}

            {/* Dop fields (Conditional) */}
            {step === "Dop" && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: '600', 
                    color: '#333',
                    marginBottom: '5px'
                  }}>
                    DOP ID *
                  </label>
                  <input
                    type="text"
                    name="dop_id"
                    value={formData.dop_id}
                    onChange={handleChange}
                    placeholder="Enter DOP ID"
                    style={{
                      padding: '12px 15px',
                      fontSize: '1rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      color: '#333',
                      transition: 'border-color 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#007bff'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    required
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: '600', 
                    color: '#333',
                    marginBottom: '5px'
                  }}>
                    DOP Name *
                  </label>
                  <input
                    type="text"
                    name="dop_name"
                    value={formData.dop_name}
                    onChange={handleChange}
                    placeholder="Enter DOP name"
                    style={{
                      padding: '12px 15px',
                      fontSize: '1rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      color: '#333',
                      transition: 'border-color 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#007bff'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    required
                  />
                </div>
              </>
            )}

            {/* CutPolish fields (Conditional) */}
            {step === "CutPolish" && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: '600', 
                    color: '#333',
                    marginBottom: '5px'
                  }}>
                    Cutter ID *
                  </label>
                  <input
                    type="text"
                    name="cp_id"
                    value={formData.cp_id}
                    onChange={handleChange}
                    placeholder="Enter cutter ID"
                    style={{
                      padding: '12px 15px',
                      fontSize: '1rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      color: '#333',
                      transition: 'border-color 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#007bff'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    required
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: '600', 
                    color: '#333',
                    marginBottom: '5px'
                  }}>
                    Cutter Name *
                  </label>
                  <input
                    type="text"
                    name="cp_name"
                    value={formData.cp_name}
                    onChange={handleChange}
                    placeholder="Enter cutter name"
                    style={{
                      padding: '12px 15px',
                      fontSize: '1rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      color: '#333',
                      transition: 'border-color 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#007bff'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    required
                  />
                </div>
              </>
            )}

            {/* Clarity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                color: '#333',
                marginBottom: '5px'
              }}>
                Clarity Notes
              </label>
              <input
                type="text"
                name="clarity_note"
                value={formData.clarity_note}
                onChange={handleChange}
                placeholder="Enter clarity observations"
                style={{
                  padding: '12px 15px',
                  fontSize: '1rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  color: '#333',
                  transition: 'border-color 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '15px',
            paddingTop: '20px',
            borderTop: '2px solid #e9ecef'
          }}>
            <button 
              type="submit" 
              style={{
                padding: '15px 40px',
                fontSize: '1.1rem',
                fontWeight: '600',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
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
              Insert {step} Process
            </button>
            <button 
              type="button"
              onClick={() => navigate("/display_process")}
              style={{
                padding: '15px 30px',
                fontSize: '1.1rem',
                fontWeight: '600',
                backgroundColor: '#6c757d',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#545b62';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#6c757d';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Insert_Process;