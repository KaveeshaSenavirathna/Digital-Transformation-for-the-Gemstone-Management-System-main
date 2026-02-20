import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../MainInventroy/Nav/Sidebar";
import "../MainInventroy/Nav/Sidebar.css";
import "../Styles/LotList.css";

function SupplyLotList() {
  const [lots, setLots] = useState([]);
  const [filteredLots, setFilteredLots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterColor, setFilterColor] = useState("");
  const [filterSize, setFilterSize] = useState("");
  const [filterStage, setFilterStage] = useState("");
  const navigate = useNavigate();

  const fetchLots = async () => {
    try {
      const res = await axios.get("http://localhost:5000/newlot");
      setLots(res.data);
      setFilteredLots(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLots();
  }, []);

  // 🔍 Search + Filter logic
  useEffect(() => {
    let data = lots;

    if (searchTerm) {
      data = data.filter(
        (lot) =>
          lot.stone_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lot.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterColor) data = data.filter((lot) => lot.color_note === filterColor);
    if (filterSize) data = data.filter((lot) => lot.size === filterSize);
    if (filterStage) data = data.filter((lot) => lot.currentStage_id === filterStage);

    setFilteredLots(data);
  }, [searchTerm, filterColor, filterSize, filterStage, lots]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lot?")) return;
    try {
      await axios.delete(`http://localhost:5000/newlot/${id}`);
      fetchLots();
    } catch (err) {
      console.error(err);
      alert("Failed to delete lot");
    }
  };

  const handleProceed = async (id) => {
    try {
      await axios.post(`http://localhost:5000/newlot/${id}/proceed`);
      alert("Lot proceeded successfully!");
      fetchLots();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error proceeding lot");
    }
  };

  return (
    <div className="lot-list-container">
      <Sidebar />
      <div className="lot-list-content">
        <h2 className="lot-list-header">Supply Lot Management</h2>

        {/* 🔍 Filter + Search Bar */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by Stone Code or Type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={filterColor}
            onChange={(e) => setFilterColor(e.target.value)}
          >
            <option value="">All Colors</option>
            <option value="Red">Red</option>
            <option value="Blue">Blue</option>
            <option value="Green">Green</option>
            <option value="Yellow">Yellow</option>
          </select>

          <select
            value={filterSize}
            onChange={(e) => setFilterSize(e.target.value)}
          >
            <option value="">All Sizes</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>

          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
          >
            <option value="">All Stages</option>
            <option value="ST01">ST01</option>
            <option value="ST02">ST02</option>
            <option value="ST03">ST03</option>
            <option value="ST04">ST04</option>
            <option value="ST05">ST05</option>
          </select>

          <button
            className="add-btn"
            onClick={() => navigate("/newlot")}
          >
            + Create New Lot
          </button>
        </div>

        {/* 📋 Table */}
        <div className="table-wrapper">
          <table className="lot-table">
            <thead>
              <tr>
                <th>Lot No</th>
                <th>Stone Code</th>
                <th>Type</th>
                <th>Color</th>
                <th>Size</th>
                <th>Shape</th>
                <th>PCS</th>
                <th>CTS</th>
                <th>Stage</th>
                <th>Clarity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLots.length === 0 ? (
                <tr>
                  <td colSpan="11" className="no-data">
                    No lots found
                  </td>
                </tr>
              ) : (
                filteredLots.map((lot) => (
                  <tr key={lot._id}>
                    <td>{lot.lot_no}</td>
                    <td>{lot.stone_code}</td>
                    <td>{lot.type}</td>
                    <td>{lot.color_note}</td>
                    <td>{lot.size}</td>
                    <td>{lot.shape}</td>
                    <td>{lot.pcs}</td>
                    <td>{lot.cts}</td>
                    <td>{lot.currentStage_id}</td>
                    <td>{lot.clarity_note}</td>
                    <td className="action-buttons">
                      <button
                        onClick={() => navigate(`/updatelot/${lot._id}`)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(lot._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleProceed(lot._id)}
                        disabled={lot.proceeded}
                        className={`proceed-btn ${
                          lot.proceeded ? "disabled" : ""
                        }`}
                      >
                        {lot.proceeded ? "Proceeded" : "Proceed"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SupplyLotList;
