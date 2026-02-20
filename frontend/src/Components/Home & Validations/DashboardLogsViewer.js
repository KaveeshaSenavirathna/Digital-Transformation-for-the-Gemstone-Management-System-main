import React, { useState, useEffect } from 'react';
import dashboardLogger from '../utils/dashboardLogger';
import './DashboardLogsViewer.css';

function DashboardLogsViewer() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState({
    dashboard: '',
    user: '',
    dateRange: {
      start: '',
      end: ''
    }
  });
  const [viewMode, setViewMode] = useState('recent'); // recent, stats, filtered

  useEffect(() => {
    loadLogs();
    loadStats();
  }, []);

  const loadLogs = () => {
    const recentLogs = dashboardLogger.getRecentLogs(100);
    setLogs(recentLogs);
  };

  const loadStats = () => {
    const dashboardStats = dashboardLogger.getDashboardStats();
    setStats(dashboardStats);
  };

  const handleFilter = () => {
    let filteredLogs = dashboardLogger.logs;

    if (filter.dashboard) {
      filteredLogs = filteredLogs.filter(log => 
        log.dashboardName.toLowerCase().includes(filter.dashboard.toLowerCase())
      );
    }

    if (filter.user) {
      filteredLogs = filteredLogs.filter(log => 
        log.userId.toLowerCase().includes(filter.user.toLowerCase())
      );
    }

    if (filter.dateRange.start && filter.dateRange.end) {
      filteredLogs = filteredLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        const startDate = new Date(filter.dateRange.start);
        const endDate = new Date(filter.dateRange.end);
        return logDate >= startDate && logDate <= endDate;
      });
    }

    setLogs(filteredLogs.reverse());
    setViewMode('filtered');
  };

  const clearFilters = () => {
    setFilter({
      dashboard: '',
      user: '',
      dateRange: {
        start: '',
        end: ''
      }
    });
    loadLogs();
    setViewMode('recent');
  };

  const exportLogs = () => {
    dashboardLogger.exportLogs();
  };

  const clearAllLogs = () => {
    if (window.confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      dashboardLogger.clearLogs();
      setLogs([]);
      setStats({});
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getDashboardIcon = (dashboardName) => {
    const icons = {
      'Employee Dashboard': '👥',
      'Finance Dashboard': '💰',
      'Inventory Dashboard': '📦',
      'Production Dashboard': '🏭',
      'Customer Dashboard': '👤',
      'Certificate Dashboard': '📜',
      'Login Page': '🔐'
    };
    return icons[dashboardName] || '📊';
  };

  return (
    <div className="dashboard-logs-viewer">
      <div className="logs-header">
        <h1>📊 Dashboard Access Logs</h1>
        <div className="logs-controls">
          <button 
            className={`control-btn ${viewMode === 'recent' ? 'active' : ''}`}
            onClick={() => { setViewMode('recent'); loadLogs(); }}
          >
            Recent Logs
          </button>
          <button 
            className={`control-btn ${viewMode === 'stats' ? 'active' : ''}`}
            onClick={() => { setViewMode('stats'); loadStats(); }}
          >
            Statistics
          </button>
          <button 
            className={`control-btn ${viewMode === 'filtered' ? 'active' : ''}`}
            onClick={() => setViewMode('filtered')}
          >
            Filtered View
          </button>
        </div>
      </div>

      {viewMode === 'filtered' && (
        <div className="logs-filters">
          <div className="filter-row">
            <input
              type="text"
              placeholder="Filter by Dashboard"
              value={filter.dashboard}
              onChange={(e) => setFilter({...filter, dashboard: e.target.value})}
            />
            <input
              type="text"
              placeholder="Filter by User ID"
              value={filter.user}
              onChange={(e) => setFilter({...filter, user: e.target.value})}
            />
          </div>
          <div className="filter-row">
            <input
              type="date"
              placeholder="Start Date"
              value={filter.dateRange.start}
              onChange={(e) => setFilter({
                ...filter, 
                dateRange: {...filter.dateRange, start: e.target.value}
              })}
            />
            <input
              type="date"
              placeholder="End Date"
              value={filter.dateRange.end}
              onChange={(e) => setFilter({
                ...filter, 
                dateRange: {...filter.dateRange, end: e.target.value}
              })}
            />
          </div>
          <div className="filter-actions">
            <button className="filter-btn" onClick={handleFilter}>Apply Filters</button>
            <button className="filter-btn secondary" onClick={clearFilters}>Clear Filters</button>
          </div>
        </div>
      )}

      <div className="logs-actions">
        <button className="action-btn export" onClick={exportLogs}>
          📥 Export Logs
        </button>
        <button className="action-btn clear" onClick={clearAllLogs}>
          🗑️ Clear All Logs
        </button>
        <button className="action-btn refresh" onClick={() => { loadLogs(); loadStats(); }}>
          🔄 Refresh
        </button>
      </div>

      {viewMode === 'stats' ? (
        <div className="stats-container">
          <h2>📈 Dashboard Usage Statistics</h2>
          <div className="stats-grid">
            {Object.values(stats).map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-header">
                  <span className="stat-icon">{getDashboardIcon(stat.name)}</span>
                  <h3>{stat.name}</h3>
                </div>
                <div className="stat-content">
                  <div className="stat-item">
                    <span className="stat-label">Total Accesses:</span>
                    <span className="stat-value">{stat.accessCount}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Unique Users:</span>
                    <span className="stat-value">{stat.uniqueUsers}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Last Accessed:</span>
                    <span className="stat-value">{formatDate(stat.lastAccessed)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="logs-container">
          <h2>📋 {viewMode === 'recent' ? 'Recent Dashboard Access Logs' : 'Filtered Logs'}</h2>
          <div className="logs-list">
            {logs.length === 0 ? (
              <div className="no-logs">
                <p>No logs found</p>
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={log.id || index} className="log-item">
                  <div className="log-header">
                    <span className="log-icon">{getDashboardIcon(log.dashboardName)}</span>
                    <div className="log-info">
                      <h4>{log.dashboardName}</h4>
                      <span className="log-timestamp">{formatDate(log.timestamp)}</span>
                    </div>
                    <div className="log-badge">
                      {log.userRole}
                    </div>
                  </div>
                  <div className="log-details">
                    <div className="log-detail-item">
                      <span className="detail-label">User ID:</span>
                      <span className="detail-value">{log.userId}</span>
                    </div>
                    <div className="log-detail-item">
                      <span className="detail-label">Session ID:</span>
                      <span className="detail-value">{log.sessionId}</span>
                    </div>
                    <div className="log-detail-item">
                      <span className="detail-label">URL:</span>
                      <span className="detail-value">{log.url}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardLogsViewer;
