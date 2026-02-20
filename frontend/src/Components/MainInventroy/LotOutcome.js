import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../MainInventroy/Nav/Sidebar";
import "../MainInventroy/Nav/Sidebar.css";
import "../Styles/LotOutcome.css";

const INVENTORY_URL = "http://localhost:5000/cplotProceed/proceed";

function LotOutcome() {
  const [inventory, setInventory] = useState([]);
  const [filters, setFilters] = useState({
    size: "",
    type: "",
    shape: "",
    color_note: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [uniqueSizes, setUniqueSizes] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [uniqueShapes, setUniqueShapes] = useState([]);
  const [uniqueColors, setUniqueColors] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get(INVENTORY_URL);
        const data = Array.isArray(res.data) ? res.data : res.data.cplotProceed || [];
        setInventory(data);

        setUniqueSizes([...new Set(data.map((lot) => lot.size).filter(Boolean))]);
        setUniqueTypes([...new Set(data.map((lot) => lot.type).filter(Boolean))]);
        setUniqueShapes([...new Set(data.map((lot) => lot.shape).filter(Boolean))]);
        setUniqueColors([...new Set(data.map((lot) => lot.color_note).filter(Boolean))]);
      } catch (err) {
        console.error("Error fetching inventory:", err);
      }
    };
    fetchInventory();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredInventory = inventory
    .filter((lot) =>
      (!filters.size || lot.size === filters.size) &&
      (!filters.type || lot.type === filters.type) &&
      (!filters.shape || lot.shape === filters.shape) &&
      (!filters.color_note || lot.color_note === filters.color_note)
    )
    .filter((lot) =>
      Object.values(lot).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalPCS = filteredInventory.reduce((sum, lot) => sum + Number(lot.pcs || 0), 0);
  const totalCTS = filteredInventory.reduce((sum, lot) => sum + Number(lot.cts || 0), 0);

  return (
    <div className="lot-outcome-wrapper">
      <Sidebar />
      <div className="lot-outcome-container">
        <h1>Cut & Polish Outcome</h1>

        {/* Filters */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select name="size" value={filters.size} onChange={handleFilterChange}>
            <option value="">All Sizes</option>
            {uniqueSizes.map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
          <select name="type" value={filters.type} onChange={handleFilterChange}>
            <option value="">All Types</option>
            {uniqueTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          <select name="shape" value={filters.shape} onChange={handleFilterChange}>
            <option value="">All Shapes</option>
            {uniqueShapes.map((shape) => <option key={shape} value={shape}>{shape}</option>)}
          </select>
          <select name="color_note" value={filters.color_note} onChange={handleFilterChange}>
            <option value="">All Colors</option>
            {uniqueColors.map((color) => <option key={color} value={color}>{color}</option>)}
          </select>
        </div>

        {/* Summary */}
        <div className="summary">
          <span><strong>Filtered Lots:</strong> {filteredInventory.length}   |    </span>
          <span><strong>Total PCS:</strong> {totalPCS}   |   </span>
          <span><strong>Total CTS:</strong> {totalCTS}</span>
        </div>

        {/* Table */}
        <div className="table-container">
          {filteredInventory.length > 0 ? (
            <table className="lot-table">
              <thead>
                <tr>
                  <th>Lot No</th>
                  <th>Type</th>
                  <th>Color Note</th>
                  <th>Size</th>
                  <th>Shape</th>
                  <th>PCS</th>
                  <th>CTS</th>
                  <th>Step</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((lot) => (
                  <tr key={lot._id}>
                    <td>{lot.lot_no}</td>
                    <td>{lot.type}</td>
                    <td>{lot.color_note}</td>
                    <td>{lot.size}</td>
                    <td>{lot.shape}</td>
                    <td>{lot.pcs}</td>
                    <td>{lot.cts}</td>
                    <td>{lot.step}</td>
                    <td>
                      <Link to={`/view_cplot_proceed/${lot._id}`}>
                        <button className="view-btn">View</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No inventory lots match the filters or search.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LotOutcome;
