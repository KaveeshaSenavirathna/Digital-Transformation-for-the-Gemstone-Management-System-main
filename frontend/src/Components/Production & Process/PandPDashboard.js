import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Production & Process/Nav/Sidebar";
import "../Production & Process/Nav/Sidebar.css";
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
import { Bar } from 'react-chartjs-2';

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

const PREFORM_URL = "http://localhost:5000/preformlot";
const CALIBRATE_URL = "http://localhost:5000/calibratelot";
const DOP_URL = "http://localhost:5000/doplot";
const CPLOT_URL = "http://localhost:5000/cplot";
const EMPLOYEE_URL = "http://localhost:5000/api/employees";
const ATTENDANCE_URL = "http://localhost:5000/employees/attendancesummary";

function PandPDashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [systemData, setSystemData] = useState({
    dailyOverview: {},
    weeklyOverview: {},
    monthlyOverview: {},
    productionLevels: {},
    suggestions: []
  });

  // Fetch comprehensive system data
  const fetchSystemData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch data with individual error handling for each endpoint
      const results = await Promise.allSettled([
        axios.get(PREFORM_URL),
        axios.get(CALIBRATE_URL),
        axios.get(DOP_URL),
        axios.get(CPLOT_URL),
        axios.get(EMPLOYEE_URL),
        axios.get(`${ATTENDANCE_URL}?month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`)
      ]);

      // Extract data with fallbacks
      const preformData = results[0].status === 'fulfilled' ? (results[0].value.data.preformLot || []) : [];
      const calibrateData = results[1].status === 'fulfilled' ? (results[1].value.data.calibrateLot || []) : [];
      const dopData = results[2].status === 'fulfilled' ? (results[2].value.data.dopLot || []) : [];
      const cplotData = results[3].status === 'fulfilled' ? (results[3].value.data.cpLot || []) : [];
        // const employees = results[4].status === 'fulfilled' ? (results[4].value.data || []) : [];
        // const attendanceData = results[5].status === 'fulfilled' ? (results[5].value.data.employeeSummary || []) : [];

      // Log any failed requests
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.warn(`API request ${index} failed:`, result.reason);
        }
      });

      // Analyze daily, weekly, monthly overviews
      const dailyOverview = analyzeTimeBasedOverview(preformData, calibrateData, dopData, cplotData, 'daily');
      const weeklyOverview = analyzeTimeBasedOverview(preformData, calibrateData, dopData, cplotData, 'weekly');
      const monthlyOverview = analyzeTimeBasedOverview(preformData, calibrateData, dopData, cplotData, 'monthly');
      
      // Analyze production levels
      const productionLevels = analyzeProductionLevels(preformData, calibrateData, dopData, cplotData);
      
      // Generate suggestions
      const suggestions = generateTimeBasedSuggestions(dailyOverview, weeklyOverview, monthlyOverview, productionLevels);

      setSystemData({
        dailyOverview,
        weeklyOverview,
        monthlyOverview,
        productionLevels,
        suggestions
      });

    } catch (err) {
      console.error('Error fetching system data:', err);
      if (err.response) {
        // Server responded with error status
        setError(`Server error: ${err.response.status} - ${err.response.data?.message || 'Failed to load system data'}`);
      } else if (err.request) {
        // Request was made but no response received
        setError('Failed to connect to server. Please check if the server is running.');
      } else {
        // Something else happened
        setError('Failed to load system data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Analyze time-based overview (daily, weekly, monthly)
  const analyzeTimeBasedOverview = (preform, calibrate, dop, cplot, period) => {
    const now = new Date();
    let startDate, endDate;
    
    if (period === 'daily') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    } else if (period === 'weekly') {
      const dayOfWeek = now.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysToMonday);
      endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 7);
    } else if (period === 'monthly') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    // Filter data based on time period (simulate based on creation date)
    const allData = [...preform, ...calibrate, ...dop, ...cplot];
    const filteredData = allData.filter(item => {
      const itemDate = new Date(item.createdAt || new Date());
      return itemDate >= startDate && itemDate < endDate;
    });

    const totalItems = filteredData.length;
    const totalPCS = filteredData.reduce((sum, item) => sum + (parseInt(item.pcs) || 0), 0);
    const totalCTS = filteredData.reduce((sum, item) => sum + (parseFloat(item.cts) || 0), 0);

    return {
      period,
      totalItems,
      totalPCS,
      totalCTS,
      averagePCS: totalItems > 0 ? totalPCS / totalItems : 0,
      averageCTS: totalItems > 0 ? totalCTS / totalItems : 0,
      efficiency: totalCTS > 0 ? (totalPCS / totalCTS) * 100 : 0,
      status: totalItems > 20 ? 'High' : totalItems > 10 ? 'Normal' : 'Low',
      target: period === 'daily' ? 25 : period === 'weekly' ? 150 : 500,
      achievement: totalItems > 0 ? Math.min((totalItems / (period === 'daily' ? 25 : period === 'weekly' ? 150 : 500)) * 100, 100) : 0
    };
  };

  // Analyze production levels across all stages
  const analyzeProductionLevels = (preform, calibrate, dop, cplot) => {
    const stages = [
      { name: 'Preform', data: preform, level: 1 },
      { name: 'Calibrate', data: calibrate, level: 2 },
      { name: 'DOP', data: dop, level: 3 },
      { name: 'Cut & Polish', data: cplot, level: 4 }
    ];

    const levels = {};
    stages.forEach(stage => {
      const totalPCS = stage.data.reduce((sum, item) => sum + (parseInt(item.pcs) || 0), 0);
      const totalCTS = stage.data.reduce((sum, item) => sum + (parseFloat(item.cts) || 0), 0);
      
      levels[`Level ${stage.level}`] = {
        stage: stage.name,
        level: stage.level,
        itemCount: stage.data.length,
        totalPCS,
        totalCTS,
        averagePCS: stage.data.length > 0 ? totalPCS / stage.data.length : 0,
        averageCTS: stage.data.length > 0 ? totalCTS / stage.data.length : 0,
        efficiency: totalCTS > 0 ? (totalPCS / totalCTS) * 100 : 0,
        status: stage.data.length > 15 ? 'High Volume' : stage.data.length > 8 ? 'Normal' : 'Low Volume',
        progress: Math.min((stage.data.length / 20) * 100, 100) // Assuming 20 as target
      };
    });

    return levels;
  };

  // Generate time-based suggestions
  const generateTimeBasedSuggestions = (daily, weekly, monthly, levels) => {
    const suggestions = [];
    
    // Daily suggestions
    if (daily.achievement < 80) {
      suggestions.push({
        category: 'Daily Production',
        priority: 'High',
        title: 'Daily Target Not Met',
        description: `Daily production is ${daily.achievement.toFixed(1)}% of target. Need to increase daily output.`,
        action: 'Review daily workflow and resource allocation',
        period: 'Daily'
      });
    }
    
    // Weekly suggestions
    if (weekly.achievement < 75) {
      suggestions.push({
        category: 'Weekly Production',
        priority: 'High',
        title: 'Weekly Target Below 75%',
        description: `Weekly production is ${weekly.achievement.toFixed(1)}% of target. Consider process optimization.`,
        action: 'Implement weekly production improvement plan',
        period: 'Weekly'
      });
    }
    
    // Monthly suggestions
    if (monthly.achievement < 70) {
      suggestions.push({
        category: 'Monthly Production',
        priority: 'Medium',
        title: 'Monthly Performance Review',
        description: `Monthly production is ${monthly.achievement.toFixed(1)}% of target. Long-term planning needed.`,
        action: 'Conduct monthly performance review and planning',
        period: 'Monthly'
      });
    }
    
    // Production level suggestions
    Object.entries(levels).forEach(([level, data]) => {
      if (data.progress < 60) {
        suggestions.push({
          category: 'Production Level',
          priority: 'Medium',
          title: `${data.stage} Level Optimization`,
          description: `${data.stage} stage is at ${data.progress.toFixed(1)}% capacity. Consider efficiency improvements.`,
          action: `Optimize ${data.stage} stage processes and workflow`,
          period: 'Level ' + data.level
        });
      }
    });
    
    // Efficiency suggestions
    if (daily.efficiency < 70) {
      suggestions.push({
        category: 'Efficiency',
        priority: 'High',
        title: 'Daily Efficiency Improvement',
        description: `Daily efficiency is ${daily.efficiency.toFixed(1)}%. Focus on quality and process optimization.`,
        action: 'Review daily processes and provide training',
        period: 'Daily'
      });
    }
    
    return suggestions.slice(0, 6); // Limit to top 6 suggestions
  };

  useEffect(() => {
    // Log dashboard access
    dashboardLogger.logDashboardAccess("Production Dashboard");
    fetchSystemData();
  }, []);

  // Chart configurations
  const timeBasedData = {
    labels: ['Daily', 'Weekly', 'Monthly'],
    datasets: [
      {
        label: 'Achievement %',
        data: [
          systemData.dailyOverview?.achievement || 0,
          systemData.weeklyOverview?.achievement || 0,
          systemData.monthlyOverview?.achievement || 0
        ],
        backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0'],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const productionLevelsData = {
    labels: Object.keys(systemData.productionLevels || {}),
    datasets: [
      {
        label: 'Progress %',
        data: Object.values(systemData.productionLevels || {}).map(level => level.progress),
        backgroundColor: ['#FF6384', '#FFCE56', '#4BC0C0', '#36A2EB'],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const efficiencyData = {
    labels: ['Daily', 'Weekly', 'Monthly'],
    datasets: [
      {
        label: 'Efficiency %',
        data: [
          systemData.dailyOverview?.efficiency || 0,
          systemData.weeklyOverview?.efficiency || 0,
          systemData.monthlyOverview?.efficiency || 0
        ],
        backgroundColor: '#4BC0C0',
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
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  if (loading) {
    return (
      <div className="display-process-container">
        <Sidebar />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading Production System Overview...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="display-process-container">
      <Sidebar />
      <h1>Production & Process System Overview</h1>

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
            onClick={fetchSystemData}
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

      {/* Time-Based Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '10px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Daily Production</h3>
          <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: systemData.dailyOverview?.achievement > 80 ? '#4caf50' : systemData.dailyOverview?.achievement > 60 ? '#ff9800' : '#f44336' }}>
            {systemData.dailyOverview?.achievement?.toFixed(1) || 0}%
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
            {systemData.dailyOverview?.totalItems || 0} items
          </p>
        </div>

        <div style={{ padding: '20px', backgroundColor: '#e8f5e8', borderRadius: '10px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#388e3c' }}>Weekly Production</h3>
          <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: systemData.weeklyOverview?.achievement > 80 ? '#4caf50' : systemData.weeklyOverview?.achievement > 60 ? '#ff9800' : '#f44336' }}>
            {systemData.weeklyOverview?.achievement?.toFixed(1) || 0}%
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
            {systemData.weeklyOverview?.totalItems || 0} items
          </p>
        </div>

        <div style={{ padding: '20px', backgroundColor: '#fff3e0', borderRadius: '10px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#f57c00' }}>Monthly Production</h3>
          <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: systemData.monthlyOverview?.achievement > 80 ? '#4caf50' : systemData.monthlyOverview?.achievement > 60 ? '#ff9800' : '#f44336' }}>
            {systemData.monthlyOverview?.achievement?.toFixed(1) || 0}%
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
            {systemData.monthlyOverview?.totalItems || 0} items
          </p>
        </div>

        <div style={{ padding: '20px', backgroundColor: '#f3e5f5', borderRadius: '10px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#7b1fa2' }}>Overall Efficiency</h3>
          <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: systemData.dailyOverview?.efficiency > 80 ? '#4caf50' : systemData.dailyOverview?.efficiency > 60 ? '#ff9800' : '#f44336' }}>
            {systemData.dailyOverview?.efficiency?.toFixed(1) || 0}%
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
            Daily Average
          </p>
        </div>
      </div>

      {/* Production Levels Overview */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#495057' }}>Production Levels Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {Object.entries(systemData.productionLevels || {}).map(([level, data]) => (
            <div key={level} style={{ 
              padding: '20px', 
              backgroundColor: data.progress > 80 ? '#e8f5e8' : data.progress > 60 ? '#fff3e0' : '#ffebee',
              borderRadius: '10px',
              border: `2px solid ${data.progress > 80 ? '#4caf50' : data.progress > 60 ? '#ff9800' : '#f44336'}`
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>{level} - {data.stage}</h3>
              <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: data.progress > 80 ? '#4caf50' : data.progress > 60 ? '#ff9800' : '#f44336' }}>
                {data.progress.toFixed(1)}%
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                {data.itemCount} items | {data.totalPCS} PCS
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                Status: {data.status}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {/* Time-Based Achievement */}
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>Time-Based Achievement</h3>
          <div style={{ height: '300px' }}>
            <Bar data={timeBasedData} options={chartOptions} />
          </div>
        </div>

        {/* Production Levels Progress */}
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>Production Levels Progress</h3>
          <div style={{ height: '300px' }}>
            <Bar data={productionLevelsData} options={chartOptions} />
          </div>
        </div>

        {/* Efficiency Comparison */}
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>Efficiency Comparison</h3>
          <div style={{ height: '300px' }}>
            <Bar data={efficiencyData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Time-Based & Production Level Suggestions */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#495057' }}>Production Suggestions & Recommendations</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {systemData.suggestions?.map((suggestion, index) => (
            <div key={index} style={{ 
              padding: '20px', 
              backgroundColor: suggestion.priority === 'High' ? '#ffebee' : suggestion.priority === 'Medium' ? '#fff3e0' : '#e8f5e8',
              borderRadius: '10px',
              border: `2px solid ${suggestion.priority === 'High' ? '#f44336' : suggestion.priority === 'Medium' ? '#ff9800' : '#4caf50'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: '0', color: '#495057' }}>{suggestion.title}</h4>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    backgroundColor: suggestion.priority === 'High' ? '#f44336' : suggestion.priority === 'Medium' ? '#ff9800' : '#4caf50',
                    color: 'white'
                  }}>
                    {suggestion.priority}
                  </span>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    backgroundColor: '#6c757d',
                    color: 'white'
                  }}>
                    {suggestion.period}
                  </span>
                </div>
              </div>
              <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
                {suggestion.description}
              </p>
              <div style={{ 
                padding: '8px 12px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '4px',
                fontSize: '13px',
                color: '#495057'
              }}>
                <strong>Action:</strong> {suggestion.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e9ecef', borderRadius: '10px' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#495057' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a href="/insertprocess" style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px' 
          }}>
            Add New Process
          </a>
          <a href="/displayproduction" style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px' 
          }}>
            View All Processes
          </a>
          <a href="/realtimesimulation" style={{ 
            padding: '10px 20px', 
            backgroundColor: '#17a2b8', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px' 
          }}>
            Real-Time Simulation
          </a>
        </div>
      </div>
    </div>
  );
}

export default PandPDashboard;
