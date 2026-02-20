import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Sidebar from "../Production & Process/Nav/Sidebar";
import "../Production & Process/Nav/Sidebar.css";
import "../Styles/DisplayProcess.css";

const CALIBRATE_URL = "http://localhost:5000/calibratelot";
const CALIBRATE_PROCEED_URL = "http://localhost:5000/calibrateproceed/proceed";
const CPLOT_URL = "http://localhost:5000/cplot";

const DataTable = ({
  title,
  data,
  filters,
  searchTerm,
  onProceed,
  onDelete,
  stepName,
  filterTarget,
  fetchData,
  calibraters,
}) => {
  const shouldFilter = filterTarget === stepName;

  const filterData = (data) =>
    data
      .filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .filter((item) => {
        if (!shouldFilter) return true;
        return (
          (!filters.type || item.type === filters.type) &&
          (!filters.size || item.size === filters.size) &&
          (!filters.shape || item.shape === filters.shape) &&
          (!filters.color_note || item.color_note === filters.color_note)
        );
      });

  const filteredData = filterData(data);

  return (
    <div style={{ 
      marginBottom: '30px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      {/* Table Header */}
      <div style={{
        padding: '20px 25px',
        backgroundColor: '#f8f9fa',
        borderBottom: '2px solid #e9ecef',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{
          margin: '0',
          color: '#495057',
          fontSize: '1.3rem',
          fontWeight: '600'
        }}>
          {title}
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{
            backgroundColor: '#007bff',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            {filteredData.length} Records
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div style={{
        overflowX: 'auto',
        maxHeight: '500px',
        overflowY: 'auto'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.95rem'
        }}>
        <thead style={{
          backgroundColor: '#f8f9fa',
          position: 'sticky',
          top: '0',
          zIndex: '10'
        }}>
          <tr>
            <th style={{
              padding: '15px 12px',
              textAlign: 'left',
              fontWeight: '600',
              color: '#495057',
              borderBottom: '2px solid #dee2e6',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Lot No</th>
            <th style={{
              padding: '15px 12px',
              textAlign: 'left',
              fontWeight: '600',
              color: '#495057',
              borderBottom: '2px solid #dee2e6',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Type</th>
            <th style={{
              padding: '15px 12px',
              textAlign: 'left',
              fontWeight: '600',
              color: '#495057',
              borderBottom: '2px solid #dee2e6',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Size</th>
            <th style={{
              padding: '15px 12px',
              textAlign: 'left',
              fontWeight: '600',
              color: '#495057',
              borderBottom: '2px solid #dee2e6',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Shape</th>
            <th style={{
              padding: '15px 12px',
              textAlign: 'left',
              fontWeight: '600',
              color: '#495057',
              borderBottom: '2px solid #dee2e6',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Color Note</th>
            {stepName === "Calibrate" && <th style={{
              padding: '15px 12px',
              textAlign: 'left',
              fontWeight: '600',
              color: '#495057',
              borderBottom: '2px solid #dee2e6',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Side</th>}
            {stepName === "Calibrate" && <th style={{
              padding: '15px 12px',
              textAlign: 'left',
              fontWeight: '600',
              color: '#495057',
              borderBottom: '2px solid #dee2e6',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Calibrater</th>}
            <th style={{
              padding: '15px 12px',
              textAlign: 'center',
              fontWeight: '600',
              color: '#495057',
              borderBottom: '2px solid #dee2e6',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>PCS</th>
            <th style={{
              padding: '15px 12px',
              textAlign: 'center',
              fontWeight: '600',
              color: '#495057',
              borderBottom: '2px solid #dee2e6',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>CTS</th>
            <th style={{
              padding: '15px 12px',
              textAlign: 'center',
              fontWeight: '600',
              color: '#495057',
              borderBottom: '2px solid #dee2e6',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan={stepName === "Calibrate" ? 10 : 8} style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: '#6c757d',
                fontSize: '1.1rem',
                fontStyle: 'italic',
                backgroundColor: '#f8f9fa'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    fontSize: '3rem',
                    color: '#dee2e6'
                  }}>📋</div>
                  <div>No records found matching the criteria</div>
                </div>
              </td>
            </tr>
          ) : (
            filteredData.map((item, index) => (
              <tr
                key={item._id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.closest('tr').style.backgroundColor = '#e3f2fd';
                }}
                onMouseLeave={(e) => {
                  e.target.closest('tr').style.backgroundColor = index % 2 === 0 ? '#fff' : '#f8f9fa';
                }}
              >
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #dee2e6',
                  fontWeight: '600',
                  color: '#007bff'
                }}>{item.lot_no}</td>
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #dee2e6',
                  color: '#495057'
                }}>{item.type}</td>
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #dee2e6',
                  color: '#495057'
                }}>{item.size}</td>
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #dee2e6',
                  color: '#495057'
                }}>{item.shape}</td>
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #dee2e6',
                  color: '#495057'
                }}>{item.color_note}</td>

                {stepName === "Calibrate" && (
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #dee2e6'
                  }}>
                    <select
                      value={item.side}
                      onChange={async (e) => {
                        const newSide = e.target.value;
                        try {
                          await axios.put(`${CALIBRATE_URL}/${item._id}`, {
                            side: newSide,
                          });
                          fetchData();
                        } catch (err) {
                          console.error("Failed to update side:", err);
                          alert("Update failed!");
                        }
                      }}
                      style={{
                        padding: '6px 8px',
                        fontSize: '0.9rem',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        backgroundColor: '#fff',
                        color: '#333',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Top">Top</option>
                      <option value="Bottom">Bottom</option>
                      <option value="Both">Both</option>
                    </select>
                  </td>
                )}

                {stepName === "Calibrate" && (
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #dee2e6'
                  }}>
                    <select
                      value={item.cal_id || ""}
                      onChange={async (e) => {
                        const selectedId = e.target.value;
                        const selectedCal = calibraters.find(
                          (c) => c.registrationId === selectedId
                        );
                        if (!selectedCal) return;
                        try {
                          await axios.put(`${CALIBRATE_URL}/${item._id}`, {
                            cal_id: selectedCal.registrationId,
                            cal_name: selectedCal.name,
                          });
                          fetchData();
                        } catch (err) {
                          console.error("Failed to update calibrater:", err);
                          alert("Update failed!");
                        }
                      }}
                      style={{
                        padding: '6px 8px',
                        fontSize: '0.9rem',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        backgroundColor: '#fff',
                        color: '#333',
                        cursor: 'pointer',
                        minWidth: '150px'
                      }}
                    >
                      <option value="">Select Calibrater</option>
                      {calibraters.map((cal) => (
                        <option
                          key={cal.registrationId}
                          value={cal.registrationId}
                        >
                          {cal.name} ({cal.registrationId})
                        </option>
                      ))}
                    </select>
                  </td>
                )}

                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #dee2e6',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#28a745'
                }}>{item.pcs}</td>
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #dee2e6',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#fd7e14'
                }}>{item.cts}</td>
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #dee2e6',
                  textAlign: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}>
                    {stepName === "Calibrate" && (
                      <button
                        onClick={() => onProceed(item)}
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          backgroundColor: '#28a745',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 4px rgba(40, 167, 69, 0.3)'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.backgroundColor = '#218838';
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.4)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = '#28a745';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 2px 4px rgba(40, 167, 69, 0.3)';
                        }}
                      >
                        Proceed
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(item._id, stepName)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(220, 53, 69, 0.3)'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#c82333';
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 8px rgba(220, 53, 69, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#dc3545';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 4px rgba(220, 53, 69, 0.3)';
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
        </div>
      </div>
  );
};

export default function CalibratePage() {
  const [calibrates, setCalibrates] = useState([]);
  const [calibrateProceeds, setCalibrateProceeds] = useState([]);
  const [calibraters, setCalibraters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTarget, setFilterTarget] = useState("Calibrate");
  const [filters, setFilters] = useState({
    type: "",
    size: "",
    shape: "",
    color_note: "",
  });

  const fetchData = useCallback(async () => {
    try {
      const [resCalibrates, resProceeds] = await Promise.all([
        axios.get(CALIBRATE_URL),
        axios.get(CALIBRATE_PROCEED_URL),
      ]);
      setCalibrates((resCalibrates.data.calibrateLot || []).slice().reverse());
      setCalibrateProceeds((resProceeds.data || []).slice().reverse());
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchCalibraters = useCallback(async () => {
    try {
      const res = await axios.get(`${CALIBRATE_URL}/calibraters`);
      setCalibraters(res.data || []);
    } catch (err) {
      console.error("Failed to fetch calibraters:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchCalibraters();
  }, [fetchData, fetchCalibraters]);

  const proceedItem = async (item) => {
  if (item.side !== "Both") {
    alert(
      `Lot ${item.lot_no} cannot proceed because its side is "${item.side}". Only "Both" sides can proceed.`
    );
    return;
  }
  if (!window.confirm(`Proceed Calibrate Lot ${item.lot_no}?`)) return;

  try {
    const { _id, ...data } = item; // Remove Calibrate _id

    // 1️⃣ Add to Calibrate Proceed table
    await axios.post(CALIBRATE_PROCEED_URL, data);

    // 2️⃣ Add to Cut & Polish table with default CP name and CP id
    const cpData = {
      ...data,
      cp_name: "Name",    // Replace with desired default
      cp_id: "LOT",                // Replace with desired default
    };
    await axios.post(CPLOT_URL, cpData);

    // 3️⃣ Delete from Calibrate table
    await axios.delete(`${CALIBRATE_URL}/${_id}`);

    // Refresh Calibrate table
    fetchData();
  } catch (err) {
    console.error(err);
    alert("Proceed failed!");
  }
};

  const deleteData = async (id, step) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      const url =
        step === "CalibrateProceed"
          ? `${CALIBRATE_PROCEED_URL}/${id}`
          : `${CALIBRATE_URL}/${id}`;
      await axios.delete(url);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Delete failed!");
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const uniqueValues = (data, field) => [
    ...new Set(data.map((item) => item[field]).filter(Boolean)),
  ];

  const targetData =
    filterTarget === "Calibrate" ? calibrates : calibrateProceeds;

  return (
    <div className="display-process-container">
      <Sidebar />
      <h1>Calibrate Management</h1>

      {/* Filters */}
      <div className="filters-section">
        <select
          value={filterTarget}
          onChange={(e) => setFilterTarget(e.target.value)}
        >
          <option value="Calibrate">Calibrate Table</option>
          <option value="CalibrateProceed">Calibrate Proceed Table</option>
        </select>

        <input
          type="text"
          placeholder={`Search in ${filterTarget} table...`}
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

      {/* Tables */}
      <DataTable
        title="Calibrate (Awaiting Proceed)"
        data={calibrates}
        filters={filters}
        searchTerm={searchTerm}
        onProceed={proceedItem}
        onDelete={deleteData}
        stepName="Calibrate"
        filterTarget={filterTarget}
        fetchData={fetchData}
        calibraters={calibraters}
      />

      <DataTable
        title="Calibrate Proceed (Completed)"
        data={calibrateProceeds}
        filters={filters}
        searchTerm={searchTerm}
        onProceed={() => {}}
        onDelete={deleteData}
        stepName="CalibrateProceed"
        filterTarget={filterTarget}
        fetchData={fetchData}
        calibraters={calibraters}
      />
    </div>
  );
}
