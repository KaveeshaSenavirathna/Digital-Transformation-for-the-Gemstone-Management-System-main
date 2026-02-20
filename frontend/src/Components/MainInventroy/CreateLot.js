import { useState } from "react";
import axios from "axios";
import Sidebar from "../MainInventroy/Nav/Sidebar";
import "../MainInventroy/Nav/Sidebar.css";
import "../Styles/CreateLot.css";

function CreateLot() {
  const [form, setForm] = useState({
    stone_code: "",
    type: "",
    color_note: "",
    size: "",
    shape: "",
    pcs: "",
    cts: "",
    currentStage_id: "",
    clarity_note: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "stone_code",
      "type",
      "color_note",
      "size",
      "pcs",
      "cts",
      "currentStage_id",
    ];
    for (let field of requiredFields) {
      if (!form[field]) {
        alert(`Please enter ${field}`);
        return;
      }
    }

    try {
      const res = await axios.post("http://localhost:5000/newlot", form);
      alert(`Lot ${res.data.lot_no} created successfully`);
      setForm({
        stone_code: "",
        type: "",
        color_note: "",
        size: "",
        shape: "",
        pcs: "",
        cts: "",
        currentStage_id: "",
        clarity_note: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create lot: " + err.message);
    }
  };

  return (
    <div className="create-lot-container">
      <Sidebar />
      <div className="create-lot-content">
        <h2 className="create-lot-header">Create New Supply Lot</h2>
        <form onSubmit={handleSubmit} className="create-lot-form">
          <div className="form-grid">
            {/* Stone Code */}
            <div className="input-group">
              <label>Stone Code</label>
              <select
                name="stone_code"
                value={form.stone_code}
                onChange={handleChange}
              >
                <option value="">Select Stone Code</option>
                <option value="SC001">SC001</option>
                <option value="SC002">SC002</option>
                <option value="SC003">SC003</option>
              </select>
            </div>

            {/* Type */}
            <div className="input-group">
              <label>Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="">Select Type</option>
                <option value="Ruby">Ruby</option>
                <option value="Sapphire">Sapphire</option>
                <option value="Emerald">Emerald</option>
              </select>
            </div>

            {/* Color */}
            <div className="input-group">
              <label>Color</label>
              <select
                name="color_note"
                value={form.color_note}
                onChange={handleChange}
              >
                <option value="">Select Color</option>
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
                <option value="Green">Green</option>
                <option value="Yellow">Yellow</option>
              </select>
            </div>

            {/* Size */}
            <div className="input-group">
              <label>Size</label>
              <select name="size" value={form.size} onChange={handleChange}>
                <option value="">Select Size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>

            {/* Shape */}
            <div className="input-group">
              <label>Shape</label>
              <select name="shape" value={form.shape} onChange={handleChange}>
                <option value="">Select Shape</option>
                <option value="Round">Round</option>
                <option value="Oval">Oval</option>
                <option value="Box">Box</option>
              </select>
            </div>

            {/* PCS */}
            <div className="input-group">
              <label>PCS</label>
              <input
                type="number"
                name="pcs"
                placeholder="PCS"
                value={form.pcs}
                onChange={handleChange}
              />
            </div>

            {/* CTS */}
            <div className="input-group">
              <label>CTS</label>
              <input
                type="number"
                name="cts"
                placeholder="CTS"
                value={form.cts}
                onChange={handleChange}
              />
            </div>

            {/* Current Stage */}
            <div className="input-group">
              <label>Current Stage</label>
              <select
                name="currentStage_id"
                value={form.currentStage_id}
                onChange={handleChange}
              >
                <option value="">Select Stage</option>
                <option value="ST01">ST01</option>
                <option value="ST02">ST02</option>
                <option value="ST03">ST03</option>
                <option value="ST04">ST04</option>
                <option value="ST05">ST05</option>
              </select>
            </div>

            {/* Clarity Note */}
            <div className="input-group full-width">
              <label>Clarity Note (optional)</label>
              <input
                type="text"
                name="clarity_note"
                placeholder="Enter clarity note"
                value={form.clarity_note}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="button-container">
            <button type="submit" className="create-btn">
              Create Lot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateLot;
