import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Sidebar from "../Production & Process/Nav/Sidebar";
import "../Production & Process/Nav/Sidebar.css";
import "../Styles/DisplayProcess.css";

const PREFORM_URL = "http://localhost:5000/preformlot";
const PREFORM_PROCEED_URL = "http://localhost:5000/preformproceed";
// const CALIBRATE_URL = "http://localhost:5000/calibratelot"; // Calibrate table API

// 🔹 Reusable Table Component
const DataTable = ({
  title,
  data,
  filters,
  searchTerm,
  actions,
  onAction,
  onDelete,
  stepName,
}) => {
  // Filter + Search
  const filterData = (data) =>
    data
      .filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .filter((item) => {
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
                <td colSpan="8" style={{
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
                <tr key={item._id} style={{
                  backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.closest('tr').style.backgroundColor = '#e3f2fd';
                }}
                onMouseLeave={(e) => {
                  e.target.closest('tr').style.backgroundColor = index % 2 === 0 ? '#fff' : '#f8f9fa';
                }}>
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
                    {actions.includes("proceed") && (
                      <button
                        onClick={() => onAction(item)}
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
                    {actions.includes("delete") && (
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
                    )}
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

function PreformPage() {
  const [preforms, setPreforms] = useState([]);
  const [preformProceeds, setPreformProceeds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    filterTarget: "preform",
    type: "",
    size: "",
    shape: "",
    color_note: "",
  });

  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      const [resPreforms, resProceeds] = await Promise.all([
        axios.get(PREFORM_URL),
        axios.get(`${PREFORM_PROCEED_URL}/preform`),
      ]);
      setPreforms(resPreforms.data.preformLot || []);
      setPreformProceeds(resProceeds.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Proceed item
const proceedItem = async (item) => {
  if (!window.confirm(`Proceed Preform Lot ${item.lot_no} to the next stage?`)) return;

  try {
    const { _id, ...data } = item;

    // Add to Preform Proceed
    await axios.post(PREFORM_PROCEED_URL, data);

    // Add to Calibrate table with required fields
    await axios.post("http://localhost:5000/calibratelot", { 
      ...data, 
      side: "Both",
      cal_name: "Name",
      cal_id: "CAL",
    });

    // Delete from Preform table
    await axios.delete(`${PREFORM_URL}/${_id}`);

    // Refresh
    fetchData();
  } catch (err) {
    console.error(err);
    alert("Proceed failed! Check console for details.");
  }
};



  // Delete data
  const deleteData = async (id, step) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      const url =
        step === "PreformProceed"
          ? `${PREFORM_PROCEED_URL}/${id}`
          : `${PREFORM_URL}/${id}`;
      await axios.delete(url);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Delete failed!");
    }
  };

  // Filter change
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Unique value generator
  const uniqueValues = (data, field) => [
    ...new Set(data.map((item) => item[field]).filter(Boolean)),
  ];

  // Dataset selector for dropdowns
  const activeDataset =
    filters.filterTarget === "proceed" ? preformProceeds : preforms;

  return (
    <div className="display-process-container">
      <Sidebar />
      
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: '0 0 20px 0', color: '#495057', fontSize: '2rem', fontWeight: '600' }}>
          Preform Management
        </h1>
        <p style={{ margin: '0', color: '#666', fontSize: '1rem' }}>
          Manage preform lots and track processing status
        </p>
      </div>

      {/* Filters Card */}
      <div style={{ 
        padding: '25px', 
        backgroundColor: '#fff', 
        borderRadius: '10px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#495057', fontSize: '1.2rem', borderBottom: '2px solid #e9ecef', paddingBottom: '10px' }}>
          Filters & Search
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px',
          alignItems: 'end'
        }}>
          {/* Table Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#333' }}>
              Data View
            </label>
          <select
            name="filterTarget"
            value={filters.filterTarget}
            onChange={handleFilterChange}
              style={{
                padding: '10px 12px',
                fontSize: '1rem',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                backgroundColor: '#fff',
                color: '#333',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
          >
            <option value="preform">Preform (Awaiting Cut)</option>
            <option value="proceed">Preform Proceeded (Ready for Cut)</option>
          </select>
          </div>

          {/* Search Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#333' }}>
              Search
            </label>
          <input
            type="text"
            placeholder={`Search in ${
              filters.filterTarget === "proceed" ? "Proceeded" : "Preform"
            } table...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 12px',
                fontSize: '1rem',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                backgroundColor: '#fff',
                color: '#333',
                transition: 'border-color 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
          </div>

          {/* Filter dropdowns */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#333' }}>
              Type
            </label>
            <select 
              name="type" 
              value={filters.type} 
              onChange={handleFilterChange}
              style={{
                padding: '10px 12px',
                fontSize: '1rem',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                backgroundColor: '#fff',
                color: '#333',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            >
              <option value="">All Types</option>
              {uniqueValues(activeDataset, "type").map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#333' }}>
              Size
            </label>
            <select 
              name="size" 
              value={filters.size} 
              onChange={handleFilterChange}
              style={{
                padding: '10px 12px',
                fontSize: '1rem',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                backgroundColor: '#fff',
                color: '#333',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            >
              <option value="">All Sizes</option>
              {uniqueValues(activeDataset, "size").map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#333' }}>
              Shape
            </label>
            <select 
              name="shape" 
              value={filters.shape} 
              onChange={handleFilterChange}
              style={{
                padding: '10px 12px',
                fontSize: '1rem',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                backgroundColor: '#fff',
                color: '#333',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            >
              <option value="">All Shapes</option>
              {uniqueValues(activeDataset, "shape").map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#333' }}>
              Color
            </label>
            <select 
              name="color_note" 
              value={filters.color_note} 
              onChange={handleFilterChange}
              style={{
                padding: '10px 12px',
                fontSize: '1rem',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                backgroundColor: '#fff',
                color: '#333',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            >
              <option value="">All Colors</option>
              {uniqueValues(activeDataset, "color_note").map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tables */}
        <DataTable
          title="Preform (Awaiting Cut)"
          data={preforms}
          filters={filters.filterTarget === "preform" ? filters : {}}
          searchTerm={filters.filterTarget === "preform" ? searchTerm : ""}
          actions={["proceed", "delete"]}
          onAction={proceedItem}
          onDelete={deleteData}
          stepName="Preform"
        />

        <DataTable
          title="Preform Proceeded (Ready for Cut)"
          data={preformProceeds}
          filters={filters.filterTarget === "proceed" ? filters : {}}
          searchTerm={filters.filterTarget === "proceed" ? searchTerm : ""}
          actions={["delete"]}
          onAction={() => {}}
          onDelete={deleteData}
          stepName="PreformProceed"
        />
      </div>
    </div>
  );
}

export default PreformPage;
