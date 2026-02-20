import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Finance/Nav/Sidebar";
import "../Styles/DisplayProcess.css";

const PRODUCTION_SALARY_URL = "http://localhost:5000/production-salaries";
const DAILY_SALARY_URL = "http://localhost:5000/daily-salaries";
const EMPLOYEES_URL = "http://localhost:5000/api/employees";

export default function PayData() {
  // Production Salary States
  const [productionSalaries, setProductionSalaries] = useState([]);
  const [productionForm, setProductionForm] = useState({
    stoneCode: "",
    type: "",
    pricePerPcs: "",
    description: ""
  });
  const [editingProduction, setEditingProduction] = useState(null);

  // Generate stone codes dynamically
  const generateStoneCodes = () => {
    const codes = [];
    // Generate SC001 to SC100
    for (let i = 1; i <= 100; i++) {
      codes.push(`SC${i.toString().padStart(3, '0')}`);
    }
    // Add some specific gemstone codes
    const gemstoneCodes = [
      "RUBY001", "RUBY002", "RUBY003", "RUBY004", "RUBY005",
      "SAP001", "SAP002", "SAP003", "SAP004", "SAP005",
      "EMR001", "EMR002", "EMR003", "EMR004", "EMR005",
      "DIA001", "DIA002", "DIA003", "DIA004", "DIA005",
      "TOP001", "TOP002", "TOP003", "TOP004", "TOP005",
      "GAR001", "GAR002", "GAR003", "GAR004", "GAR005",
      "AME001", "AME002", "AME003", "AME004", "AME005",
      "CIT001", "CIT002", "CIT003", "CIT004", "CIT005",
      "PER001", "PER002", "PER003", "PER004", "PER005",
      "AQU001", "AQU002", "AQU003", "AQU004", "AQU005",
      "TOU001", "TOU002", "TOU003", "TOU004", "TOU005",
      "OPA001", "OPA002", "OPA003", "OPA004", "OPA005",
      "TAN001", "TAN002", "TAN003", "TAN004", "TAN005",
      "SPI001", "SPI002", "SPI003", "SPI004", "SPI005",
      "JAD001", "JAD002", "JAD003", "JAD004", "JAD005",
      "TUR001", "TUR002", "TUR003", "TUR004", "TUR005"
    ];
    return [...codes, ...gemstoneCodes];
  };

  const stoneCodeOptions = generateStoneCodes();

  const typeOptions = [
    // Basic Gemstone Types
    "Ruby", "Sapphire", "Emerald", "Diamond", "Topaz", "Garnet", "Amethyst", "Citrine", 
    "Peridot", "Aquamarine", "Tourmaline", "Opal", "Tanzanite", "Spinel", "Jade", "Turquoise",
    "Onyx", "Moonstone", "Labradorite",
    
    // DOP (Dop Proceed) Types
    "DOP Ruby", "DOP Sapphire", "DOP Emerald", "DOP Diamond", "DOP Topaz", "DOP Garnet",
    "DOP Amethyst", "DOP Citrine", "DOP Peridot", "DOP Aquamarine", "DOP Tourmaline",
    "DOP Opal", "DOP Tanzanite", "DOP Spinel", "DOP Jade", "DOP Turquoise",
    
    // Cut & Polish Types
    "Cut & Polish Ruby", "Cut & Polish Sapphire", "Cut & Polish Emerald", "Cut & Polish Diamond",
    "Cut & Polish Topaz", "Cut & Polish Garnet", "Cut & Polish Amethyst", "Cut & Polish Citrine",
    "Cut & Polish Peridot", "Cut & Polish Aquamarine", "Cut & Polish Tourmaline",
    "Cut & Polish Opal", "Cut & Polish Tanzanite", "Cut & Polish Spinel",
    
    // Calibrate Types
    "Calibrate Ruby", "Calibrate Sapphire", "Calibrate Emerald", "Calibrate Diamond",
    "Calibrate Topaz", "Calibrate Garnet", "Calibrate Amethyst", "Calibrate Citrine",
    "Calibrate Peridot", "Calibrate Aquamarine", "Calibrate Tourmaline",
    
    // Preform Types
    "Preform Ruby", "Preform Sapphire", "Preform Emerald", "Preform Diamond",
    "Preform Topaz", "Preform Garnet", "Preform Amethyst", "Preform Citrine",
    "Preform Peridot", "Preform Aquamarine", "Preform Tourmaline"
  ];

  // Daily Salary States
  const [dailySalaries, setDailySalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [dailyForm, setDailyForm] = useState({
    employeeId: "",
    dailyRate: "",
    effectiveDate: new Date().toISOString().split('T')[0]
  });
  const [editingDaily, setEditingDaily] = useState(null);

  // Common States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("production"); // "production" or "daily"
  const [customStoneCode, setCustomStoneCode] = useState("");
  const [customType, setCustomType] = useState("");
  const [showCustomStoneCode, setShowCustomStoneCode] = useState(false);
  const [showCustomType, setShowCustomType] = useState(false);
  const [stoneCodeSearch, setStoneCodeSearch] = useState("");
  const [typeSearch, setTypeSearch] = useState("");

  // Filter options based on search
  const filteredStoneCodes = stoneCodeOptions.filter(code => 
    code.toLowerCase().includes(stoneCodeSearch.toLowerCase())
  );
  
  const filteredTypes = typeOptions.filter(type => 
    type.toLowerCase().includes(typeSearch.toLowerCase())
  );

  // Fetch data
  useEffect(() => {
    fetchProductionSalaries();
    fetchDailySalaries();
    fetchEmployees();
  }, []);

  const fetchProductionSalaries = async () => {
    try {
      const res = await axios.get(PRODUCTION_SALARY_URL);
      setProductionSalaries(res.data);
    } catch (err) {
      console.error("Error fetching production salaries:", err);
    }
  };

  const fetchDailySalaries = async () => {
    try {
      const res = await axios.get(DAILY_SALARY_URL);
      setDailySalaries(res.data);
    } catch (err) {
      console.error("Error fetching daily salaries:", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(EMPLOYEES_URL);
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  // Production Salary Functions
  const handleProductionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingProduction) {
        await axios.put(`${PRODUCTION_SALARY_URL}/${editingProduction._id}`, productionForm);
        setEditingProduction(null);
      } else {
        await axios.post(PRODUCTION_SALARY_URL, productionForm);
      }
      
      setProductionForm({ stoneCode: "", type: "", pricePerPcs: "", description: "" });
      fetchProductionSalaries();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save production salary");
    } finally {
      setLoading(false);
    }
  };

  const handleProductionEdit = (salary) => {
    setProductionForm({
      stoneCode: salary.stoneCode,
      type: salary.type,
      pricePerPcs: salary.pricePerPcs,
      description: salary.description || ""
    });
    setEditingProduction(salary);
    
    // Check if the values are custom (not in predefined options)
    setShowCustomStoneCode(!stoneCodeOptions.includes(salary.stoneCode));
    setShowCustomType(!typeOptions.includes(salary.type));
    setCustomStoneCode(!stoneCodeOptions.includes(salary.stoneCode) ? salary.stoneCode : "");
    setCustomType(!typeOptions.includes(salary.type) ? salary.type : "");
  };

  const handleProductionDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this production salary rate?")) return;
    
    try {
      await axios.delete(`${PRODUCTION_SALARY_URL}/${id}`);
      fetchProductionSalaries();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete production salary");
    }
  };

  // Daily Salary Functions
  const handleDailySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingDaily) {
        await axios.put(`${DAILY_SALARY_URL}/${editingDaily._id}`, dailyForm);
        setEditingDaily(null);
      } else {
        await axios.post(DAILY_SALARY_URL, dailyForm);
      }
      
      setDailyForm({ employeeId: "", dailyRate: "", effectiveDate: new Date().toISOString().split('T')[0] });
      fetchDailySalaries();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save daily salary");
    } finally {
      setLoading(false);
    }
  };

  const handleDailyEdit = (salary) => {
    setDailyForm({
      employeeId: salary.employeeId._id,
      dailyRate: salary.dailyRate,
      effectiveDate: salary.effectiveDate.split('T')[0]
    });
    setEditingDaily(salary);
  };

  const handleDailyDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this daily salary rate?")) return;
    
    try {
      await axios.delete(`${DAILY_SALARY_URL}/${id}`);
      fetchDailySalaries();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete daily salary");
    }
  };

  const cancelEdit = () => {
    setEditingProduction(null);
    setEditingDaily(null);
    setProductionForm({ stoneCode: "", type: "", pricePerPcs: "", description: "" });
    setDailyForm({ employeeId: "", dailyRate: "", effectiveDate: new Date().toISOString().split('T')[0] });
    setShowCustomStoneCode(false);
    setShowCustomType(false);
    setCustomStoneCode("");
    setCustomType("");
    setStoneCodeSearch("");
    setTypeSearch("");
  };

  return (
    <div className="display-process-container">
      <Sidebar />
      <h1>Pay Data Management</h1>

      {error && (
        <div style={{ color: 'red', margin: '10px 0', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab("production")}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: activeTab === "production" ? '#007bff' : '#f8f9fa',
            color: activeTab === "production" ? 'white' : 'black',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Production Salary Rates
        </button>
        <button
          onClick={() => setActiveTab("daily")}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === "daily" ? '#007bff' : '#f8f9fa',
            color: activeTab === "daily" ? 'white' : 'black',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Daily Salary Rates
        </button>
      </div>

      {activeTab === "production" ? (
        <div>
          {/* Production Salary Form */}
          <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>{editingProduction ? 'Edit Production Salary Rate' : 'Add Production Salary Rate'}</h3>
            <form onSubmit={handleProductionSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label>Stone Code *</label>
                  <input
                    type="text"
                    placeholder="Search stone codes..."
                    value={stoneCodeSearch}
                    onChange={(e) => setStoneCodeSearch(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '5px', marginBottom: '5px' }}
                  />
                  <select
                    value={productionForm.stoneCode}
                    onChange={(e) => {
                      if (e.target.value === "custom") {
                        setShowCustomStoneCode(true);
                        setProductionForm({...productionForm, stoneCode: ""});
                      } else {
                        setShowCustomStoneCode(false);
                        setProductionForm({...productionForm, stoneCode: e.target.value});
                      }
                    }}
                    required
                    style={{ width: '100%', padding: '8px' }}
                  >
                    <option value="">Select Stone Code</option>
                    {filteredStoneCodes.map((code) => (
                      <option key={code} value={code}>{code}</option>
                    ))}
                    <option value="custom">+ Add Custom Stone Code</option>
                  </select>
                  {showCustomStoneCode && (
                    <input
                      type="text"
                      placeholder="Enter custom stone code"
                      value={customStoneCode}
                      onChange={(e) => {
                        setCustomStoneCode(e.target.value);
                        setProductionForm({...productionForm, stoneCode: e.target.value});
                      }}
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                  )}
                </div>
                <div>
                  <label>Type *</label>
                  <input
                    type="text"
                    placeholder="Search types..."
                    value={typeSearch}
                    onChange={(e) => setTypeSearch(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '5px', marginBottom: '5px' }}
                  />
                  <select
                    value={productionForm.type}
                    onChange={(e) => {
                      if (e.target.value === "custom") {
                        setShowCustomType(true);
                        setProductionForm({...productionForm, type: ""});
                      } else {
                        setShowCustomType(false);
                        setProductionForm({...productionForm, type: e.target.value});
                      }
                    }}
                    required
                    style={{ width: '100%', padding: '8px' }}
                  >
                    <option value="">Select Type</option>
                    {filteredTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                    <option value="custom">+ Add Custom Type</option>
                  </select>
                  {showCustomType && (
                    <input
                      type="text"
                      placeholder="Enter custom type"
                      value={customType}
                      onChange={(e) => {
                        setCustomType(e.target.value);
                        setProductionForm({...productionForm, type: e.target.value});
                      }}
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                  )}
                </div>
                <div>
                  <label>Price per PCS *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productionForm.pricePerPcs}
                    onChange={(e) => setProductionForm({...productionForm, pricePerPcs: e.target.value})}
                    required
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>
                <div>
                  <label>Description</label>
                  <input
                    type="text"
                    value={productionForm.description}
                    onChange={(e) => setProductionForm({...productionForm, description: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>
              </div>
              <div>
                <button type="submit" disabled={loading} style={{ marginRight: '10px' }}>
                  {loading ? 'Saving...' : (editingProduction ? 'Update' : 'Add')}
                </button>
                {editingProduction && (
                  <button type="button" onClick={cancelEdit}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Production Salary Table */}
          <table className="data-table">
            <thead>
              <tr>
                <th>Stone Code</th>
                <th>Type</th>
                <th>Price per PCS</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productionSalaries.length === 0 ? (
                <tr>
                  <td colSpan="6">No production salary rates found</td>
                </tr>
              ) : (
                productionSalaries.map((salary) => (
                  <tr key={salary._id}>
                    <td>{salary.stoneCode}</td>
                    <td>{salary.type}</td>
                    <td>Rs. {salary.pricePerPcs}</td>
                    <td>{salary.description || '-'}</td>
                    <td>
                      <span style={{ 
                        color: salary.isActive ? 'green' : 'red',
                        fontWeight: 'bold'
                      }}>
                        {salary.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleProductionEdit(salary)}
                        style={{ marginRight: '5px', padding: '5px 10px' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleProductionDelete(salary._id)}
                        style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}
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
      ) : (
        <div>
          {/* Daily Salary Form */}
          <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>{editingDaily ? 'Edit Daily Salary Rate' : 'Add Daily Salary Rate'}</h3>
            <form onSubmit={handleDailySubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label>Employee *</label>
                  <select
                    value={dailyForm.employeeId}
                    onChange={(e) => setDailyForm({...dailyForm, employeeId: e.target.value})}
                    required
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} ({emp.registrationId}) - {emp.designation}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Daily Rate (Rs.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={dailyForm.dailyRate}
                    onChange={(e) => setDailyForm({...dailyForm, dailyRate: e.target.value})}
                    required
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>
                <div>
                  <label>Effective Date *</label>
                  <input
                    type="date"
                    value={dailyForm.effectiveDate}
                    onChange={(e) => setDailyForm({...dailyForm, effectiveDate: e.target.value})}
                    required
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>
              </div>
              <div>
                <button type="submit" disabled={loading} style={{ marginRight: '10px' }}>
                  {loading ? 'Saving...' : (editingDaily ? 'Update' : 'Add')}
                </button>
                {editingDaily && (
                  <button type="button" onClick={cancelEdit}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Daily Salary Table */}
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Registration ID</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Daily Rate</th>
                <th>Effective Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dailySalaries.length === 0 ? (
                <tr>
                  <td colSpan="8">No daily salary rates found</td>
                </tr>
              ) : (
                dailySalaries.map((salary) => (
                  <tr key={salary._id}>
                    <td>{salary.employeeName}</td>
                    <td>{salary.registrationId}</td>
                    <td>{salary.department}</td>
                    <td>{salary.designation}</td>
                    <td>Rs. {salary.dailyRate}</td>
                    <td>{new Date(salary.effectiveDate).toLocaleDateString()}</td>
                    <td>
                      <span style={{ 
                        color: salary.isActive ? 'green' : 'red',
                        fontWeight: 'bold'
                      }}>
                        {salary.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleDailyEdit(salary)}
                        style={{ marginRight: '5px', padding: '5px 10px' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDailyDelete(salary._id)}
                        style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}
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
      )}
    </div>
  );
}
