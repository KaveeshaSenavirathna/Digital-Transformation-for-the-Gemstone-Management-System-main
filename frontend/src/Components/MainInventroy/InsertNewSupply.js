import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../MainInventroy/Nav/Sidebar";
import "../MainInventroy/Nav/Sidebar.css";
// --- NEW CSS IMPORT ---
import "../Styles/NewSupply.css"; 

const Add = () => {
  const navigate = useNavigate();

  const [stoneLot, setStoneLot] = useState({
    stone_code: "",
    type: "",
    color_note: "",
    size: "",
    pcs: "",
    cts: "",
    weight: "",
    currentStage_id: "",
    clarity_note: "",
    full_name: "",
    last_name: "",
    nic: "",
    Address: "",
    contact_no: "",
    gmail: "",
    supply_date: new Date().toISOString().split("T")[0], // Default to today
  });

  const [errors, setErrors] = useState({});

  const handleStoneLotChange = (e) =>
    setStoneLot({ ...stoneLot, [e.target.name]: e.target.value });

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!stoneLot.stone_code) newErrors.stone_code = "Stone code is required";
    if (!stoneLot.type) newErrors.type = "Type is required";
    if (!stoneLot.color_note) newErrors.color_note = "Color is required";
    if (!stoneLot.size) newErrors.size = "Size is required";

    // Numerical validations
    const numericFields = ["pcs", "cts", "weight"];
    numericFields.forEach(field => {
      const value = stoneLot[field];
      if (!value || isNaN(value) || Number(value) <= 0) {
        newErrors[field] = `${field.toUpperCase()} must be a positive number`;
      }
    });

    if (!stoneLot.currentStage_id)
      newErrors.currentStage_id = "Stage is required";

    if (!stoneLot.full_name.trim()) newErrors.full_name = "Full name is required";
    if (!stoneLot.last_name.trim()) newErrors.last_name = "Last name is required";

    if (!stoneLot.nic.trim()) newErrors.nic = "NIC is required";

    if (!stoneLot.Address.trim()) newErrors.Address = "Address is required";

    // Contact number validation (10 digits)
    if (
      !stoneLot.contact_no ||
      !/^[0-9]{10}$/.test(stoneLot.contact_no)
    ) {
      newErrors.contact_no = "Contact No must be 10 digits";
    }

    // Email validation
    if (
      !stoneLot.gmail ||
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(stoneLot.gmail)
    ) {
      newErrors.gmail = "Valid email is required";
    }

    // Date validation (cannot be in the past)
    if (!stoneLot.supply_date) {
      newErrors.supply_date = "Date is required";
    } else {
      const today = new Date().setHours(0, 0, 0, 0);
      const selectedDate = new Date(stoneLot.supply_date).setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.supply_date = "Date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("❌ Please fix validation errors!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/supplylot", stoneLot);
      alert("✅ Supply Lot saved successfully!");
      navigate("/New_Manage");
    } catch (err) {
      console.error("Error while saving data:", err);
      alert("❌ Failed to save data: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="add-container">
      <Sidebar />
      <div className="add-content"> {/* Use add-content for the main area */}
        <div className="add-header">
          <h1>New Supply Registration</h1>
          
        </div>

        <form className="add-form" onSubmit={handleSubmit}>
          
          <h3>Stone Lot Details</h3>

          {/* Stone Code */}
          <div className="input-group">
            <select
              name="stone_code"
              value={stoneLot.stone_code}
              onChange={handleStoneLotChange}
              className={errors.stone_code ? "form-group-error" : ""}
            >
              <option value="">Select Stone Code</option>
              <option value="SC001">SC001</option>
              <option value="SC002">SC002</option>
              <option value="SC003">SC003</option>
            </select>
            {errors.stone_code && <p className="error">{errors.stone_code}</p>}
          </div>

          {/* Type */}
          <div className="input-group">
            <select
              name="type"
              value={stoneLot.type}
              onChange={handleStoneLotChange}
              className={errors.type ? "form-group-error" : ""}
            >
              <option value="">Select Type</option>
              <option value="Ruby">Ruby</option>
              <option value="Sapphire">Sapphire</option>
              <option value="Emerald">Emerald</option>
            </select>
            {errors.type && <p className="error">{errors.type}</p>}
          </div>

          {/* Color */}
          <div className="input-group">
            <select
              name="color_note"
              value={stoneLot.color_note}
              onChange={handleStoneLotChange}
              className={errors.color_note ? "form-group-error" : ""}
            >
              <option value="">Select Color</option>
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="Green">Green</option>
              <option value="Yellow">Yellow</option>
            </select>
            {errors.color_note && <p className="error">{errors.color_note}</p>}
          </div>

          {/* Size */}
          <div className="input-group">
            <select
              name="size"
              value={stoneLot.size}
              onChange={handleStoneLotChange}
              className={errors.size ? "form-group-error" : ""}
            >
              <option value="">Select Size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
            {errors.size && <p className="error">{errors.size}</p>}
          </div>

          {/* PCS */}
          <div className="input-group">
            <input
              type="text"
              name="pcs"
              placeholder="Pieces (PCS)"
              value={stoneLot.pcs}
              onChange={handleStoneLotChange}
              className={errors.pcs ? "form-group-error" : ""}
            />
            {errors.pcs && <p className="error">{errors.pcs}</p>}
          </div>

          {/* CTS */}
          <div className="input-group">
            <input
              type="text"
              name="cts"
              placeholder="Carats (CTS)"
              value={stoneLot.cts}
              onChange={handleStoneLotChange}
              className={errors.cts ? "form-group-error" : ""}
            />
            {errors.cts && <p className="error">{errors.cts}</p>}
          </div>

          {/* Weight */}
          <div className="input-group">
            <input
              type="text"
              name="weight"
              placeholder="Weight (grams/kg)"
              value={stoneLot.weight}
              onChange={handleStoneLotChange}
              className={errors.weight ? "form-group-error" : ""}
            />
            {errors.weight && <p className="error">{errors.weight}</p>}
          </div>

          {/* Stage */}
          <div className="input-group">
            <select
              name="currentStage_id"
              value={stoneLot.currentStage_id}
              onChange={handleStoneLotChange}
              className={errors.currentStage_id ? "form-group-error" : ""}
            >
              <option value="">Select Initial Stage</option>
              <option value="ST01">ST01 (Rough)</option>
              <option value="ST02">ST02 (Pre-form)</option>
              <option value="ST03">ST03 (Cut)</option>
              <option value="ST04">ST04 (Polished)</option>
              <option value="ST05">ST05 (Inventory)</option>
            </select>
            {errors.currentStage_id && <p className="error">{errors.currentStage_id}</p>}
          </div>
          
          {/* Clarity Note */}
          <div className="input-group">
            <input
              type="text"
              name="clarity_note"
              placeholder="Clarity Note (VVS, VS, SI, etc.)"
              value={stoneLot.clarity_note}
              onChange={handleStoneLotChange}
            />
          </div>

          {/* Supply Date */}
          <div className="input-group">
            
            <input
              id="supply_date"
              type="date"
              name="supply_date"
              value={stoneLot.supply_date}
              onChange={handleStoneLotChange}
              min={new Date().toISOString().split("T")[0]} // prevent past dates
              className={errors.supply_date ? "form-group-error" : ""}
            />
            {errors.supply_date && <p className="error">{errors.supply_date}</p>}
          </div>


          <h3>Supplier Details</h3>

          {/* Full Name */}
          <div className="input-group">
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={stoneLot.full_name}
              onChange={handleStoneLotChange}
              className={errors.full_name ? "form-group-error" : ""}
            />
            {errors.full_name && <p className="error">{errors.full_name}</p>}
          </div>

          {/* Last Name */}
          <div className="input-group">
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={stoneLot.last_name}
              onChange={handleStoneLotChange}
              className={errors.last_name ? "form-group-error" : ""}
            />
            {errors.last_name && <p className="error">{errors.last_name}</p>}
          </div>

          {/* NIC */}
          <div className="input-group">
            <input
              type="text"
              name="nic"
              placeholder="NIC / National ID"
              value={stoneLot.nic}
              onChange={handleStoneLotChange}
              className={errors.nic ? "form-group-error" : ""}
            />
            {errors.nic && <p className="error">{errors.nic}</p>}
          </div>

          {/* Address */}
          <div className="input-group">
            <input
              type="text"
              name="Address"
              placeholder="Address"
              value={stoneLot.Address}
              onChange={handleStoneLotChange}
              className={errors.Address ? "form-group-error" : ""}
            />
            {errors.Address && <p className="error">{errors.Address}</p>}
          </div>

          {/* Contact No */}
          <div className="input-group">
            <input
              type="text"
              name="contact_no"
              placeholder="Contact Number (10 digits)"
              value={stoneLot.contact_no}
              onChange={handleStoneLotChange}
              className={errors.contact_no ? "form-group-error" : ""}
            />
            {errors.contact_no && <p className="error">{errors.contact_no}</p>}
          </div>

          {/* Gmail */}
          <div className="input-group">
            <input
              type="text"
              name="gmail"
              placeholder="Email"
              value={stoneLot.gmail}
              onChange={handleStoneLotChange}
              className={errors.gmail ? "form-group-error" : ""}
            />
            {errors.gmail && <p className="error">{errors.gmail}</p>}
          </div>

          <button type="submit">Register New Supply</button>
        </form>
      </div>
    </div>
  );
};

export default Add;