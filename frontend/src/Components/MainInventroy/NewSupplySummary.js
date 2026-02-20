import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../MainInventroy/Nav/Sidebar";
import "../MainInventroy/Nav/Sidebar.css";
import "../Styles/NewSupplySummary.css";

function SupplyLotSummary() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [typeOptions, setTypeOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);

  const [filterType, setFilterType] = useState("");
  const [filterColor, setFilterColor] = useState("");
  const [filterSize, setFilterSize] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch dropdown options
  const fetchOptions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/supplylot/options");
      setTypeOptions(res.data.types || []);
      setColorOptions(res.data.colors || []);
      setSizeOptions(res.data.sizes || []);
    } catch (err) {
      console.error("Error fetching filter options:", err);
    }
  };

  // Fetch summary data
  const fetchSummary = async () => {
    try {
      setLoading(true);
      const params = {};

      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      if (filterType) params.type = filterType;
      if (filterColor) params.color = filterColor;
      if (filterSize) params.size = filterSize;

      const res = await axios.get("http://localhost:5000/supplylot/summary", { params });
      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
      alert("Failed to fetch summary data");
    } finally {
      setLoading(false);
    }
  };

  // Download CSV
  const downloadCSV = () => {
    if (!summary.length) return alert("No data to download");

    const headers = ["Type", "Sizes", "Colors", "Total Weight (g)", "Total PCS", "Total CTS"];
    const rows = summary.map((item) => [
      item.type,
      item.sizes.join(", "),
      item.colors.join(", "),
      item.totalWeight,
      item.totalPCS,
      item.totalCTS,
    ]);

    const grandTotalWeight = summary.reduce((a, c) => a + c.totalWeight, 0);
    const grandTotalPCS = summary.reduce((a, c) => a + c.totalPCS, 0);
    const grandTotalCTS = summary.reduce((a, c) => a + c.totalCTS, 0);

    rows.push(["GRAND TOTAL", "", "", grandTotalWeight, grandTotalPCS, grandTotalCTS]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "supply_lot_summary.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchOptions();
    fetchSummary();
  }, []);

  // Grand totals
  const grandTotalWeight = summary.reduce((acc, cur) => acc + cur.totalWeight, 0);
  const grandTotalPCS = summary.reduce((acc, cur) => acc + cur.totalPCS, 0);
  const grandTotalCTS = summary.reduce((acc, cur) => acc + cur.totalCTS, 0);

  return (
    <div className="summary-container">
      <Sidebar />

      <div className="back-btn-container">
        <button onClick={() => navigate(-1)} className="back-btn">
          ⬅ Back to List
        </button>
      </div>

      <h2 className="summary-header">Supply Summary Report</h2>

      {/* Filter Controls */}
      <div className="filter-actions-bar">
        <div className="input-group">
          <label>From Date</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>

        <div className="input-group">
          <label>To Date</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>

        <div className="input-group">
          <label>Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All Types</option>
            {typeOptions.map((t, i) => (
              <option key={i} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Color</label>
          <select value={filterColor} onChange={(e) => setFilterColor(e.target.value)}>
            <option value="">All Colors</option>
            {colorOptions.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Size</label>
          <select value={filterSize} onChange={(e) => setFilterSize(e.target.value)}>
            <option value="">All Sizes</option>
            {sizeOptions.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <button onClick={fetchSummary} className="filter-btn">Apply Filter</button>
        <button onClick={downloadCSV} className="download-btn">Download CSV</button>
      </div>

      {/* Summary Table */}
      <div className="summary-table-wrapper">
        <table className="summary-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Sizes Grouped</th>
              <th>Colors Grouped</th>
              <th>Total Weight (g)</th>
              <th>Total PCS</th>
              <th>Total CTS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="loading-row">
                <td colSpan="6">Loading summary data...</td>
              </tr>
            ) : summary.length === 0 ? (
              <tr className="no-data-row">
                <td colSpan="6">No summary data found for the current filters.</td>
              </tr>
            ) : (
              <>
                {summary.map((item, index) => (
                  <tr key={index}>
                    <td>{item.type}</td>
                    <td>{item.sizes.join(", ")}</td>
                    <td>{item.colors.join(", ")}</td>
                    <td>{item.totalWeight.toFixed(2)}</td>
                    <td>{item.totalPCS}</td>
                    <td>{item.totalCTS.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="grand-total-row">
                  <td>GRAND TOTAL</td>
                  <td></td>
                  <td></td>
                  <td>{grandTotalWeight.toFixed(2)}</td>
                  <td>{grandTotalPCS}</td>
                  <td>{grandTotalCTS.toFixed(2)}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SupplyLotSummary;
