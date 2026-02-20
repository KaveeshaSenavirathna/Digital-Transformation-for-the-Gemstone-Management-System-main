import React, { useState, useEffect } from 'react';
import Sidebar from '../Employee/Nav/Sidebar';
import '../Employee/Nav/Sidebar.css';
import '../Styles/Analytics.css';
// Temporarily using fallback components until dependencies are installed
// import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
// import { TrendingUp, TrendingDown, Users, AlertTriangle, Award, Target } from 'lucide-react';

// Fallback components for charts
const BarChart = ({ children, data }) => (
  <div className="chart-container">
    <div className="chart-placeholder">
      <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>📊 Work Quality Distribution</h4>
      {data && data.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {data.slice(0, 5).map((emp, idx) => (
            <div key={emp.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '8px 12px',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <span style={{ fontWeight: '500', color: '#374151' }}>{emp.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '60px', 
                  height: '8px', 
                  backgroundColor: '#e2e8f0', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${emp.workQuality}%`, 
                    height: '100%', 
                    backgroundColor: '#8b5cf6',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <span style={{ fontWeight: '600', color: '#8b5cf6', minWidth: '35px' }}>
                  {emp.workQuality}%
                </span>
              </div>
            </div>
          ))}
          {data.length > 5 && (
            <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '12px' }}>
              +{data.length - 5} more employees
            </div>
          )}
        </div>
      ) : (
        <div style={{ color: '#6b7280', textAlign: 'center' }}>No data available</div>
      )}
    </div>
  </div>
);
const Bar = () => null;
const ScatterChart = ({ children, data }) => (
  <div className="chart-container">
    <div className="chart-placeholder">
      <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>📈 Attendance vs Leave Percentage</h4>
      {data && data.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
          {data.slice(0, 6).map((emp, idx) => (
            <div key={emp.id} style={{ 
              padding: '8px',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                {emp.name.length > 8 ? emp.name.substring(0, 8) + '...' : emp.name}
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>
                Att: {emp.attendance}%
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280' }}>
                Leave: {emp.leavePercentage}%
              </div>
              <div style={{ 
                width: '100%', 
                height: '4px', 
                backgroundColor: '#e2e8f0', 
                borderRadius: '2px',
                marginTop: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${(emp.attendance / 100) * 100}%`, 
                  height: '100%', 
                  backgroundColor: '#6366f1',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
          ))}
          {data.length > 6 && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#6b7280', 
              fontSize: '12px',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              +{data.length - 6} more
            </div>
          )}
        </div>
      ) : (
        <div style={{ color: '#6b7280', textAlign: 'center' }}>No data available</div>
      )}
    </div>
  </div>
);
const Scatter = () => null;
const XAxis = () => null;
const YAxis = () => null;
const CartesianGrid = () => null;
const Tooltip = () => null;
const ResponsiveContainer = ({ children }) => <div className="chart-container">{children}</div>;

// Fallback components for icons
const TrendingUp = ({ size, className }) => <span className={className} style={{ fontSize: size || 24 }}>📈</span>;
const TrendingDown = ({ size, className }) => <span className={className} style={{ fontSize: size || 24 }}>📉</span>;
const Users = ({ size, className }) => <span className={className} style={{ fontSize: size || 24 }}>👥</span>;
const AlertTriangle = ({ size, className }) => <span className={className} style={{ fontSize: size || 24 }}>⚠️</span>;
const Award = ({ size, className }) => <span className={className} style={{ fontSize: size || 24 }}>🏆</span>;
const Target = ({ size, className }) => <span className={className} style={{ fontSize: size || 24 }}>🎯</span>;

const EmployeeAnalytics = () => {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState('');
  const [workQuality, setWorkQuality] = useState('');
  const [predictions, setPredictions] = useState(null);
  const [activeTab, setActiveTab] = useState('input');

  const predictLeavePercentage = (att, qual) => {
    const attendanceScore = att / 100;
    const qualityScore = qual / 100;
    
    const baseLeave = 15;
    const attendanceImpact = (1 - attendanceScore) * 12;
    const qualityImpact = (1 - qualityScore) * 8;
    const interactionEffect = (1 - attendanceScore) * (1 - qualityScore) * 5;
    
    return Math.max(2, Math.min(30, baseLeave + attendanceImpact + qualityImpact + interactionEffect));
  };

  const calculateSkillImprovement = (att, qual, leave) => {
    const engagementScore = (att + qual) / 2;
    const availabilityScore = 100 - leave * 2;
    
    return Math.min(100, (engagementScore * 0.6 + availabilityScore * 0.4));
  };

  const assessRetentionRisk = (att, qual, leave) => {
    if (att < 75 || qual < 60 || leave > 20) return 'High';
    if (att < 85 || qual < 75 || leave > 12) return 'Medium';
    return 'Low';
  };

  const handleAddEmployee = () => {
    const att = parseFloat(attendance);
    const qual = parseFloat(workQuality);
    
    if (!att || !qual || att < 1 || att > 100 || qual < 1 || qual > 100) {
      alert('Please enter valid values between 1 and 100');
      return;
    }

    const leave = predictLeavePercentage(att, qual);
    const skill = calculateSkillImprovement(att, qual, leave);
    const risk = assessRetentionRisk(att, qual, leave);

    const newEmp = {
      id: Date.now(),
      name: name || `Employee ${employees.length + 1}`,
      attendance: att,
      workQuality: qual,
      leavePercentage: parseFloat(leave.toFixed(2)),
      skillPotential: parseFloat(skill.toFixed(2)),
      retentionRisk: risk,
      productivity: parseFloat(((att * 0.4 + qual * 0.6) * (1 - leave/100)).toFixed(2))
    };

    const updated = [...employees, newEmp];
    setEmployees(updated);
    analyzePredictions(updated);
    
    setName('');
    setAttendance('');
    setWorkQuality('');
    setActiveTab('dashboard');
  };

  const analyzePredictions = (list) => {
    const sortedBySkill = [...list].sort((a, b) => b.skillPotential - a.skillPotential);
    
    const riskOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    const sortedByRisk = [...list].sort((a, b) => 
      riskOrder[b.retentionRisk] - riskOrder[a.retentionRisk] || 
      b.leavePercentage - a.leavePercentage
    );

    const avg = (arr, key) => (arr.reduce((sum, e) => sum + e[key], 0) / arr.length).toFixed(2);

    setPredictions({
      skillRanking: sortedBySkill,
      atRiskEmployees: sortedByRisk.filter(e => e.retentionRisk !== 'Low'),
      insights: {
        avgAttendance: avg(list, 'attendance'),
        avgQuality: avg(list, 'workQuality'),
        avgLeave: avg(list, 'leavePercentage'),
        highRiskCount: list.filter(e => e.retentionRisk === 'High').length
      }
    });
  };

  useEffect(() => {
    if (employees.length > 0) analyzePredictions(employees);
  }, [employees]);

  const getRiskColor = (r) => {
    return r === 'High' ? '#ef4444' : r === 'Medium' ? '#f59e0b' : '#10b981';
  };

  return (
    <div>
      
      <Sidebar />
      <div className="page-content">
        <div className="analytics-container">
          <div className="analytics-header">
            <h1 className="analytics-title">
              Employee Performance Analytics System
            </h1>
            <p className="analytics-subtitle">
              AI-Powered insights on attendance, work quality, leave patterns & skill development
            </p>
          </div>

          <div className="analytics-tabs">
            {['input', 'dashboard', 'predictions'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                disabled={tab !== 'input' && employees.length === 0}
                className={`analytics-tab ${activeTab === tab ? 'active' : ''}`}
              >
                {tab === 'input' ? 'Add Data' : tab === 'dashboard' ? 'Dashboard' : 'Predictions'}
              </button>
            ))}
          </div>

          {activeTab === 'input' && (
            <div className="analytics-card">
              <h2 className="analytics-section-title">Enter Employee Metrics</h2>
              <div className="analytics-input-grid">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="analytics-input"
                    placeholder="Enter employee name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Attendance Score (1-100)
                  </label>
                  <input
                    type="number"
                    value={attendance}
                    onChange={(e) => setAttendance(e.target.value)}
                    className="analytics-input"
                    placeholder="95% attendance = 95"
                    min="1"
                    max="100"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Research: 95%+ attendance correlates with 7.8% productivity increase
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Work Quality Score (1-100)
                  </label>
                  <input
                    type="number"
                    value={workQuality}
                    onChange={(e) => setWorkQuality(e.target.value)}
                    className="analytics-input"
                    placeholder="Performance rating out of 100"
                    min="1"
                    max="100"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    High quality work leads to enhanced leave benefits and skill opportunities
                  </p>
                </div>

                <button
                  onClick={handleAddEmployee}
                  className="analytics-primary-btn"
                >
                  Analyze & Predict
                </button>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && employees.length > 0 && predictions && (
            <div className="space-y-6">
              <div className="analytics-cards-grid">
                <div className="analytics-card">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="text-indigo-600" size={24} />
                    <span className="text-2xl font-bold text-gray-800">{employees.length}</span>
                  </div>
                  <p className="text-gray-600 font-semibold">Total Employees</p>
                </div>

                <div className="analytics-card">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="text-green-600" size={24} />
                    <span className="text-2xl font-bold text-gray-800">
                      {predictions.insights.avgAttendance}%
                    </span>
                  </div>
                  <p className="text-gray-600 font-semibold">Avg Attendance</p>
                </div>

                <div className="analytics-card">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="text-blue-600" size={24} />
                    <span className="text-2xl font-bold text-gray-800">
                      {predictions.insights.avgQuality}%
                    </span>
                  </div>
                  <p className="text-gray-600 font-semibold">Avg Work Quality</p>
                </div>

                <div className="analytics-card">
                  <div className="flex items-center justify-between mb-2">
                    <AlertTriangle className="text-red-600" size={24} />
                    <span className="text-2xl font-bold text-gray-800">
                      {predictions.insights.highRiskCount}
                    </span>
                  </div>
                  <p className="text-gray-600 font-semibold">High Risk</p>
                </div>
              </div>

              <div className="analytics-charts-grid">
                <div className="analytics-card">
                  <h3 className="analytics-section-title">
                    Attendance vs Leave Percentage
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart data={employees}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="attendance" name="Attendance" unit="%" />
                      <YAxis dataKey="leavePercentage" name="Leave" unit="%" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter dataKey="leavePercentage" fill="#6366f1" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>

                <div className="analytics-card">
                  <h3 className="analytics-section-title">
                    Work Quality Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={employees}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="workQuality" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="analytics-card">
                <h3 className="analytics-section-title">Employee Overview</h3>
                <div className="analytics-table-wrapper">
                  <table className="analytics-table">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left p-3 font-semibold">Name</th>
                        <th className="text-left p-3 font-semibold">Attendance</th>
                        <th className="text-left p-3 font-semibold">Quality</th>
                        <th className="text-left p-3 font-semibold">Leave %</th>
                        <th className="text-left p-3 font-semibold">Productivity</th>
                        <th className="text-left p-3 font-semibold">Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((emp) => (
                        <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3 font-medium">{emp.name}</td>
                          <td className="p-3">{emp.attendance}%</td>
                          <td className="p-3">{emp.workQuality}%</td>
                          <td className="p-3 font-semibold">{emp.leavePercentage}%</td>
                          <td className="p-3">{emp.productivity}</td>
                          <td className="p-3">
                            <span className={`risk-badge ${emp.retentionRisk === 'High' ? 'risk-high' : emp.retentionRisk === 'Medium' ? 'risk-medium' : 'risk-low'}`}>
                              {emp.retentionRisk}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'predictions' && predictions && (
            <div className="space-y-6">
              <div className="analytics-card">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="text-yellow-500" size={28} />
                  <h3 className="text-2xl font-bold text-gray-800">
                    Skill Improvement Potential Ranking
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Employees ranked by capacity for skill development based on engagement and availability
                </p>
                <div className="space-y-3">
                  {predictions.skillRanking.map((emp, idx) => (
                    <div
                      key={emp.id}
                      className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-lg hover:border-indigo-300 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-500' : 'bg-indigo-500'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{emp.name}</p>
                          <p className="text-sm text-gray-600">
                            Attendance: {emp.attendance}% | Quality: {emp.workQuality}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-indigo-600">
                          {emp.skillPotential}
                        </p>
                        <p className="text-sm text-gray-600">Skill Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="analytics-card">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="text-red-500" size={28} />
                  <h3 className="text-2xl font-bold text-gray-800">
                    Retention Risk Assessment - Likely to Leave
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Employees predicted to resign, prioritized by risk level
                </p>
                {predictions.atRiskEmployees.length === 0 ? (
                  <div className="text-center py-8 text-green-600 font-semibold">
                    No employees at significant risk. Excellent team performance!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {predictions.atRiskEmployees.map((emp) => (
                      <div
                        key={emp.id}
                        className="p-4 border-2 rounded-lg"
                        style={{ borderColor: getRiskColor(emp.retentionRisk) }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-gray-800 text-lg">{emp.name}</p>
                          <span
                            className="px-4 py-1 rounded-full text-sm font-bold text-white"
                            style={{ backgroundColor: getRiskColor(emp.retentionRisk) }}
                          >
                            {emp.retentionRisk} Risk
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-gray-600">Attendance</p>
                            <p className="font-semibold">{emp.attendance}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Work Quality</p>
                            <p className="font-semibold">{emp.workQuality}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Leave %</p>
                            <p className="font-semibold text-red-600">{emp.leavePercentage}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Skill Score</p>
                            <p className="font-semibold">{emp.skillPotential}</p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                          <p className="text-sm font-semibold text-gray-700">Recommended Actions:</p>
                          <ul className="text-sm text-gray-600 mt-1 space-y-1">
                            {emp.attendance < 85 && <li>• Implement attendance improvement plan</li>}
                            {emp.workQuality < 75 && <li>• Provide targeted skill training and mentoring</li>}
                            {emp.leavePercentage > 15 && <li>• Review workload and work-life balance</li>}
                            <li>• Schedule one-on-one engagement meeting</li>
                            <li>• Consider recognition programs or performance incentives</li>
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="analytics-insights">
                <h3 className="text-2xl font-bold mb-4">Research-Based Insights</h3>
                <div className="analytics-insights-grid">
                  <div className="analytics-insight">
                    <p className="font-semibold mb-2">Attendance Impact</p>
                    <p className="text-sm">
                      Companies with 95%+ attendance see 7.8% productivity boost. Below 85% results in 6.2% reduction.
                    </p>
                  </div>
                  <div className="analytics-insight">
                    <p className="font-semibold mb-2">Training ROI</p>
                    <p className="text-sm">
                      Organizations with training programs experience 17% productivity increase and 21% profit boost.
                    </p>
                  </div>
                  <div className="analytics-insight">
                    <p className="font-semibold mb-2">Skill Development</p>
                    <p className="text-sm">
                      94% of employees stay longer with companies investing in their development.
                    </p>
                  </div>
                  <div className="analytics-insight">
                    <p className="font-semibold mb-2">Leave Management</p>
                    <p className="text-sm">
                      Strategic leave policies supporting skill development improve retention by 30-50%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeAnalytics;