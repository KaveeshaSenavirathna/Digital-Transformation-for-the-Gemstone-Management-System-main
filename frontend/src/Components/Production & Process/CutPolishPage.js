import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Sidebar from "../Production & Process/Nav/Sidebar";
import "../Production & Process/Nav/Sidebar.css";
import "../Styles/DisplayProcess.css";

const CPLOT_URL = "http://localhost:5000/cplot";
const CPLOT_PROCEED_URL = "http://localhost:5000/cplotProceed/proceed";

export default function CutPolishPage() {
  const [cplots, setCPlots] = useState([]);
  const [cplotProceeds, setCPlotProceeds] = useState([]);
  const [gemCutters, setGemCutters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTarget, setFilterTarget] = useState("CPlot");
  const [filters, setFilters] = useState({
    type: "",
    size: "",
    shape: "",
    color_note: "",
  });

  // Fetch Cut & Polish Data
  const fetchData = useCallback(async () => {
    try {
      const [resCPlot, resProceed] = await Promise.all([
        axios.get(CPLOT_URL),
        axios.get(CPLOT_PROCEED_URL),
      ]);
      setCPlots((resCPlot.data.cpLot || []).slice().reverse());
      setCPlotProceeds((resProceed.data.cplotProceed || []).slice().reverse());
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  }, []);

  // Fetch Gem Cutters
  const fetchGemCutters = useCallback(async () => {
    try {
      const res = await axios.get(`${CPLOT_URL}/gemcutters`);
      setGemCutters(res.data || []);
    } catch (err) {
      console.error("Failed to fetch gem cutters:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchGemCutters();
  }, [fetchData, fetchGemCutters]);

  // Update Side
  const updateSide = async (id, newSide) => {
    try {
      await axios.put(`${CPLOT_URL}/${id}`, { side: newSide });
      fetchData();
    } catch (err) {
      console.error("Failed to update side:", err);
      alert("Update failed!");
    }
  };

  // Update CP Name & ID
  const updateCP = async (id, selectedId) => {
    const selectedCP = gemCutters.find((c) => c.registrationId === selectedId);
    if (!selectedCP) return;
    try {
      await axios.put(`${CPLOT_URL}/${id}`, {
        cp_id: selectedCP.registrationId,
        cp_name: selectedCP.name,
      });
      fetchData();
    } catch (err) {
      console.error("Failed to update CP:", err);
      alert("Update failed!");
    }
  };

  // Proceed
  const proceedItem = async (item) => {
    if (item.side !== "Both") {
      alert(
        `Lot ${item.lot_no} cannot proceed because its side is "${item.side}". Only "Both" sides can proceed.`
      );
      return;
    }
    if (!window.confirm(`Proceed Cut & Polish Lot ${item.lot_no}?`)) return;
    try {
      const { _id, ...data } = item;
      await axios.post(CPLOT_PROCEED_URL, data);
      await axios.delete(`${CPLOT_URL}/${_id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Proceed failed!");
    }
  };

  // Delete
  const deleteData = async (id, step) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      const url =
        step === "CPlotProceed"
          ? `${CPLOT_PROCEED_URL}/${id}`
          : `${CPLOT_URL}/${id}`;
      await axios.delete(url);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Delete failed!");
    }
  };

  // Filters
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  const uniqueValues = (data, field) => [
    ...new Set(data.map((item) => item[field]).filter(Boolean)),
  ];

  const filterData = (data) =>
    data
      .filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .filter(
        (item) =>
          (!filters.type || item.type === filters.type) &&
          (!filters.size || item.size === filters.size) &&
          (!filters.shape || item.shape === filters.shape) &&
          (!filters.color_note || item.color_note === filters.color_note)
      );

  const targetData = filterTarget === "CPlot" ? cplots : cplotProceeds;

  return (
    <div className="display-process-container">
      <Sidebar />
      <h1>Cut & Polish Management</h1>

      {/* Filters */}
      <div className="filters-section">
        <select
          value={filterTarget}
          onChange={(e) => setFilterTarget(e.target.value)}
        >
          <option value="CPlot">Cut & Polish (Awaiting Proceed)</option>
          <option value="CPlotProceed">Cut & Polish Proceed (Completed)</option>
        </select>

        <input
          type="text"
          placeholder={`Search in ${
            filterTarget === "CPlot" ? "Awaiting" : "Completed"
          } table...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">All Types</option>
          {uniqueValues(targetData, "type").map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        <select name="size" value={filters.size} onChange={handleFilterChange}>
          <option value="">All Sizes</option>
          {uniqueValues(targetData, "size").map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        <select name="shape" value={filters.shape} onChange={handleFilterChange}>
          <option value="">All Shapes</option>
          {uniqueValues(targetData, "shape").map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>

        <select
          name="color_note"
          value={filters.color_note}
          onChange={handleFilterChange}
        >
          <option value="">All Colors</option>
          {uniqueValues(targetData, "color_note").map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      </div>

      {/* Color Legend */}
      <div className="color-legend">
        <span>
          <div className="box color-top" /> Top
        </span>
        <span>
          <div className="box color-bottom" /> Bottom
        </span>
        <span>
          <div className="box color-both" /> Both
        </span>
      </div>

      {/* Awaiting Proceed Table */}
      <div className="data-table-container">
        <h2>
          Cut & Polish (Awaiting Proceed) ({filterData(cplots).length})
        </h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Lot No</th>
              <th>Type</th>
              <th>Size</th>
              <th>Shape</th>
              <th>Color Note</th>
              <th>Side</th>
              <th>CP Name</th>
              <th>PCS</th>
              <th>CTS</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filterData(cplots).length === 0 ? (
              <tr>
                <td colSpan={10}>No lots found.</td>
              </tr>
            ) : (
              filterData(cplots).map((item) => (
                <tr
                  key={item._id}
                  className={
                    item.side === "Top"
                      ? "row-top"
                      : item.side === "Bottom"
                      ? "row-bottom"
                      : "row-both"
                  }
                >
                  <td>{item.lot_no}</td>
                  <td>{item.type}</td>
                  <td>{item.size}</td>
                  <td>{item.shape}</td>
                  <td>{item.color_note}</td>
                  <td>
                    <select
                      value={item.side || "Top"}
                      onChange={(e) => updateSide(item._id, e.target.value)}
                    >
                      <option value="Top">Top</option>
                      <option value="Bottom">Bottom</option>
                      <option value="Both">Both</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={item.cp_id || ""}
                      onChange={(e) => updateCP(item._id, e.target.value)}
                    >
                      <option value="">Select Cutter</option>
                      {gemCutters.map((gc) => (
                        <option
                          key={gc.registrationId}
                          value={gc.registrationId}
                        >
                          {gc.name} ({gc.registrationId})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{item.pcs}</td>
                  <td>{item.cts}</td>
                  <td className="action-buttons">
                    <button
                      className="proceed"
                      onClick={() => proceedItem(item)}
                    >
                      Proceed
                    </button>
                    <button
                      className="delete"
                      onClick={() => deleteData(item._id, "CPlot")}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Proceed Table */}
      <div className="data-table-container">
        <h2>
          Cut & Polish Proceed (Completed) ({filterData(cplotProceeds).length})
        </h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Lot No</th>
              <th>Type</th>
              <th>Size</th>
              <th>Shape</th>
              <th>Color Note</th>
              <th>CP Name</th>
              <th>PCS</th>
              <th>CTS</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filterData(cplotProceeds).length === 0 ? (
              <tr>
                <td colSpan={9}>No lots found.</td>
              </tr>
            ) : (
              filterData(cplotProceeds).map((item) => (
                <tr key={item._id}>
                  <td>{item.lot_no}</td>
                  <td>{item.type}</td>
                  <td>{item.size}</td>
                  <td>{item.shape}</td>
                  <td>{item.color_note}</td>
                  <td>{item.cp_name}</td>
                  <td>{item.pcs}</td>
                  <td>{item.cts}</td>
                  <td className="action-buttons">
                    <button
                      className="delete"
                      onClick={() => deleteData(item._id, "CPlotProceed")}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
