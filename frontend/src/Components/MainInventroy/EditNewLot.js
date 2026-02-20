import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/EditSupplyLotPartial.css";

function EditSupplyLotPartial() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lot, setLot] = useState(null);

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

  useEffect(() => {
    const fetchLot = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/newlot/${id}`);
        setLot(res.data);
        setForm({
          stone_code: res.data.stone_code,
          type: res.data.type,
          color_note: res.data.color_note,
          size: res.data.size,
          shape: res.data.shape,
          pcs: res.data.pcs,
          cts: res.data.cts,
          currentStage_id: res.data.currentStage_id,
          clarity_note: res.data.clarity_note || "",
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchLot();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/newlot/${id}`, form);
      alert("Lot updated successfully");
      navigate(-1); // Go back to previous page
    } catch (err) {
      console.error(err);
      alert("Failed to update lot");
    }
  };

  if (!lot) return <p className="loading">Loading...</p>;

  return (
    <div className="edit-lot-container">
      <div className="edit-lot-card">
        <div className="edit-lot-header">
          <h2>Edit Supply Lot</h2>
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-lot-form">
          <div className="form-group">
            <label>Lot No</label>
            <input
              type="text"
              value={lot.lot_no}
              readOnly
              className="readonly-input"
            />
          </div>

          <div className="form-group">
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

          <div className="form-group">
            <label>Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="">Select Type</option>
              <option value="Ruby">Ruby</option>
              <option value="Sapphire">Sapphire</option>
              <option value="Emerald">Emerald</option>
            </select>
          </div>

          <div className="form-group">
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

          <div className="form-group">
            <label>Size</label>
            <select name="size" value={form.size} onChange={handleChange}>
              <option value="">Select Size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>

          <div className="form-group">
            <label>Shape</label>
            <select name="shape" value={form.shape} onChange={handleChange}>
              <option value="">Select Shape</option>
              <option value="round">Round</option>
              <option value="ovel">Ovel</option>
              <option value="box">Box</option>
            </select>
          </div>

          <div className="form-group">
            <label>PCS</label>
            <input
              type="number"
              name="pcs"
              value={form.pcs}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>CTS</label>
            <input
              type="number"
              name="cts"
              value={form.cts}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Stage</label>
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

          <div className="form-group">
            <label>Clarity Note</label>
            <input
              type="text"
              name="clarity_note"
              value={form.clarity_note}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>

          <button type="submit" className="update-btn">
            Update Lot
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditSupplyLotPartial;
