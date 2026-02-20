import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../MainInventroy/Nav/Sidebar";
import "../MainInventroy/Nav/Sidebar.css";
import "../Styles/DisplayProcess.css";
import dashboardLogger from "../utils/dashboardLogger";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// API Endpoints
const RAW_MATERIALS_URL = "http://localhost:5000/rawmaterials";
const SUPPLY_LOTS_URL = "http://localhost:5000/supplylot";
const NEW_LOTS_URL = "http://localhost:5000/newlot";

function InventoryDashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inventoryData, setInventoryData] = useState({
    rawMaterials: [],
    supplyLots: [],
    newLots: [],
    overview: {},
    suggestions: []
  });

  // Log dashboard access on component mount
  useEffect(() => {
    const userRole = localStorage.getItem('userRole') || 
                    localStorage.getItem('role') || 
                    'unknown';
    const userId = localStorage.getItem('userId') || 
                  localStorage.getItem('regId') || 
                  'anonymous';
    
    dashboardLogger.logDashboardAccess("Inventory Dashboard", userId, userRole);
    
    // Log specific Office Assistant access
    if (userRole === 'Office Assistant' || userRole === 'DASHBOARD_USER') {
      dashboardLogger.log("Office Assistant accessed Inventory Dashboard", "info", {
        userId: userId,
        userRole: userRole,
        dashboard: "Inventory Dashboard",
        timestamp: new Date().toISOString()
      });
    }
  }, []);

  // Fetch comprehensive inventory data
  const fetchInventoryData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch data with individual error handling for each endpoint
      const results = await Promise.allSettled([
        axios.get(RAW_MATERIALS_URL),
        axios.get(SUPPLY_LOTS_URL),
        axios.get(NEW_LOTS_URL)
      ]);

      // Extract data with fallbacks
      const rawMaterials = results[0].status === 'fulfilled' ? (results[0].value.data || []) : [];
      const supplyLots = results[1].status === 'fulfilled' ? (results[1].value.data || []) : [];
      const newLots = results[2].status === 'fulfilled' ? (results[2].value.data || []) : [];

      // Log any failed requests
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.warn(`API request ${index} failed:`, result.reason);
        }
      });

      // Analyze inventory overview
      const overview = analyzeInventoryOverview(rawMaterials, supplyLots, newLots);
      
      // Generate suggestions
      const suggestions = generateInventorySuggestions(rawMaterials, supplyLots, newLots, overview);

      setInventoryData({
        rawMaterials,
        supplyLots,
        newLots,
        overview,
        suggestions
      });

    } catch (err) {
      console.error('Error fetching inventory data:', err);
      if (err.response) {
        setError(`Server error: ${err.response.status} - ${err.response.data?.message || 'Failed to load inventory data'}`);
      } else if (err.request) {
        setError('Failed to connect to server. Please check if the server is running.');
      } else {
        setError('Failed to load inventory data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Analyze inventory overview
  const analyzeInventoryOverview = (rawMaterials, supplyLots, newLots) => {
    // Raw Materials Analysis
    const totalRawMaterials = rawMaterials.length;
    const totalRawValue = rawMaterials.reduce((sum, material) => sum + (material.price * material.quantity), 0);
    const lowStockMaterials = rawMaterials.filter(material => material.quantity <= 10);
    const expiringMaterials = rawMaterials.filter(material => {
      if (!material.expire_date) return false;
      const expireDate = new Date(material.expire_date);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return expireDate <= thirtyDaysFromNow;
    });

    // Supply Lots Analysis
    const totalSupplyLots = supplyLots.length;
    const totalSupplyPCS = supplyLots.reduce((sum, lot) => sum + (lot.pcs || 0), 0);
    const totalSupplyCTS = supplyLots.reduce((sum, lot) => sum + (lot.cts || 0), 0);
    const recentSupplies = supplyLots.filter(lot => {
      const supplyDate = new Date(lot.supply_date);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return supplyDate >= sevenDaysAgo;
    });

    // New Lots Analysis
    const totalNewLots = newLots.length;
    const totalNewPCS = newLots.reduce((sum, lot) => sum + (lot.pcs || 0), 0);
    const totalNewCTS = newLots.reduce((sum, lot) => sum + (lot.cts || 0), 0);
    const proceededLots = newLots.filter(lot => lot.proceeded);
    const pendingLots = newLots.filter(lot => !lot.proceeded);

    // Category Analysis
    const materialCategories = {};
    rawMaterials.forEach(material => {
      const category = material.category || 'Uncategorized';
      materialCategories[category] = (materialCategories[category] || 0) + material.quantity;
    });

    const stoneTypes = {};
    [...supplyLots, ...newLots].forEach(lot => {
      const type = lot.type || 'Unknown';
      stoneTypes[type] = (stoneTypes[type] || 0) + (lot.pcs || 0);
    });

    return {
      rawMaterials: {
        total: totalRawMaterials,
        totalValue: totalRawValue,
        lowStock: lowStockMaterials.length,
        expiring: expiringMaterials.length,
        categories: materialCategories
      },
      supplyLots: {
        total: totalSupplyLots,
        totalPCS: totalSupplyPCS,
        totalCTS: totalSupplyCTS,
        recent: recentSupplies.length
      },
      newLots: {
        total: totalNewLots,
        totalPCS: totalNewPCS,
        totalCTS: totalNewCTS,
        proceeded: proceededLots.length,
        pending: pendingLots.length
      },
      stoneTypes,
      overall: {
        totalInventoryValue: totalRawValue,
        totalItems: totalRawMaterials + totalSupplyLots + totalNewLots,
        processingEfficiency: totalNewLots > 0 ? (proceededLots.length / totalNewLots) * 100 : 0
      }
    };
  };

  // Generate inventory suggestions
  const generateInventorySuggestions = (rawMaterials, supplyLots, newLots, overview) => {
    const suggestions = [];

    // Low stock suggestions
    if (overview.rawMaterials.lowStock > 0) {
      suggestions.push({
        category: 'Stock Management',
        priority: 'High',
        title: 'Low Stock Alert',
        description: `${overview.rawMaterials.lowStock} raw materials are running low on stock.`,
        action: 'Review and reorder low stock materials',
        icon: '⚠️'
      });
    }

    // Expiring materials suggestions
    if (overview.rawMaterials.expiring > 0) {
      suggestions.push({
        category: 'Stock Management',
        priority: 'High',
        title: 'Expiring Materials',
        description: `${overview.rawMaterials.expiring} materials are expiring within 30 days.`,
        action: 'Use expiring materials first or extend shelf life',
        icon: '⏰'
      });
    }

    // Processing efficiency suggestions
    if (overview.overall.processingEfficiency < 70) {
      suggestions.push({
        category: 'Process Optimization',
        priority: 'Medium',
        title: 'Processing Efficiency',
        description: `Only ${overview.overall.processingEfficiency.toFixed(1)}% of new lots have been processed.`,
        action: 'Increase processing speed or review bottlenecks',
        icon: '⚡'
      });
    }

    // High-value inventory suggestions
    if (overview.rawMaterials.totalValue > 100000) {
      suggestions.push({
        category: 'Value Management',
        priority: 'Medium',
        title: 'High Inventory Value',
        description: `Total inventory value is $${overview.rawMaterials.totalValue.toLocaleString()}.`,
        action: 'Consider insurance review and security measures',
        icon: '💰'
      });
    }

    // Recent supply suggestions
    if (overview.supplyLots.recent > 0) {
      suggestions.push({
        category: 'Supply Management',
        priority: 'Low',
        title: 'Recent Supplies',
        description: `${overview.supplyLots.recent} new supplies received this week.`,
        action: 'Process recent supplies to maintain flow',
        icon: '📦'
      });
    }

    // Category diversification suggestions
    const categoryCount = Object.keys(overview.rawMaterials.categories).length;
    if (categoryCount < 3) {
      suggestions.push({
        category: 'Diversification',
        priority: 'Low',
        title: 'Limited Categories',
        description: `Only ${categoryCount} material categories in inventory.`,
        action: 'Consider diversifying material categories',
        icon: '📊'
      });
    }

    return suggestions.slice(0, 6); // Limit to top 6 suggestions
  };

  useEffect(() => {
    // Log dashboard access
    dashboardLogger.logDashboardAccess("Inventory Dashboard");
    fetchInventoryData();
  }, []);

  // Chart configurations
  const materialCategoryData = {
    labels: Object.keys(inventoryData.overview?.rawMaterials?.categories || {}),
    datasets: [
      {
        label: 'Quantity',
        data: Object.values(inventoryData.overview?.rawMaterials?.categories || {}),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const stoneTypeData = {
    labels: Object.keys(inventoryData.overview?.stoneTypes || {}),
    datasets: [
      {
        label: 'Pieces',
        data: Object.values(inventoryData.overview?.stoneTypes || {}),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const processingData = {
    labels: ['Processed', 'Pending'],
    datasets: [
      {
        label: 'Lots',
        data: [
          inventoryData.overview?.newLots?.proceeded || 0,
          inventoryData.overview?.newLots?.pending || 0
        ],
        backgroundColor: ['#4BC0C0', '#FF6384'],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  if (loading) {
    return (
      <div className="display-process-container">
        <Sidebar />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading Inventory Overview...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="display-process-container">
      <Sidebar />
      <h1>Main Inventory Dashboard</h1>

      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#ffe6e6', 
          border: '1px solid red', 
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong>Error:</strong> {error}
          </div>
          <button 
            onClick={fetchInventoryData}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '10px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Total Inventory Items</h3>
          <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: '#1976d2' }}>
            {inventoryData.overview?.overall?.totalItems || 0}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
            Raw Materials + Lots
          </p>
        </div>

        <div style={{ padding: '20px', backgroundColor: '#e8f5e8', borderRadius: '10px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#388e3c' }}>Total Inventory Value</h3>
          <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: '#388e3c' }}>
            ${(inventoryData.overview?.overall?.totalInventoryValue || 0).toLocaleString()}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
            Raw Materials Value
          </p>
        </div>

        <div style={{ padding: '20px', backgroundColor: '#fff3e0', borderRadius: '10px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#f57c00' }}>Processing Efficiency</h3>
          <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: inventoryData.overview?.overall?.processingEfficiency > 70 ? '#4caf50' : inventoryData.overview?.overall?.processingEfficiency > 50 ? '#ff9800' : '#f44336' }}>
            {(inventoryData.overview?.overall?.processingEfficiency || 0).toFixed(1)}%
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
            Lots Processed
          </p>
        </div>

        <div style={{ padding: '20px', backgroundColor: '#ffebee', borderRadius: '10px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#d32f2f' }}>Low Stock Items</h3>
          <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: inventoryData.overview?.rawMaterials?.lowStock > 0 ? '#f44336' : '#4caf50' }}>
            {inventoryData.overview?.rawMaterials?.lowStock || 0}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
            Need Reorder
          </p>
        </div>
      </div>

      {/* Detailed Overview */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#495057' }}>Inventory Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#e3f2fd',
            borderRadius: '10px',
            border: '2px solid #1976d2'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Raw Materials</h3>
            <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
              {inventoryData.overview?.rawMaterials?.total || 0}
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
              Total Items: {inventoryData.overview?.rawMaterials?.total || 0}
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
              Value: ${(inventoryData.overview?.rawMaterials?.totalValue || 0).toLocaleString()}
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
              Low Stock: {inventoryData.overview?.rawMaterials?.lowStock || 0} | Expiring: {inventoryData.overview?.rawMaterials?.expiring || 0}
            </p>
          </div>

          <div style={{ 
            padding: '20px', 
            backgroundColor: '#e8f5e8',
            borderRadius: '10px',
            border: '2px solid #388e3c'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Supply Lots</h3>
            <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#388e3c' }}>
              {inventoryData.overview?.supplyLots?.total || 0}
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
              Total Lots: {inventoryData.overview?.supplyLots?.total || 0}
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
              PCS: {inventoryData.overview?.supplyLots?.totalPCS || 0} | CTS: {inventoryData.overview?.supplyLots?.totalCTS || 0}
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
              Recent: {inventoryData.overview?.supplyLots?.recent || 0}
            </p>
          </div>

          <div style={{ 
            padding: '20px', 
            backgroundColor: '#fff3e0',
            borderRadius: '10px',
            border: '2px solid #f57c00'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>New Lots</h3>
            <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#f57c00' }}>
              {inventoryData.overview?.newLots?.total || 0}
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
              Total Lots: {inventoryData.overview?.newLots?.total || 0}
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
              PCS: {inventoryData.overview?.newLots?.totalPCS || 0} | CTS: {inventoryData.overview?.newLots?.totalCTS || 0}
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
              Processed: {inventoryData.overview?.newLots?.proceeded || 0} | Pending: {inventoryData.overview?.newLots?.pending || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {/* Material Categories Distribution */}
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>Material Categories Distribution</h3>
          <div style={{ height: '300px' }}>
            <Doughnut data={materialCategoryData} options={chartOptions} />
          </div>
        </div>

        {/* Stone Types Distribution */}
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>Stone Types Distribution</h3>
          <div style={{ height: '300px' }}>
            <Bar data={stoneTypeData} options={chartOptions} />
          </div>
        </div>

        {/* Processing Status */}
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>Processing Status</h3>
          <div style={{ height: '300px' }}>
            <Doughnut data={processingData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Suggestions Section */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#495057' }}>Intelligent Suggestions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
          {inventoryData.suggestions.map((suggestion, index) => (
            <div key={index} style={{ 
              padding: '20px', 
              backgroundColor: suggestion.priority === 'High' ? '#ffebee' : suggestion.priority === 'Medium' ? '#fff3e0' : '#e8f5e8',
              borderRadius: '10px',
              border: `2px solid ${suggestion.priority === 'High' ? '#f44336' : suggestion.priority === 'Medium' ? '#ff9800' : '#4caf50'}`
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                {suggestion.title}
                <span style={{ 
                  marginLeft: '10px',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  backgroundColor: suggestion.priority === 'High' ? '#f8d7da' : suggestion.priority === 'Medium' ? '#fff3cd' : '#d4edda',
                  color: suggestion.priority === 'High' ? '#721c24' : suggestion.priority === 'Medium' ? '#856404' : '#155724'
                }}>
                  {suggestion.priority}
                </span>
              </h4>
              <p style={{ margin: '0 0 15px 0', color: '#666', lineHeight: '1.5' }}>
                {suggestion.description}
              </p>
              <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#333' }}>
                <strong>Action:</strong> {suggestion.action}
              </p>
              <div style={{ textAlign: 'right' }}>
                <span style={{ 
                  backgroundColor: '#e9ecef',
                  color: '#495057',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  {suggestion.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InventoryDashboard;
