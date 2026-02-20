import React, { useState, useEffect } from 'react';
import Sidebar from '../Employee/Nav/Sidebar';
import '../Employee/Nav/Sidebar.css';
import axios from 'axios';

function Performance() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedUserName, setSelectedUserName] = useState('');
  const [performanceData, setPerformanceData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };
  
  const [inputs, setInputs] = useState({
    date: getTodayDate(),
    pcs: '',
    cts: '',
    lotNo: '',
    color: '',
    size: '',
    preformCts: '',
    reject: '',
    rejectPcs: '',
    size2mm: '',
    size3x2: '',
    size3mm: '',
    size4x3_5x3: '',
    size4mm: '',
    size5x4_6x4: '',
    size5mm: '',
    size6x5: '',
    size7x5: '',
    size8x5: '',
    size1Cts: '',
    size1_5Cts: '',
    size2Cts: '',
    size3Cts: '',
    size4x2_5x2_5: '',
    size6x3_7x3_5: '',
    size8x4_9x4_5: '',
    princess: '',
    bracket: '',
    octagon: ''
  });

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch performance data when user is selected
  useEffect(() => {
    if (selectedUser) {
      fetchPerformanceData();
    }
  }, [selectedUser]);

  // Check for existing data when user and date changes
  useEffect(() => {
    if (selectedUser && inputs.date && showForm) {
      checkExistingData();
    }
  }, [selectedUser, inputs.date, showForm]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setUsers(response.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      alert('Failed to fetch users');
    }
  };

  const fetchPerformanceData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/performance/${selectedUser}`);
      setPerformanceData(response.data.performances || []);
    } catch (err) {
      console.error('Error fetching performance data:', err);
      setPerformanceData([]);
    }
  };

  const checkExistingData = async () => {
    if (!selectedUser || !inputs.date) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/performance/${selectedUser}/${inputs.date}`);
      if (response.data.performance) {
        const existingData = response.data.performance;
        
        // Load existing data for editing
        setInputs({
          date: inputs.date, // Keep the selected date
          pcs: existingData.pcs || '',
          cts: existingData.cts || '',
          lotNo: existingData.lotNo || '',
          color: existingData.color || '',
          size: existingData.size || '',
          preformCts: existingData.preformCts || '',
          reject: existingData.reject || '',
          rejectPcs: existingData.rejectPcs || '',
          size2mm: existingData.size2mm || '',
          size3x2: existingData.size3x2 || '',
          size3mm: existingData.size3mm || '',
          size4x3_5x3: existingData.size4x3_5x3 || '',
          size4mm: existingData.size4mm || '',
          size5x4_6x4: existingData.size5x4_6x4 || '',
          size5mm: existingData.size5mm || '',
          size6x5: existingData.size6x5 || '',
          size7x5: existingData.size7x5 || '',
          size8x5: existingData.size8x5 || '',
          size1Cts: existingData.size1Cts || '',
          size1_5Cts: existingData.size1_5Cts || '',
          size2Cts: existingData.size2Cts || '',
          size3Cts: existingData.size3Cts || '',
          size4x2_5x2_5: existingData.size4x2_5x2_5 || '',
          size6x3_7x3_5: existingData.size6x3_7x3_5 || '',
          size8x4_9x4_5: existingData.size8x4_9x4_5 || '',
          princess: existingData.princess || '',
          bracket: existingData.bracket || '',
          octagon: existingData.octagon || ''
        });
        setIsEditMode(true);
        setEditingId(existingData._id);
      } else {
        // No existing data - switch to add mode
        setIsEditMode(false);
        setEditingId(null);
      }
    } catch (err) {
      // No existing data for this date
      setIsEditMode(false);
      setEditingId(null);
    }
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    
    if (userId) {
      const user = users.find(u => u._id === userId);
      setSelectedUserName(user ? user.name : '');
      setShowForm(true);
      // Reset inputs to default with today's date
      setInputs({
        date: getTodayDate(),
        pcs: '',
        cts: '',
        lotNo: '',
        color: '',
        size: '',
        preformCts: '',
        reject: '',
        rejectPcs: '',
        size2mm: '',
        size3x2: '',
        size3mm: '',
        size4x3_5x3: '',
        size4mm: '',
        size5x4_6x4: '',
        size5mm: '',
        size6x5: '',
        size7x5: '',
        size8x5: '',
        size1Cts: '',
        size1_5Cts: '',
        size2Cts: '',
        size3Cts: '',
        size4x2_5x2_5: '',
        size6x3_7x3_5: '',
        size8x4_9x4_5: '',
        princess: '',
        bracket: '',
        octagon: ''
      });
      setIsEditMode(false);
      setEditingId(null);
    } else {
      setSelectedUserName('');
      setShowForm(false);
      setPerformanceData([]);
    }
  };

  const validateNumberInput = (value) => {
    if (value === '') return true;
    // Check if the value is a positive integer
    const num = Number(value);
    return Number.isInteger(num) && num >= 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Only validate numeric fields (exclude color, lotNo, size, and date)
    if (name !== 'color' && name !== 'lotNo' && name !== 'size' && name !== 'date') {
      if (value !== '' && !validateNumberInput(value)) {
        alert('Please enter a valid non-negative whole number (no decimals allowed)');
        return;
      }
    }
    
    // For color field, only allow letters, spaces, and hyphens
    if (name === 'color' && value !== '') {
      const isValidColor = /^[A-Za-z\s-]*$/.test(value);
      if (!isValidColor) {
        alert('Color can only contain letters, spaces, and hyphens');
        return;
      }
    }
    
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFormData = () => {
    setInputs({
      date: inputs.date, // Keep the current date
      pcs: '',
      cts: '',
      lotNo: '',
      color: '',
      size: '',
      preformCts: '',
      reject: '',
      rejectPcs: '',
      size2mm: '',
      size3x2: '',
      size3mm: '',
      size4x3_5x3: '',
      size4mm: '',
      size5x4_6x4: '',
      size5mm: '',
      size6x5: '',
      size7x5: '',
      size8x5: '',
      size1Cts: '',
      size1_5Cts: '',
      size2Cts: '',
      size3Cts: '',
      size4x2_5x2_5: '',
      size6x3_7x3_5: '',
      size8x4_9x4_5: '',
      princess: '',
      bracket: '',
      octagon: ''
    });
    setIsEditMode(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputs.date) {
      alert('Please select a date');
      return;
    }
    
    try {
      // Convert date to UTC midnight for consistent date comparison
      const dateInput = new Date(inputs.date);
      const utcDate = new Date(Date.UTC(
        dateInput.getFullYear(),
        dateInput.getMonth(),
        dateInput.getDate(),
        0, 0, 0, 0
      ));
      
      console.log('Submitting date:', utcDate.toISOString());
      
      const sendData = {
        userId: selectedUser,
        userName: selectedUserName,
        ...inputs,
        date: utcDate.toISOString()
      };
      
      console.log('Sending data:', sendData);

      let response;
      if (isEditMode) {
        // Update existing record
        response = await axios.put(`http://localhost:5000/performance/${editingId}`, sendData);
        console.log('Update response:', response.data);
        alert('Performance data updated successfully!');
      } else {
        // Create new record
        response = await axios.post('http://localhost:5000/performance', sendData);
        console.log('Create response:', response.data);
        alert('Performance data added successfully!');
      }
      
      // Clear form data but keep date and user selection
      clearFormData();
      
      // Refresh performance data
      fetchPerformanceData();
    } catch (err) {
      console.error('Error saving performance:', err);
      
      if (err.response) {
        console.error('Server error response:', err.response.data);
        
        // Handle specific error cases
        const errorMessage = err.response.data?.message || err.response.data?.error || 'Unknown error';
        
        // If there's an existing record, show its date
        const existingDate = err.response.data?.existingDate;
        const dateInfo = existingDate ? 
          `\nExisting record date: ${new Date(existingDate).toLocaleDateString()}` : '';
          
        alert(`Error: ${errorMessage}${dateInfo}`);
      } else if (err.request) {
        // Request was made but no response received
        console.error('No response received:', err.request);
        alert('Network error: No response from server');
      } else {
        // Error in request setup
        console.error('Request setup error:', err.message);
        alert(`Error: ${err.message}`);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="display-process-container">
      <Sidebar />
      <div>
        <div style={{
          marginBottom: '30px',
          padding: '25px',
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #20c997',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              margin: '0 0 10px 0',
              color: '#495057',
              fontSize: '2rem',
              fontWeight: '600'
            }}>
              Performance Management
            </h1>
            <p style={{
              margin: '0',
              color: '#666',
              fontSize: '1rem'
            }}>
              Track and manage employee performance metrics and evaluations
            </p>
          </div>
        </div>
      
      {/* User Selection */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Select User</h2>
        <select 
          value={selectedUser} 
          onChange={handleUserChange}
          style={{ padding: '8px', fontSize: '16px', minWidth: '200px' }}
        >
          <option value="">Select a User</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.name} - {user.department}
            </option>
          ))}
        </select>
      </div>

      {/* Performance Entry Form */}
      {showForm && (
        <div style={{ marginBottom: '30px' }}>
          <h2>{isEditMode ? 'Edit' : 'Add'} Performance Data for {selectedUserName}</h2>
          {isEditMode && (
            <p style={{ color: 'orange', fontWeight: 'bold', marginBottom: '10px' }}>
              Editing existing data for selected date. Changes will update the current record.
            </p>
          )}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label><strong>Date:</strong></label>
              <br />
              <input
                type="date"
                name="date"
                value={inputs.date}
                onChange={handleInputChange}
                required
                style={{ padding: '5px', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h3>Basic Information</h3>
                
                <label>PCS:</label><br />
                <input type="number" name="pcs" value={inputs.pcs} onChange={handleInputChange} min="0" step="1" pattern="\d+" style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>CTS:</label><br />
                <input type="number" name="cts" value={inputs.cts} onChange={handleInputChange} min="0" step="1" pattern="\d+" style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>Lot No:</label><br />
                <input type="text" name="lotNo" value={inputs.lotNo} onChange={handleInputChange} style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>Color:</label><br />
                <input type="text" name="color" value={inputs.color} onChange={handleInputChange} pattern="[A-Za-z\s-]+" style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>Size:</label><br />
                <input type="text" name="size" value={inputs.size} onChange={handleInputChange} style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>Preform CTS:</label><br />
                <input type="number" name="preformCts" value={inputs.preformCts} onChange={handleInputChange} min="0" step="1" pattern="\d+" style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>Reject:</label><br />
                <input type="number" name="reject" value={inputs.reject} onChange={handleInputChange} min="0" step="1" pattern="\d+" style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>Reject PCS:</label><br />
                <input type="number" name="rejectPcs" value={inputs.rejectPcs} onChange={handleInputChange} min="0" step="1" pattern="\d+" style={{ width: '100%', marginBottom: '10px' }} /><br />
              </div>

              <div>
                <h3>Size Categories</h3>
                
                <label>2mm:</label><br />
                <input type="number" name="size2mm" value={inputs.size2mm} onChange={handleInputChange} min="0" step="1" pattern="\d+" style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>3*2:</label><br />
                <input type="number" name="size3x2" value={inputs.size3x2} onChange={handleInputChange} min="0" step="1" pattern="\d+" style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>3mm:</label><br />
                <input type="number" name="size3mm" value={inputs.size3mm} onChange={handleInputChange} min="0" step="1" pattern="\d+" style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>4*3-5*3:</label><br />
                <input type="number" name="size4x3_5x3" value={inputs.size4x3_5x3} onChange={handleInputChange} min="0" step="1" pattern="\d+" style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>4mm:</label><br />
                <input type="number" name="size4mm" value={inputs.size4mm} onChange={handleInputChange} min="0" step="1" pattern="\d+" style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>5*4-6*4:</label><br />
                <input type="number" name="size5x4_6x4" value={inputs.size5x4_6x4} onChange={handleInputChange} min="0" step="1" pattern="\d+" style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>5mm:</label><br />
                <input type="number" name="size5mm" value={inputs.size5mm} onChange={handleInputChange} min="0" step="1" pattern="\d+" style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>6*5:</label><br />
                <input type="number" name="size6x5" value={inputs.size6x5} onChange={handleInputChange} min="0" step="1" pattern="\d+" style={{ width: '100%', marginBottom: '10px' }} /><br />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              <div>
                <h3>Additional Sizes</h3>
                
                <label>7*5:</label><br />
                <input type="number" name="size7x5" value={inputs.size7x5} onChange={handleInputChange} min="0" style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>8*5:</label><br />
                <input type="number" name="size8x5" value={inputs.size8x5} onChange={handleInputChange} min="0" style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>1 Cts:</label><br />
                <input type="number" step="0.01" name="size1Cts" value={inputs.size1Cts} onChange={handleInputChange} min="0" style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>1.5 Cts:</label><br />
                <input type="number" step="0.01" name="size1_5Cts" value={inputs.size1_5Cts} onChange={handleInputChange} min="0" style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>2 Cts:</label><br />
                <input type="number" step="0.01" name="size2Cts" value={inputs.size2Cts} onChange={handleInputChange} min="0" style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>3 Cts:</label><br />
                <input type="number" step="0.01" name="size3Cts" value={inputs.size3Cts} onChange={handleInputChange} min="0" style={{ width: '100%', marginBottom: '10px' }} /><br />
              </div>

              <div>
                <h3>Special Categories</h3>
                
                <label>4*2-5*2.5:</label><br />
                <input type="number" name="size4x2_5x2_5" value={inputs.size4x2_5x2_5} onChange={handleInputChange} min="0" step="1" pattern="\d+" style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>6*3-7*3.5:</label><br />
                <input type="number" name="size6x3_7x3_5" value={inputs.size6x3_7x3_5} onChange={handleInputChange} min="0" step="1" pattern="\d+" style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>8*4-9*4.5:</label><br />
                <input type="number" name="size8x4_9x4_5" value={inputs.size8x4_9x4_5} onChange={handleInputChange} min="0" step="1" pattern="\d+" style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>Princess:</label><br />
                <input type="number" name="princess" value={inputs.princess} onChange={handleInputChange} min="0" step="1" pattern="\d+" style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>Bracket:</label><br />
                <input type="number" name="bracket" value={inputs.bracket} onChange={handleInputChange} min="0" step="1" pattern="\d+" style={{ width: '100%', marginBottom: '10px' }} /><br />

                <label>Octagon:</label><br />
                <input type="number" name="octagon" value={inputs.octagon} onChange={handleInputChange} min="0" step="1" pattern="\d+" style={{ width: '100%', marginBottom: '10px' }} /><br />
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                {isEditMode ? 'Update Performance Data' : 'Add Performance Data'}
              </button>
              
              {isEditMode && (
                <button type="button" onClick={clearFormData} style={{ marginLeft: '10px', padding: '10px 20px', fontSize: '16px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Performance History Table */}
      {selectedUser && performanceData.length > 0 && (
        <div>
          <h2>Performance History for {selectedUserName}</h2>
          <div style={{ overflowX: 'auto' }}>
            <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%', marginTop: '10px', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th>Date</th>
                  <th>PCS</th>
                  <th>CTS</th>
                  <th>Lot No</th>
                  <th>Color</th>
                  <th>Size</th>
                  <th>Preform CTS</th>
                  <th>Reject</th>
                  <th>Reject PCS</th>
                  <th>2mm</th>
                  <th>3*2</th>
                  <th>3mm</th>
                  <th>4*3-5*3</th>
                  <th>4mm</th>
                  <th>5*4-6*4</th>
                  <th>5mm</th>
                  <th>6*5</th>
                  <th>7*5</th>
                  <th>8*5</th>
                  <th>1 Cts</th>
                  <th>1.5 Cts</th>
                  <th>2 Cts</th>
                  <th>3 Cts</th>
                  <th>4*2-5*2.5</th>
                  <th>6*3-7*3.5</th>
                  <th>8*4-9*4.5</th>
                  <th>Princess</th>
                  <th>Bracket</th>
                  <th>Octagon</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((performance, index) => (
                  <tr key={index}>
                    <td>{formatDate(performance.date)}</td>
                    <td>{performance.pcs || '-'}</td>
                    <td>{performance.cts || '-'}</td>
                    <td>{performance.lotNo || '-'}</td>
                    <td>{performance.color || '-'}</td>
                    <td>{performance.size || '-'}</td>
                    <td>{performance.preformCts || '-'}</td>
                    <td>{performance.reject || '-'}</td>
                    <td>{performance.rejectPcs || '-'}</td>
                    <td>{performance.size2mm || '-'}</td>
                    <td>{performance.size3x2 || '-'}</td>
                    <td>{performance.size3mm || '-'}</td>
                    <td>{performance.size4x3_5x3 || '-'}</td>
                    <td>{performance.size4mm || '-'}</td>
                    <td>{performance.size5x4_6x4 || '-'}</td>
                    <td>{performance.size5mm || '-'}</td>
                    <td>{performance.size6x5 || '-'}</td>
                    <td>{performance.size7x5 || '-'}</td>
                    <td>{performance.size8x5 || '-'}</td>
                    <td>{performance.size1Cts || '-'}</td>
                    <td>{performance.size1_5Cts || '-'}</td>
                    <td>{performance.size2Cts || '-'}</td>
                    <td>{performance.size3Cts || '-'}</td>
                    <td>{performance.size4x2_5x2_5 || '-'}</td>
                    <td>{performance.size6x3_7x3_5 || '-'}</td>
                    <td>{performance.size8x4_9x4_5 || '-'}</td>
                    <td>{performance.princess || '-'}</td>
                    <td>{performance.bracket || '-'}</td>
                    <td>{performance.octagon || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedUser && performanceData.length === 0 && (
        <div>
          <h2>No Performance Data</h2>
          <p>No performance records found for {selectedUserName}.</p>
        </div>
      )}
      </div>
    </div>
  );
}

export default Performance;