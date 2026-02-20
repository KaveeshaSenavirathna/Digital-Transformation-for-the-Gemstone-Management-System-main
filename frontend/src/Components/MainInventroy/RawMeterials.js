import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "../MainInventroy/Nav/Sidebar";
import "../MainInventroy/Nav/Sidebar.css";
import "../Styles/RawMaterials.css";

const RAW_URL = "http://localhost:5000/rawmaterials";

function RawMaterials() {
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState({
    material_name: "",
    category: "",
    quantity: "",
    unit_type: "pcs",
    unit_value: "",
    supplier: "",
    arrival_date: "",
    expire_date: "",
    price: "",
    notes: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterUnit, setFilterUnit] = useState("");
  const [arrivalFrom, setArrivalFrom] = useState("");
  const [arrivalTo, setArrivalTo] = useState("");

  const unitOptions = ["pcs", "grams", "carats", "kg", "liters"];

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(RAW_URL);
      setMaterials(res.data);
    } catch (err) {
      console.error("Error fetching materials:", err);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.material_name.trim() || !form.category.trim()) {
      alert("Material name and category are required.");
      return;
    }
    if (form.quantity <= 0 || form.unit_value <= 0 || form.price <= 0) {
      alert("Quantity, Unit Value and Price must be positive numbers.");
      return;
    }
    if (form.arrival_date < todayStr) {
      alert("Arrival date cannot be in the past.");
      return;
    }
    if (form.expire_date && form.expire_date < form.arrival_date) {
      alert("Expiry date cannot be before arrival date.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${RAW_URL}/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(RAW_URL, form);
      }
      setForm({
        material_name: "",
        category: "",
        quantity: "",
        unit_type: "pcs",
        unit_value: "",
        supplier: "",
        arrival_date: "",
        expire_date: "",
        price: "",
        notes: ""
      });
      fetchMaterials();
    } catch (err) {
      console.error("Error saving material:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this material?")) {
      try {
        await axios.delete(`${RAW_URL}/${id}`);
        fetchMaterials();
      } catch (err) {
        console.error("Error deleting:", err);
      }
    }
  };

  const handleEdit = (mat) => {
    setForm(mat);
    setEditingId(mat._id);
  };

  const filteredMaterials = materials.filter((mat) => {
    const matchesSearch = Object.values(mat)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = filterCategory ? mat.category === filterCategory : true;
    const matchesUnit = filterUnit ? mat.unit_type === filterUnit : true;

    const arrivalDate = mat.arrival_date ? new Date(mat.arrival_date) : null;
    const fromDate = arrivalFrom ? new Date(arrivalFrom) : null;
    const toDate = arrivalTo ? new Date(arrivalTo) : null;

    const matchesDate =
      (!fromDate || (arrivalDate && arrivalDate >= fromDate)) &&
      (!toDate || (arrivalDate && arrivalDate <= toDate));

    return matchesSearch && matchesCategory && matchesUnit && matchesDate;
  });

  const totalCount = filteredMaterials.length;
  const totalQty = filteredMaterials.reduce((sum, mat) => sum + (mat.quantity || 0), 0);
  const totalPrice = filteredMaterials.reduce((sum, mat) => sum + (mat.price || 0), 0);

  const categorySummary = filteredMaterials.reduce((acc, mat) => {
    if (!acc[mat.category]) {
      acc[mat.category] = { totalQty: 0, materials: [] };
    }
    acc[mat.category].totalQty += mat.quantity || 0;
    acc[mat.category].materials.push(mat);
    return acc;
  }, {});

  return (
    <div className="raw-container">
      <Sidebar />
      <h1>Raw Materials Inventory</h1>

      {/* Form */}
      <div className="raw-form-container">
        <form onSubmit={handleSubmit}>
          <input placeholder="Material Name" value={form.material_name} onChange={(e) => setForm({ ...form, material_name: e.target.value })} required />
          <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          <input placeholder="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
          <select value={form.unit_type} onChange={(e) => setForm({ ...form, unit_type: e.target.value })}>
            {unitOptions.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <input placeholder="Unit Value" type="number" value={form.unit_value} onChange={(e) => setForm({ ...form, unit_value: e.target.value })} required />
          <input placeholder="Supplier" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
          <input type="date" value={form.arrival_date} onChange={(e) => setForm({ ...form, arrival_date: e.target.value })} min={todayStr} required />
          <input type="date" value={form.expire_date} onChange={(e) => setForm({ ...form, expire_date: e.target.value })} min={form.arrival_date || todayStr} />
          <input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />

          <button type="submit">{editingId ? "Update" : "Add"} Material</button>
        </form>
      </div>

      {/* Filters */}
      <div className="raw-filters">
        <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">All Categories</option>
          {[...new Set(materials.map((m) => m.category))].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)}>
          <option value="">All Units</option>
          {[...new Set(materials.map((m) => m.unit_type))].map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
        From: <input type="date" value={arrivalFrom} onChange={(e) => setArrivalFrom(e.target.value)} />
        To: <input type="date" value={arrivalTo} onChange={(e) => setArrivalTo(e.target.value)} />
      </div>

      <p className="raw-stats">Count: {totalCount} | Total Qty: {totalQty} | Total Price: {totalPrice}</p>

      {/* Table */}
      <div className="raw-table-container">
        {filteredMaterials.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Arrival</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.map((mat) => {
                const isLowStock = mat.quantity <= 5;
                return (
                  <tr key={mat._id} className={isLowStock ? "low-stock" : ""}>
                    <td>{mat.material_name}</td>
                    <td>{mat.category}</td>
                    <td>{mat.quantity}</td>
                    <td>{mat.unit_value} {mat.unit_type}</td>
                    <td>{mat.arrival_date?.substring(0, 10)}</td>
                    <td>
                      <Link to={`/view_raw_m/${mat._id}`}><button className="view-btn">View</button></Link>
                      <button className="edit-btn" onClick={() => handleEdit(mat)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(mat._id)}>Delete</button>
                      
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : <p>No raw materials added yet.</p>}
      </div>

      {/* Category Summary */}
      <h2>Category Summary</h2>
      <div className="category-summary">
        {Object.keys(categorySummary).length > 0 ? (
          Object.entries(categorySummary).map(([cat, data]) => (
            <div key={cat} className="category-card">
              <h3>{cat} (Total Qty: {data.totalQty})</h3>
              <ul>
                {data.materials.map((m) => (
                  <li key={m._id}>{m.material_name} — {m.quantity} ({m.unit_value} {m.unit_type})</li>
                ))}
              </ul>
            </div>
          ))
        ) : <p>No category summary.</p>}
      </div>
    </div>
  );
}

export default RawMaterials;
