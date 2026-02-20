import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "./Nav/Sidebar";
import "./Nav/Sidebar.css";
import "../Styles/DisplayProcess.css";

// Backend URLs
const PREFORM_URL = "http://localhost:5000/preformlot";
const PREFORM_PROCEED_URL = "http://localhost:5000/proceed";

const CALIBRATE_URL = "http://localhost:5000/calibratelot";
const CALIBRATE_PROCEED_URL = "http://localhost:5000/calibrate/proceed";

const DOP_URL = "http://localhost:5000/doplot";
const DOP_PROCEED_URL = "http://localhost:5000/dop/proceed";

const CPLOT_URL = "http://localhost:5000/cplot";
const CPLOT_PROCEED_URL = "http://localhost:5000/cplotP/proceed";

const OUTCOME_URL = "http://localhost:5000/outcome";

function Display_Process() {
  const [preforms, setPreforms] = useState([]);
  const [preformProceeds, setPreformProceeds] = useState([]);
  const [calibrates, setCalibrates] = useState([]);
  const [calibrateProceeds, setCalibrateProceeds] = useState([]);
  const [dops, setDops] = useState([]);
  const [dopProceeds, setDopProceeds] = useState([]);
  const [cplots, setCPlots] = useState([]);
  const [cplotProceeds, setCPlotProceeds] = useState([]);
  const [outcomes, setOutcomes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("overview");

  const fetchData = async (url, setter, key) => {
    try {
      const res = await axios.get(url);
      if (key) setter(res.data[key] || []);
      else setter(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPreformProceeds = async () => {
    try {
      const res = await axios.get(`${PREFORM_PROCEED_URL}/preform`);
      setPreformProceeds(res.data || []);
    } catch (err) {
      console.error("Error fetching preform proceeds:", err);
    }
  };

  useEffect(() => {
    fetchData(PREFORM_URL, setPreforms, "preformLot");
    fetchPreformProceeds();
    fetchData(CALIBRATE_URL, setCalibrates, "calibrateLot");
    fetchData(CALIBRATE_PROCEED_URL, setCalibrateProceeds);
    fetchData(DOP_URL, setDops, "dopLot");
    fetchData(DOP_PROCEED_URL, setDopProceeds);
    fetchData(CPLOT_URL, setCPlots, "cpLot");
    fetchData(CPLOT_PROCEED_URL, setCPlotProceeds, "cplotProceed");
    fetchData(OUTCOME_URL, setOutcomes);
  }, []);

  const deleteData = async (id, step) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    let url = "";
    let fetchFn = null;

    switch (step) {
      case "PreformProceed":
        url = `${PREFORM_PROCEED_URL}/${id}`;
        fetchFn = fetchPreformProceeds;
        break;
      case "CalibrateProceed":
        url = `${CALIBRATE_PROCEED_URL}/${id}`;
        fetchFn = () => fetchData(CALIBRATE_PROCEED_URL, setCalibrateProceeds);
        break;
      case "DOPProceed":
        url = `${DOP_PROCEED_URL}/${id}`;
        fetchFn = () => fetchData(DOP_PROCEED_URL, setDopProceeds);
        break;
      case "CPlotProceed":
        url = `${CPLOT_PROCEED_URL}/${id}`;
        fetchFn = () => fetchData(CPLOT_PROCEED_URL, setCPlotProceeds);
        break;
      default:
        return;
    }

    try {
      await axios.delete(url);
      if (fetchFn) fetchFn();
      alert("Record deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete. Check backend route or try again!");
    }
  };

  const proceedItem = async (item, postUrl, deleteUrl, fetchMain, fetchProceed) => {
    if (item.side && item.side !== "Both") {
      alert("Cannot proceed: Side must be 'Both'");
      return;
    }

    if (!window.confirm("Proceed this item?")) return;
    try {
      const { _id, ...cleanData } = item;
      await axios.post(postUrl, cleanData);
      await axios.delete(deleteUrl);
      fetchMain();
      fetchProceed();
      alert("Item moved to Proceed successfully!");
    } catch (err) {
      console.error("Proceed error:", err);
      alert("Failed to proceed item. Please check the backend.");
    }
  };

  const filterData = (data) =>
    data.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  const renderOverviewTable = (title, data, fields) => (
    <div className="table-container">
      <h3>{title} ({data.length} records)</h3>
      {data.length > 0 ? (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                {fields.map((f) => (
                  <th key={f}>
                    {f.replace(/_/g, " ").toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filterData(data).reverse().slice(0, 50).map((row, i) => (
                <tr key={i}>
                  {fields.map((f) => (
                    <td key={f}>
                      {row[f] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-data-message">No {title} data available</p>
      )}
      {data.length > 50 && (
        <p className="note-message">
          Showing latest 50 of {data.length} records (newest first). Switch to detailed view to see all records.
        </p>
      )}
    </div>
  );

  const renderDetailedTable = (
    title,
    data,
    proceedFn,
    deleteStep,
    viewPrefix,
    updatePrefix,
    columns,
    hideUpdateDelete = false
  ) => (
    <>
      <h2 id={title.replace(/\s+/g, '-').toLowerCase()}>{title} ({data.length} records)</h2>
      {data.length > 0 ? (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterData(data).reverse().map((item) => (
                <tr key={item._id}>
                  {columns.map((col) => (
                    <td key={col.key}>{item[col.key] || "-"}</td>
                  ))}
                  <td className="action-buttons">
                    <Link to={`/${viewPrefix}/${item._id}`}>
                      <button className="view">View</button>
                    </Link>
                    {!hideUpdateDelete && updatePrefix && (
                      <Link to={`/${updatePrefix}/${item._id}`}>
                        <button className="update">Update</button>
                      </Link>
                    )}
                    {!hideUpdateDelete && deleteStep && (
                      <button onClick={() => deleteData(item._id, deleteStep)} className="delete">
                        Delete
                      </button>
                    )}
                    {proceedFn && (
                      <button onClick={() => proceedFn(item)} className="proceed">
                        Proceed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-data-message">No {title} data available.</p>
      )}
    </>
  );

  return (
    <div className="display-process-container">
      <Sidebar />
        <div className="header-section">
          <h1>Process Data Management</h1>
          <div className="view-toggle-buttons-header">
            <button
              onClick={() => setCurrentView("overview")}
              className={`toggle-button ${currentView === "overview" ? "active" : ""}`}
            >
              📊 Data Overview
            </button>
            <button
              onClick={() => setCurrentView("detailed")}
              className={`toggle-button ${currentView === "detailed" ? "active" : ""}`}
            >
              ⚙️ Detailed Management
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search across all processes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        {currentView === "overview" && (
          <div>
            <h2>📈 Process Data Overview</h2>
            <div className="overview-cards">
              <div className="card card-preform">
                <h3>Preform</h3>
                <p className="count">{preforms.length}</p>
                <p className="label">Active Records</p>
              </div>
              <div className="card card-preform-proceed">
                <h3>Preform Proceed</h3>
                <p className="count">{preformProceeds.length}</p>
                <p className="label">Proceeded Records</p>
              </div>
              <div className="card card-calibrate">
                <h3>Calibrate</h3>
                <p className="count">{calibrates.length}</p>
                <p className="label">Active Records</p>
              </div>
              <div className="card card-calibrate-proceed">
                <h3>Calibrate Proceed</h3>
                <p className="count">{calibrateProceeds.length}</p>
                <p className="label">Proceeded Records</p>
              </div>
              <div className="card card-dop">
                <h3>DOP</h3>
                <p className="count">{dops.length}</p>
                <p className="label">Active Records</p>
              </div>
              <div className="card card-dop-proceed">
                <h3>DOP Proceed</h3>
                <p className="count">{dopProceeds.length}</p>
                <p className="label">Proceeded Records</p>
              </div>
              <div className="card card-cplot">
                <h3>Cut & Polish</h3>
                <p className="count">{cplots.length}</p>
                <p className="label">Active Records</p>
              </div>
              <div className="card card-cplot-proceed">
                <h3>Cut & Polish Proceed</h3>
                <p className="count">{cplotProceeds.length}</p>
                <p className="label">Proceeded Records</p>
              </div>
              <div className="card card-outcomes">
                <h3>Outcomes</h3>
                <p className="count">{outcomes.length}</p>
                <p className="label">Final Records</p>
              </div>
            </div>
            <div className="overview-tables">
              {renderOverviewTable("Preform", preforms, ["lot_no", "stone_code", "type", "size", "pcs"])}
              {renderOverviewTable("Preform Proceed", preformProceeds, ["step", "lot_no", "stone_code", "type", "size"])}
              {renderOverviewTable("Calibrate", calibrates, ["lot_no", "stone_code", "type", "size", "pcs"])}
              {renderOverviewTable("Calibrate Proceed", calibrateProceeds, ["step", "lot_no", "stone_code", "type", "size"])}
              {renderOverviewTable("DOP", dops, ["lot_no", "stone_code", "type", "size", "pcs"])}
              {renderOverviewTable("DOP Proceed", dopProceeds, ["step", "lot_no", "stone_code", "type", "size"])}
              {renderOverviewTable("Cut & Polish Outcome", outcomes, ["lot_no", "type", "color_note", "size", "pcs", "cts", "step"])}
            </div>
          </div>
        )}

        {currentView === "detailed" && (
          <div>
            <h2>⚙️ Detailed Process Management</h2>

            {renderDetailedTable(
              "Preform",
              preforms,
              (item) =>
                proceedItem(
                  item,
                  PREFORM_PROCEED_URL,
                  `${PREFORM_URL}/${item._id}`,
                  () => fetchData(PREFORM_URL, setPreforms, "preformLot"),
                  fetchPreformProceeds
                ),
              "Preform",
              "view_preform",
              "update_preform",
              [
                { key: "lot_no", label: "Lot No" },
                { key: "type", label: "Type" },
                { key: "size", label: "Size" },
                { key: "shape", label: "Shape" },
                { key: "color_note", label: "Color Note" },
                { key: "pcs", label: "PCS" },
                { key: "cts", label: "CTS" },
              ]
            )}
            ---
            {renderDetailedTable(
              "Preform Proceed",
              preformProceeds,
              null,
              "PreformProceed",
              "view_preform_proceed",
              "update_preform_proceed",
              [
                { key: "lot_no", label: "Lot No" },
                { key: "type", label: "Type" },
                { key: "size", label: "Size" },
                { key: "shape", label: "Shape" },
                { key: "color_note", label: "Color Note" },
                { key: "pcs", label: "PCS" },
                { key: "cts", label: "CTS" },
              ]
            )}
            ---
            {renderDetailedTable(
              "Calibrate",
              calibrates,
              (item) =>
                proceedItem(
                  item,
                  CALIBRATE_PROCEED_URL,
                  `${CALIBRATE_URL}/${item._id}`,
                  () => fetchData(CALIBRATE_URL, setCalibrates, "calibrateLot"),
                  () => fetchData(CALIBRATE_PROCEED_URL, setCalibrateProceeds)
                ),
              "Calibrate",
              "view_calibrate",
              "update_calibrate",
              [
                { key: "lot_no", label: "Lot No" },
                { key: "type", label: "Type" },
                { key: "size", label: "Size" },
                { key: "shape", label: "Shape" },
                { key: "color_note", label: "Color Note" },
                { key: "side", label: "Side" },
                { key: "pcs", label: "PCS" },
                { key: "cts", label: "CTS" },
              ]
            )}
            ---
            {renderDetailedTable(
              "Calibrate Proceed",
              calibrateProceeds,
              null,
              "CalibrateProceed",
              "view_calibrate_proceed",
              "update_calibrate_proceed",
              [
                { key: "lot_no", label: "Lot No" },
                { key: "stone_code", label: "Stone Code" },
                { key: "type", label: "Type" },
                { key: "size", label: "Size" },
                { key: "shape", label: "Shape" },
                { key: "color_note", label: "Color Note" },
                { key: "pcs", label: "PCS" },
                { key: "cts", label: "CTS" },
              ]
            )}
            ---
            {renderDetailedTable(
              "DOP",
              dops,
              (item) =>
                proceedItem(
                  item,
                  DOP_PROCEED_URL,
                  `${DOP_URL}/${item._id}`,
                  () => fetchData(DOP_URL, setDops, "dopLot"),
                  () => fetchData(DOP_PROCEED_URL, setDopProceeds)
                ),
              "DOP",
              "view_dop",
              "update_dop",
              [
                { key: "lot_no", label: "Lot No" },
                { key: "type", label: "Type" },
                { key: "size", label: "Size" },
                { key: "shape", label: "Shape" },
                { key: "color_note", label: "Color Note" },
                { key: "side", label: "Side" },
                { key: "pcs", label: "PCS" },
                { key: "cts", label: "CTS" },
              ]
            )}
            ---
            {renderDetailedTable(
              "DOP Proceed",
              dopProceeds,
              null,
              "DOPProceed",
              "view_dop_proceed",
              "update_dop_proceed",
              [
                { key: "lot_no", label: "Lot No" },
                { key: "type", label: "Type" },
                { key: "size", label: "Size" },
                { key: "shape", label: "Shape" },
                { key: "color_note", label: "Color Note" },
                { key: "pcs", label: "PCS" },
                { key: "cts", label: "CTS" },
              ]
            )}
            ---
            {renderDetailedTable(
              "Cut & Polish",
              cplots,
              (item) =>
                proceedItem(
                  item,
                  CPLOT_PROCEED_URL,
                  `${CPLOT_URL}/${item._id}`,
                  () => fetchData(CPLOT_URL, setCPlots, "cpLot"),
                  () => fetchData(CPLOT_PROCEED_URL, setCPlotProceeds, "cplotProceed")
                ),
              "CPlot",
              "view_cutpolish",
              "update_cutpolish",
              [
                { key: "lot_no", label: "Lot No" },
                { key: "type", label: "Type" },
                { key: "size", label: "Size" },
                { key: "shape", label: "Shape" },
                { key: "color_note", label: "Color Note" },
                { key: "side", label: "Side" },
                { key: "pcs", label: "PCS" },
                { key: "cts", label: "CTS" },
              ]
            )}
            ---
            {renderDetailedTable(
              "Cut & Polish Proceed",
              cplotProceeds,
              null,
              null,
              "view_cplot_proceed",
              null,
              [
                { key: "lot_no", label: "Lot No" },
                { key: "type", label: "Type" },
                { key: "size", label: "Size" },
                { key: "shape", label: "Shape" },
                { key: "color_note", label: "Color Note" },
                { key: "side", label: "Side" },
                { key: "pcs", label: "PCS" },
                { key: "cts", label: "CTS" },
              ],
              true
            )}
            ---
            {renderDetailedTable(
              "Final Outcomes",
              outcomes,
              null,
              null,
              "view_outcome",
              null,
              [
                { key: "lot_no", label: "Lot No" },
                { key: "type", label: "Type" },
                { key: "color_note", label: "Color Note" },
                { key: "size", label: "Size" },
                { key: "pcs", label: "PCS" },
                { key: "cts", label: "CTS" },
                { key: "step", label: "Step" },
              ],
              true
            )}
          </div>
        )}
    </div>
  );
}

export default Display_Process;