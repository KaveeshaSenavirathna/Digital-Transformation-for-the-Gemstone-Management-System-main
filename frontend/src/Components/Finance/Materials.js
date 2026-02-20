import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Finance/Nav/Sidebar";
import "../Styles/DisplayProcess.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const RAW_MATERIALS_URL = "http://localhost:5000/rawmaterials";

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [monthlyReportData, setMonthlyReportData] = useState([]);

  // Fetch materials data
  const fetchMaterials = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(RAW_MATERIALS_URL);
      setMaterials(res.data);
      setFilteredMaterials(res.data);
      console.log('Materials fetched:', res.data);
    } catch (err) {
      console.error('Error fetching materials:', err);
      setError('Failed to fetch materials data. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = materials;
    
    // Apply search filter
    if (search) {
      filtered = filtered.filter(material =>
        material.material_name.toLowerCase().includes(search.toLowerCase()) ||
        material.category.toLowerCase().includes(search.toLowerCase()) ||
        (material.supplier && material.supplier.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (filterCategory) {
      filtered = filtered.filter(material =>
        material.category.toLowerCase().includes(filterCategory.toLowerCase())
      );
    }
    
    // Apply supplier filter
    if (filterSupplier) {
      filtered = filtered.filter(material =>
        material.supplier && material.supplier.toLowerCase().includes(filterSupplier.toLowerCase())
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'material_name':
          aValue = a.material_name.toLowerCase();
          bValue = b.material_name.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'arrival_date':
          aValue = new Date(a.arrival_date);
          bValue = new Date(b.arrival_date);
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredMaterials(filtered);
  }, [materials, search, filterCategory, filterSupplier, sortBy, sortOrder]);

  // Calculate summary statistics
  const totalMaterials = filteredMaterials.length;
  const totalValue = filteredMaterials.reduce((sum, material) => sum + (material.price * material.quantity), 0);
  const totalQuantity = filteredMaterials.reduce((sum, material) => sum + material.quantity, 0);
  const lowStockMaterials = filteredMaterials.filter(material => material.quantity <= 5).length;

  // Get unique categories and suppliers for filters
  const uniqueCategories = [...new Set(materials.map(material => material.category))];
  const uniqueSuppliers = [...new Set(materials.map(material => material.supplier).filter(Boolean))];

  // Category summary
  const categorySummary = filteredMaterials.reduce((acc, material) => {
    if (!acc[material.category]) {
      acc[material.category] = {
        count: 0,
        totalQuantity: 0,
        totalValue: 0
      };
    }
    acc[material.category].count++;
    acc[material.category].totalQuantity += material.quantity;
    acc[material.category].totalValue += material.price * material.quantity;
    return acc;
  }, {});

  const clearFilters = () => {
    setSearch("");
    setFilterCategory("");
    setFilterSupplier("");
  };

  // Generate monthly report
  const generateMonthlyReport = () => {
    const startDate = new Date(reportYear, reportMonth - 1, 1);
    const endDate = new Date(reportYear, reportMonth, 0, 23, 59, 59);
    
    // Filter materials added in the selected month
    const monthlyMaterials = materials.filter(material => {
      const materialDate = new Date(material.createdAt);
      return materialDate >= startDate && materialDate <= endDate;
    });
    
    setMonthlyReportData(monthlyMaterials);
    console.log(`Monthly report generated for ${reportMonth}/${reportYear}:`, monthlyMaterials);
  };

  // Download monthly report as PDF
  const downloadMonthlyReportPDF = () => {
    if (monthlyReportData.length === 0) {
      alert('No data available for the selected month. Please generate the report first.');
      return;
    }

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('GEMSTONE MANAGEMENT SYSTEM', 14, 22);
    doc.setFontSize(16);
    doc.text('Monthly Materials Report', 14, 32);
    doc.setFontSize(12);
    doc.text(`Report Period: ${reportMonth}/${reportYear}`, 14, 42);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 48);
    
    // Summary
    const totalMaterials = monthlyReportData.length;
    const totalValue = monthlyReportData.reduce((sum, material) => sum + (material.price * material.quantity), 0);
    const totalQuantity = monthlyReportData.reduce((sum, material) => sum + material.quantity, 0);
    
    doc.setFontSize(14);
    doc.text('Summary', 14, 60);
    doc.setFontSize(10);
    doc.text(`Total Materials Added: ${totalMaterials}`, 14, 70);
    doc.text(`Total Quantity: ${totalQuantity.toLocaleString()}`, 14, 76);
    doc.text(`Total Value: Rs. ${totalValue.toLocaleString()}`, 14, 82);
    
    // Table data
    const tableData = monthlyReportData.map(material => [
      material.material_name,
      material.category,
      material.quantity,
      material.unit_type,
      material.unit_value,
      `Rs. ${material.price?.toLocaleString()}`,
      `Rs. ${(material.price * material.quantity).toLocaleString()}`,
      material.supplier || 'N/A',
      material.arrival_date?.substring(0, 10),
      material.createdAt?.substring(0, 10)
    ]);
    
    // Table
    autoTable(doc, {
      head: [['Material Name', 'Category', 'Quantity', 'Unit', 'Unit Value', 'Price', 'Total Value', 'Supplier', 'Arrival Date', 'Added Date']],
      body: tableData,
      startY: 90,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
    
    // Category breakdown
    const categoryBreakdown = monthlyReportData.reduce((acc, material) => {
      if (!acc[material.category]) {
        acc[material.category] = { count: 0, totalValue: 0 };
      }
      acc[material.category].count++;
      acc[material.category].totalValue += material.price * material.quantity;
      return acc;
    }, {});
    
    if (Object.keys(categoryBreakdown).length > 0) {
      doc.setFontSize(14);
      doc.text('Category Breakdown', 14, doc.lastAutoTable.finalY + 20);
      doc.setFontSize(10);
      
      const categoryData = Object.entries(categoryBreakdown).map(([category, data]) => [
        category,
        data.count,
        `Rs. ${data.totalValue.toLocaleString()}`
      ]);
      
      autoTable(doc, {
        head: [['Category', 'Count', 'Total Value']],
        body: categoryData,
        startY: doc.lastAutoTable.finalY + 25,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] },
        columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 30 }, 2: { cellWidth: 50 } }
      });
    }
    
    // Footer
    doc.setFontSize(8);
    doc.text('This is a computer generated report.', 14, doc.lastAutoTable.finalY + 30);
    doc.text('For any queries, please contact Finance Department.', 14, doc.lastAutoTable.finalY + 37);
    
    doc.save(`materials_report_${reportMonth}_${reportYear}.pdf`);
  };

  // Download monthly report as Excel (CSV)
  const downloadMonthlyReportExcel = () => {
    if (monthlyReportData.length === 0) {
      alert('No data available for the selected month. Please generate the report first.');
      return;
    }

    const headers = [
      'Material Name', 'Category', 'Quantity', 'Unit Type', 'Unit Value', 
      'Price', 'Total Value', 'Supplier', 'Arrival Date', 'Added Date'
    ];
    
    const csvContent = [
      headers.join(','),
      ...monthlyReportData.map(material => [
        `"${material.material_name}"`,
        `"${material.category}"`,
        material.quantity,
        `"${material.unit_type}"`,
        material.unit_value,
        material.price,
        material.price * material.quantity,
        `"${material.supplier || ''}"`,
        `"${material.arrival_date?.substring(0, 10) || ''}"`,
        `"${material.createdAt?.substring(0, 10) || ''}"`
      ].join(','))
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `materials_report_${reportMonth}_${reportYear}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="display-process-container">
      <Sidebar />
      <h1>Materials Inventory</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px', padding: '10px', backgroundColor: '#ffe6e6', border: '1px solid red', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '8px', 
          minWidth: '150px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#1976d2' }}>Total Materials</h3>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>{totalMaterials}</p>
        </div>
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#e8f5e8', 
          borderRadius: '8px', 
          minWidth: '150px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#388e3c' }}>Total Value</h3>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
            Rs. {totalValue.toLocaleString()}
          </p>
        </div>
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#fff3e0', 
          borderRadius: '8px', 
          minWidth: '150px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#f57c00' }}>Total Quantity</h3>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
            {totalQuantity.toLocaleString()}
          </p>
        </div>
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#ffebee', 
          borderRadius: '8px', 
          minWidth: '150px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#d32f2f' }}>Low Stock</h3>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
            {lowStockMaterials}
          </p>
        </div>
      </div>


      {/* Filter Section */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 15px 0' }}>Filter Materials</h4>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
          <div>
            <label>Search:</label>
            <input
              type="text"
              placeholder="Search materials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ marginLeft: '5px', padding: '5px', minWidth: '200px' }}
            />
          </div>
          <div>
            <label>Category:</label>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ marginLeft: '5px', padding: '5px', minWidth: '150px' }}
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Supplier:</label>
            <select 
              value={filterSupplier} 
              onChange={(e) => setFilterSupplier(e.target.value)}
              style={{ marginLeft: '5px', padding: '5px', minWidth: '150px' }}
            >
              <option value="">All Suppliers</option>
              {uniqueSuppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Sort By:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ marginLeft: '5px', padding: '5px', minWidth: '120px' }}
            >
              <option value="createdAt">Date Added</option>
              <option value="material_name">Name</option>
              <option value="category">Category</option>
              <option value="quantity">Quantity</option>
              <option value="price">Price</option>
              <option value="arrival_date">Arrival Date</option>
            </select>
          </div>
          <div>
            <label>Order:</label>
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ marginLeft: '5px', padding: '5px', minWidth: '100px' }}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
          <button
            onClick={clearFilters}
            style={{
              padding: '5px 15px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear Filters
          </button>
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Showing {filteredMaterials.length} of {materials.length} materials
        </div>
      </div>

      {/* Materials Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading materials...</div>
      ) : filteredMaterials.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Material Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Unit Value</th>
              <th>Price</th>
              <th>Total Value</th>
              <th>Supplier</th>
              <th>Arrival Date</th>
              <th>Expire Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterials.map((material) => {
              const isLowStock = material.quantity <= 5;
              const isExpired = material.expire_date && new Date(material.expire_date) < new Date();
              const totalValue = material.price * material.quantity;
              
              return (
                <tr key={material._id} className={isLowStock ? "low-stock" : ""}>
                  <td style={{ fontWeight: 'bold' }}>{material.material_name}</td>
                  <td>{material.category}</td>
                  <td style={{ color: isLowStock ? 'red' : 'inherit', fontWeight: 'bold' }}>
                    {material.quantity}
                  </td>
                  <td>{material.unit_type}</td>
                  <td>{material.unit_value}</td>
                  <td>Rs. {material.price?.toLocaleString()}</td>
                  <td style={{ color: 'green', fontWeight: 'bold' }}>
                    Rs. {totalValue.toLocaleString()}
                  </td>
                  <td>{material.supplier || 'N/A'}</td>
                  <td>{material.arrival_date?.substring(0, 10)}</td>
                  <td style={{ color: isExpired ? 'red' : 'inherit' }}>
                    {material.expire_date?.substring(0, 10) || 'N/A'}
                  </td>
                  <td>
                    {isLowStock && <span style={{ color: 'red', fontWeight: 'bold' }}>Low Stock</span>}
                    {isExpired && <span style={{ color: 'red', fontWeight: 'bold' }}>Expired</span>}
                    {!isLowStock && !isExpired && <span style={{ color: 'green' }}>Good</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          No materials found matching the current filters.
        </div>
      )}

      {/* Category Summary */}
      {Object.keys(categorySummary).length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3>Category Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {Object.entries(categorySummary).map(([category, data]) => (
              <div key={category} style={{ 
                padding: '15px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px',
                border: '1px solid #dee2e6'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>{category}</h4>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  <p style={{ margin: '5px 0' }}>Materials: {data.count}</p>
                  <p style={{ margin: '5px 0' }}>Total Quantity: {data.totalQuantity.toLocaleString()}</p>
                  <p style={{ margin: '5px 0', fontWeight: 'bold', color: 'green' }}>
                    Total Value: Rs. {data.totalValue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Materials Report Section */}
      <div style={{ marginTop: '40px', padding: '20px', border: '2px solid #007bff', borderRadius: '8px', backgroundColor: '#f8f9ff' }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#007bff', textAlign: 'center' }}>📊 Monthly Materials Report</h2>
        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
          Generate comprehensive monthly reports for materials added in a specific month
        </p>
        
        {/* Month/Year Selection */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', justifyContent: 'center' }}>
          <div>
            <label style={{ fontWeight: 'bold' }}>Month:</label>
            <select 
              value={reportMonth} 
              onChange={(e) => setReportMonth(e.target.value)} 
              style={{ marginLeft: '5px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Year:</label>
            <select 
              value={reportYear} 
              onChange={(e) => setReportYear(e.target.value)} 
              style={{ marginLeft: '5px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {[...Array(10)].map((_, i) => {
                const yearOption = new Date().getFullYear() - 5 + i;
                return (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
          <button
            onClick={generateMonthlyReport}
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Generate Report
          </button>
          
          {monthlyReportData.length > 0 && (
            <>
              <button
                onClick={downloadMonthlyReportPDF}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                Download PDF
              </button>
              <button
                onClick={downloadMonthlyReportExcel}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                Download Excel
              </button>
            </>
          )}
        </div>

        {/* Monthly Report Summary */}
        {monthlyReportData.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#007bff' }}>Report Summary for {reportMonth}/{reportYear}</h3>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ 
                padding: '20px', 
                backgroundColor: '#e3f2fd', 
                borderRadius: '10px', 
                minWidth: '180px',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Materials Added</h3>
                <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold' }}>{monthlyReportData.length}</p>
              </div>
              <div style={{ 
                padding: '20px', 
                backgroundColor: '#e8f5e8', 
                borderRadius: '10px', 
                minWidth: '180px',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#388e3c' }}>Total Value</h3>
                <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold' }}>
                  Rs. {monthlyReportData.reduce((sum, material) => sum + (material.price * material.quantity), 0).toLocaleString()}
                </p>
              </div>
              <div style={{ 
                padding: '20px', 
                backgroundColor: '#fff3e0', 
                borderRadius: '10px', 
                minWidth: '180px',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#f57c00' }}>Total Quantity</h3>
                <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold' }}>
                  {monthlyReportData.reduce((sum, material) => sum + material.quantity, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Report Features Info */}
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Report Features:</h4>
          <ul style={{ margin: '0', paddingLeft: '20px', color: '#6c757d' }}>
            <li>Detailed materials added in selected month</li>
            <li>Financial summary with total values</li>
            <li>Category breakdown analysis</li>
            <li>Professional PDF format for presentations</li>
            <li>Excel format for further analysis</li>
            <li>Supplier and arrival date tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
