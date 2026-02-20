import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../MainInventroy/Nav/Sidebar";
import "../MainInventroy/Nav/Sidebar.css";
import "../Styles/EditSupply.css"; 

// Helper function to format the date from the server (which might be a full ISO string)
const formatFormDate = (dateString) => {
    if (!dateString) return "";
    // Only take the YYYY-MM-DD part
    return dateString.split("T")[0];
};

function EditSupplyLot() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        full_name: "",
        last_name: "",
        nic: "",
        Address: "",
        contact_no: "",
        gmail: "",
        stone_code: "",
        type: "",
        color_note: "",
        size: "",
        pcs: "",
        cts: "",
        weight: "",
        currentStage_id: "",
        clarity_note: "",
        supply_date: "",
    });

    const [errors, setErrors] = useState({});

    // Fetch existing supply lot data
    useEffect(() => {
        const fetchLot = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/supplylot/${id}`);
                // Ensure the date is formatted correctly for the input type="date"
                const lotData = res.data;
                lotData.supply_date = formatFormDate(lotData.supply_date);
                setForm(lotData);
            } catch (err) {
                console.error("Error fetching data:", err);
                alert("Failed to load lot data.");
            }
        };
        fetchLot();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Validation function (same as provided, but with a slight date cleanup)
    const validateForm = () => {
        const newErrors = {};

        // Supplier Details
        if (!form.full_name.trim()) newErrors.full_name = "Full name is required";
        if (!form.last_name.trim()) newErrors.last_name = "Last name is required";
        if (!form.nic.trim()) newErrors.nic = "NIC is required";
        if (!form.Address.trim()) newErrors.Address = "Address is required";

        if (!form.contact_no || !/^[0-9]{10}$/.test(form.contact_no)) {
            newErrors.contact_no = "Contact number must be 10 digits";
        }

        if (!form.gmail || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.gmail)) {
            newErrors.gmail = "Valid email is required";
        }

        // Stone Details
        if (!form.stone_code) newErrors.stone_code = "Stone code is required";
        if (!form.type) newErrors.type = "Type is required";
        if (!form.color_note) newErrors.color_note = "Color is required";
        if (!form.size) newErrors.size = "Size is required";

        const numericFields = ["pcs", "cts", "weight"];
        numericFields.forEach(field => {
            const value = form[field];
            if (!value || isNaN(value) || Number(value) <= 0) {
                newErrors[field] = `${field.toUpperCase()} must be a positive number`;
            }
        });

        if (!form.currentStage_id)
            newErrors.currentStage_id = "Stage is required";

        // Date validation
        if (!form.supply_date) {
            newErrors.supply_date = "Supply date is required";
        } else {
            const today = new Date().setHours(0, 0, 0, 0);
            const selectedDate = new Date(form.supply_date).setHours(0, 0, 0, 0);
            
            // Allow past dates for editing, but not future dates beyond today (assuming supply date means registration date)
            if (selectedDate > today) { 
               newErrors.supply_date = "Date cannot be in the future";
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
            await axios.put(`http://localhost:5000/supplylot/${id}`, form);
            alert("✅ Supply Lot updated successfully!");
            navigate(-1); // Go back to the previous list/view page
        } catch (err) {
            console.error("Error updating data:", err);
            alert("❌ Failed to update data: " + (err.response?.data?.message || err.message));
        }
    };
    
    // Show a loading state until the form data is fetched
    if (!form.stone_code) return <div className="edit-container"><h2 className="edit-header">Loading lot data...</h2></div>;

    return (
        <div className="edit-container">
          <Sidebar />
            <h2 className="edit-header">Edit Supply Lot: {form.stone_code}</h2>

            <form onSubmit={handleSubmit} className="edit-form">
                
                {/* -------------------------------------- */}
                {/* 👥 SUPPLIER DETAILS SECTION */}
                {/* -------------------------------------- */}
                <h3 className="section-title">Supplier Details</h3>
                
                <div className="input-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                        className={errors.full_name ? "error-input" : ""}
                    />
                    {errors.full_name && <p className="error-text">{errors.full_name}</p>}
                </div>

                <div className="input-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        className={errors.last_name ? "error-input" : ""}
                    />
                    {errors.last_name && <p className="error-text">{errors.last_name}</p>}
                </div>

                <div className="input-group">
                    <label>NIC / ID</label>
                    <input
                        type="text"
                        name="nic"
                        value={form.nic}
                        onChange={handleChange}
                        className={errors.nic ? "error-input" : ""}
                    />
                    {errors.nic && <p className="error-text">{errors.nic}</p>}
                </div>
                
                <div className="input-group">
                    <label>Contact Number</label>
                    <input
                        type="text"
                        name="contact_no"
                        value={form.contact_no}
                        onChange={handleChange}
                        className={errors.contact_no ? "error-input" : ""}
                    />
                    {errors.contact_no && <p className="error-text">{errors.contact_no}</p>}
                </div>

                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Address</label>
                    <input
                        type="text"
                        name="Address"
                        value={form.Address}
                        onChange={handleChange}
                        className={errors.Address ? "error-input" : ""}
                    />
                    {errors.Address && <p className="error-text">{errors.Address}</p>}
                </div>

                <div className="input-group">
                    <label>Email (Gmail)</label>
                    <input
                        type="text"
                        name="gmail"
                        value={form.gmail}
                        onChange={handleChange}
                        className={errors.gmail ? "error-input" : ""}
                    />
                    {errors.gmail && <p className="error-text">{errors.gmail}</p>}
                </div>

                <div className="input-group">
                    <label>Supply Date</label>
                    <input
                        type="date"
                        name="supply_date"
                        value={form.supply_date}
                        onChange={handleChange}
                        className={errors.supply_date ? "error-input" : ""}
                        // Restrict date to current date or past (but not future)
                        max={new Date().toISOString().split("T")[0]} 
                    />
                    {errors.supply_date && <p className="error-text">{errors.supply_date}</p>}
                </div>
                
                {/* -------------------------------------- */}
                {/* 💎 STONE DETAILS SECTION */}
                {/* -------------------------------------- */}
                <h3 className="section-title">Stone & Inventory Details</h3>

                <div className="input-group">
                    <label>Stone Code</label>
                    <select
                        name="stone_code"
                        value={form.stone_code}
                        onChange={handleChange}
                        className={errors.stone_code ? "error-input" : ""}
                    >
                        <option value="">Select Stone Code</option>
                        <option value="SC001">SC001</option>
                        <option value="SC002">SC002</option>
                        <option value="SC003">SC003</option>
                    </select>
                    {errors.stone_code && <p className="error-text">{errors.stone_code}</p>}
                </div>

                <div className="input-group">
                    <label>Type</label>
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className={errors.type ? "error-input" : ""}
                    >
                        <option value="">Select Type</option>
                        <option value="Ruby">Ruby</option>
                        <option value="Sapphire">Sapphire</option>
                        <option value="Emerald">Emerald</option>
                    </select>
                    {errors.type && <p className="error-text">{errors.type}</p>}
                </div>

                <div className="input-group">
                    <label>Color</label>
                    <select
                        name="color_note"
                        value={form.color_note}
                        onChange={handleChange}
                        className={errors.color_note ? "error-input" : ""}
                    >
                        <option value="">Select Color</option>
                        <option value="Red">Red</option>
                        <option value="Blue">Blue</option>
                        <option value="Green">Green</option>
                        <option value="Yellow">Yellow</option>
                    </select>
                    {errors.color_note && <p className="error-text">{errors.color_note}</p>}
                </div>
                
                <div className="input-group">
                    <label>Size</label>
                    <select
                        name="size"
                        value={form.size}
                        onChange={handleChange}
                        className={errors.size ? "error-input" : ""}
                    >
                        <option value="">Select Size</option>
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                    </select>
                    {errors.size && <p className="error-text">{errors.size}</p>}
                </div>
                
                <div className="input-group">
                    <label>Pieces (PCS)</label>
                    <input
                        type="text"
                        name="pcs"
                        value={form.pcs}
                        onChange={handleChange}
                        className={errors.pcs ? "error-input" : ""}
                    />
                    {errors.pcs && <p className="error-text">{errors.pcs}</p>}
                </div>
                
                <div className="input-group">
                    <label>Carats (CTS)</label>
                    <input
                        type="text"
                        name="cts"
                        value={form.cts}
                        onChange={handleChange}
                        className={errors.cts ? "error-input" : ""}
                    />
                    {errors.cts && <p className="error-text">{errors.cts}</p>}
                </div>

                <div className="input-group">
                    <label>Weight</label>
                    <input
                        type="text"
                        name="weight"
                        value={form.weight}
                        onChange={handleChange}
                        className={errors.weight ? "error-input" : ""}
                    />
                    {errors.weight && <p className="error-text">{errors.weight}</p>}
                </div>

                <div className="input-group">
                    <label>Current Stage</label>
                    <select
                        name="currentStage_id"
                        value={form.currentStage_id}
                        onChange={handleChange}
                        className={errors.currentStage_id ? "error-input" : ""}
                    >
                        <option value="">Select Stage</option>
                        <option value="ST01">ST01 (Rough)</option>
                        <option value="ST02">ST02 (Pre-form)</option>
                        <option value="ST03">ST03 (Cut)</option>
                        <option value="ST04">ST04 (Polished)</option>
                        <option value="ST05">ST05 (Inventory)</option>
                    </select>
                    {errors.currentStage_id && <p className="error-text">{errors.currentStage_id}</p>}
                </div>
                
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Clarity Note (Optional)</label>
                    <input
                        type="text"
                        name="clarity_note"
                        value={form.clarity_note}
                        onChange={handleChange}
                    />
                </div>


                {/* Buttons */}
                <div className="button-group">
                    <button
                        type="submit"
                        className="update-btn"
                    >
                        💾 Update Lot
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="cancel-btn"
                    >
                        ❌ Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditSupplyLot;