import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Sidebar from "../Production & Process/Nav/Sidebar";
import "../Styles/DisplayProcess.css";
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

const PREFORM_URL = "http://localhost:5000/preformlot";
const CALIBRATE_URL = "http://localhost:5000/calibratelot";
const DOP_URL = "http://localhost:5000/doplot";
const CPLOT_URL = "http://localhost:5000/cplot";

export default function RealTimeSimulation() {
  const [loading] = useState(false);
  const [error, setError] = useState(null);
  const [simulationData, setSimulationData] = useState({
    currentProduction: {},
    realTimeMetrics: {},
    productionFlow: [],
    equipmentStatus: {},
    alerts: [],
    performanceMetrics: {}
  });
  
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1000); // milliseconds
  const intervalRef = useRef(null);

  // Fetch real-time production data
  const fetchRealTimeData = async () => {
    try {
      const [preformRes, calibrateRes, dopRes, cplotRes] = await Promise.all([
        axios.get(PREFORM_URL),
        axios.get(CALIBRATE_URL),
        axios.get(DOP_URL),
        axios.get(CPLOT_URL)
      ]);

      const preformData = preformRes.data.preformLot || [];
      const calibrateData = calibrateRes.data.calibrateLot || [];
      const dopData = dopRes.data.dopLot || [];
      const cplotData = cplotRes.data.cpLot || [];

      // Calculate current production metrics
      const currentProduction = {
        preform: preformData.length,
        calibrate: calibrateData.length,
        dop: dopData.length,
        cutPolish: cplotData.length,
        total: preformData.length + calibrateData.length + dopData.length + cplotData.length
      };

      // Generate real-time metrics
      const realTimeMetrics = generateRealTimeMetrics(currentProduction);
      
      // Simulate production flow
      const productionFlow = simulateProductionFlow(currentProduction);
      
      // Equipment status simulation
      const equipmentStatus = simulateEquipmentStatus();
      
      // Generate alerts
      const alerts = generateAlerts(currentProduction, equipmentStatus);
      
      // Performance metrics
      const performanceMetrics = calculatePerformanceMetrics(currentProduction);

      setSimulationData({
        currentProduction,
        realTimeMetrics,
        productionFlow,
        equipmentStatus,
        alerts,
        performanceMetrics
      });

    } catch (err) {
      console.error('Error fetching real-time data:', err);
      setError('Failed to load real-time data. Please check if the server is running.');
    }
  };

  // Generate real-time metrics
  const generateRealTimeMetrics = (production) => {
    const now = new Date();
    const hour = now.getHours();
    
    // Simulate hourly production rates
    const hourlyRate = 10 + Math.random() * 20; // 10-30 per hour
    const efficiency = 0.7 + Math.random() * 0.3; // 70-100% efficiency
    
    return {
      currentHour: hour,
      hourlyProduction: Math.floor(hourlyRate * efficiency),
      dailyTarget: 200,
      dailyActual: Math.floor(production.total * 0.8), // Simulated daily actual
      efficiency: Math.floor(efficiency * 100),
      throughput: Math.floor(hourlyRate),
      qualityRate: 85 + Math.random() * 10, // 85-95% quality
      lastUpdated: now.toLocaleTimeString()
    };
  };

  // Simulate production flow
  const simulateProductionFlow = (production) => {
    const flow = [];
    const stages = ['preform', 'calibrate', 'dop', 'cutPolish'];
    
    stages.forEach((stage, index) => {
      const current = production[stage];
      const previous = index > 0 ? production[stages[index - 1]] : current;
      const next = index < stages.length - 1 ? production[stages[index + 1]] : current;
      
      flow.push({
        stage: stage.charAt(0).toUpperCase() + stage.slice(1),
        current: current,
        input: previous,
        output: next,
        processingTime: 2 + Math.random() * 4, // 2-6 hours
        queue: Math.max(0, current - next),
        status: current > next * 1.5 ? 'bottleneck' : current < next * 0.5 ? 'starving' : 'normal'
      });
    });
    
    return flow;
  };

  // Simulate equipment status
  const simulateEquipmentStatus = () => {
    const equipment = [
      'Preform Machine 1', 'Preform Machine 2', 'Calibrate Station A', 'Calibrate Station B',
      'DOP Machine 1', 'DOP Machine 2', 'Cutting Station 1', 'Cutting Station 2', 'Polishing Station 1', 'Polishing Station 2'
    ];
    
    const status = {};
    equipment.forEach(machine => {
      const random = Math.random();
      status[machine] = {
        status: random > 0.9 ? 'maintenance' : random > 0.8 ? 'idle' : 'running',
        efficiency: 70 + Math.random() * 30, // 70-100%
        temperature: 20 + Math.random() * 30, // 20-50°C
        vibration: Math.random() * 10, // 0-10
        lastMaintenance: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
      };
    });
    
    return status;
  };

  // Generate alerts
  const generateAlerts = (production, equipment) => {
    const alerts = [];
    
    // Production alerts
    if (production.preform > production.calibrate * 2) {
      alerts.push({
        type: 'warning',
        message: 'Preform stage has high backlog',
        timestamp: new Date().toLocaleTimeString(),
        severity: 'medium'
      });
    }
    
    if (production.cutPolish < production.dop * 0.5) {
      alerts.push({
        type: 'warning',
        message: 'Cut & Polish stage is underutilized',
        timestamp: new Date().toLocaleTimeString(),
        severity: 'low'
      });
    }
    
    // Equipment alerts
    Object.entries(equipment).forEach(([machine, status]) => {
      if (status.status === 'maintenance') {
        alerts.push({
          type: 'error',
          message: `${machine} requires maintenance`,
          timestamp: new Date().toLocaleTimeString(),
          severity: 'high'
        });
      }
      
      if (status.efficiency < 75) {
        alerts.push({
          type: 'warning',
          message: `${machine} efficiency below 75%`,
          timestamp: new Date().toLocaleTimeString(),
          severity: 'medium'
        });
      }
      
      if (status.temperature > 45) {
        alerts.push({
          type: 'warning',
          message: `${machine} temperature high (${status.temperature.toFixed(1)}°C)`,
          timestamp: new Date().toLocaleTimeString(),
          severity: 'medium'
        });
      }
    });
    
    return alerts.slice(0, 10); // Limit to 10 most recent alerts
  };

  // Calculate performance metrics
  const calculatePerformanceMetrics = (production) => {
    const total = production.total;
    const target = 100; // Daily target
    
    return {
      productionRate: total,
      targetAchievement: total > 0 ? Math.min((total / target) * 100, 100) : 0,
      stageDistribution: {
        preform: total > 0 ? (production.preform / total) * 100 : 0,
        calibrate: total > 0 ? (production.calibrate / total) * 100 : 0,
        dop: total > 0 ? (production.dop / total) * 100 : 0,
        cutPolish: total > 0 ? (production.cutPolish / total) * 100 : 0
      },
      bottleneckStage: Object.entries(production).reduce((a, b) => production[a[0]] > production[b[0]] ? a : b)[0],
      flowEfficiency: 85 + Math.random() * 10 // 85-95%
    };
  };

  // Start/Stop simulation
  const toggleSimulation = () => {
    if (isSimulationRunning) {
      clearInterval(intervalRef.current);
      setIsSimulationRunning(false);
    } else {
      fetchRealTimeData(); // Initial fetch
      intervalRef.current = setInterval(fetchRealTimeData, simulationSpeed);
      setIsSimulationRunning(true);
    }
  };

  // Change simulation speed
  const changeSimulationSpeed = (speed) => {
    setSimulationSpeed(speed);
    if (isSimulationRunning) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(fetchRealTimeData, speed);
    }
  };

  useEffect(() => {
    fetchRealTimeData(); // Initial load
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Chart configurations
  const productionFlowData = {
    labels: (simulationData.productionFlow || []).map(item => item.stage),
    datasets: [
      {
        label: 'Current Queue',
        data: (simulationData.productionFlow || []).map(item => item.current),
        backgroundColor: '#36A2EB',
        borderWidth: 2,
        borderColor: '#fff'
      },
      {
        label: 'Processing Time (hrs)',
        data: (simulationData.productionFlow || []).map(item => item.processingTime),
        backgroundColor: '#FF6384',
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const equipmentStatusData = {
    labels: Object.keys(simulationData.equipmentStatus),
    datasets: [
      {
        label: 'Efficiency %',
        data: Object.values(simulationData.equipmentStatus).map(item => item.efficiency),
        backgroundColor: Object.values(simulationData.equipmentStatus).map(item => 
          item.efficiency > 90 ? '#4CAF50' : item.efficiency > 75 ? '#FF9800' : '#F44336'
        ),
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const performanceData = {
    labels: ['Target Achievement', 'Flow Efficiency', 'Quality Rate'],
    datasets: [
      {
        data: [
          simulationData.performanceMetrics.targetAchievement,
          simulationData.performanceMetrics.flowEfficiency,
          simulationData.realTimeMetrics.qualityRate
        ],
        backgroundColor: ['#36A2EB', '#4BC0C0', '#FFCE56'],
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
          <h2>Loading Real-Time Simulation...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="display-process-container">
      <Sidebar />
      <h1>Real-Time Production Simulation</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px', padding: '10px', backgroundColor: '#ffe6e6', border: '1px solid red', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {/* Simulation Controls */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={toggleSimulation}
            style={{
              padding: '10px 20px',
              backgroundColor: isSimulationRunning ? '#dc3545' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {isSimulationRunning ? '⏸️ Stop Simulation' : '▶️ Start Simulation'}
          </button>
          
          <div>
            <label>Simulation Speed:</label>
            <select 
              value={simulationSpeed} 
              onChange={(e) => changeSimulationSpeed(parseInt(e.target.value))}
              style={{ marginLeft: '5px', padding: '5px' }}
            >
              <option value={500}>Fast (0.5s)</option>
              <option value={1000}>Normal (1s)</option>
              <option value={2000}>Slow (2s)</option>
              <option value={5000}>Very Slow (5s)</option>
            </select>
          </div>
          
          <div style={{ fontSize: '14px', color: '#666' }}>
            Last Updated: {simulationData.realTimeMetrics.lastUpdated}
          </div>
        </div>
      </div>

      {/* Real-Time Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#1976d2' }}>Current Production</h4>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
            {simulationData.currentProduction.total}
          </p>
          <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>Total Items</p>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '8px', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#388e3c' }}>Hourly Rate</h4>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
            {simulationData.realTimeMetrics.hourlyProduction}
          </p>
          <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>Items/Hour</p>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#fff3e0', borderRadius: '8px', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#f57c00' }}>Efficiency</h4>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
            {simulationData.realTimeMetrics.efficiency}%
          </p>
          <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>Current</p>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#f3e5f5', borderRadius: '8px', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#7b1fa2' }}>Quality Rate</h4>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
            {simulationData.realTimeMetrics.qualityRate?.toFixed(1)}%
          </p>
          <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>Quality</p>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#e1f5fe', borderRadius: '8px', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#0277bd' }}>Target Achievement</h4>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
            {simulationData.performanceMetrics.targetAchievement?.toFixed(1)}%
          </p>
          <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>Daily Target</p>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {/* Production Flow */}
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>Production Flow Status</h3>
          <div style={{ height: '300px' }}>
            <Bar data={productionFlowData} options={chartOptions} />
          </div>
        </div>

        {/* Equipment Status */}
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>Equipment Efficiency</h3>
          <div style={{ height: '300px' }}>
            <Bar data={equipmentStatusData} options={chartOptions} />
          </div>
        </div>

        {/* Performance Metrics */}
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>Performance Metrics</h3>
          <div style={{ height: '300px' }}>
            <Doughnut data={performanceData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Production Flow Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {(simulationData.productionFlow || []).map((stage, index) => (
          <div key={index} style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>{stage.stage}</h4>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <p><strong>Current Queue:</strong> {stage.current}</p>
              <p><strong>Processing Time:</strong> {stage.processingTime.toFixed(1)} hrs</p>
              <p><strong>Status:</strong> 
                <span style={{ 
                  color: stage.status === 'bottleneck' ? '#d32f2f' : 
                         stage.status === 'starving' ? '#f57c00' : '#388e3c',
                  fontWeight: 'bold'
                }}>
                  {stage.status.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts Section */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#495057' }}>Real-Time Alerts</h3>
        <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '8px' }}>
          {simulationData.alerts.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              No alerts at this time
            </div>
          ) : (
            (simulationData.alerts || []).map((alert, index) => (
              <div key={index} style={{ 
                padding: '10px 15px', 
                borderBottom: '1px solid #eee',
                backgroundColor: alert.severity === 'high' ? '#ffebee' : 
                                alert.severity === 'medium' ? '#fff3e0' : '#f3e5f5'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    fontWeight: 'bold',
                    color: alert.severity === 'high' ? '#d32f2f' : 
                           alert.severity === 'medium' ? '#f57c00' : '#7b1fa2'
                  }}>
                    {alert.type.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '12px', color: '#666' }}>{alert.timestamp}</span>
                </div>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>{alert.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
