// Dashboard Logging System
// Tracks user access to different dashboard pages

class DashboardLogger {
  constructor() {
    this.logs = [];
    this.initializeLogger();
  }

  // Initialize the logger with existing logs from localStorage
  initializeLogger() {
    const savedLogs = localStorage.getItem('dashboardLogs');
    if (savedLogs) {
      this.logs = JSON.parse(savedLogs);
    }
  }

  // Save logs to localStorage
  saveLogs() {
    localStorage.setItem('dashboardLogs', JSON.stringify(this.logs));
  }

  // Generic log method for any dashboard activity
  log(message, type = 'info', data = null) {
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      message: message,
      type: type, // 'info', 'success', 'error', 'warning'
      data: data,
      userId: this.getCurrentUserId(),
      userRole: this.getCurrentUserRole(),
      sessionId: this.getSessionId(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer
    };

    this.logs.push(logEntry);
    
    // Keep only last 1000 logs to prevent storage bloat
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }

    this.saveLogs();
    
    // Also send to server if available
    this.sendToServer(logEntry);
    
    console.log(`Dashboard Log [${type.toUpperCase()}]: ${message}`, data || '');
  }

  // Log dashboard access
  logDashboardAccess(dashboardName, userId = null, userRole = null) {
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      dashboardName: dashboardName,
      userId: userId || this.getCurrentUserId(),
      userRole: userRole || this.getCurrentUserRole(),
      sessionId: this.getSessionId(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer
    };

    this.logs.push(logEntry);
    
    // Keep only last 1000 logs to prevent storage bloat
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }

    this.saveLogs();
    
    // Also send to server if available
    this.sendToServer(logEntry);
    
    console.log(`Dashboard Access Logged: ${dashboardName}`, logEntry);
  }

  // Get current user ID from localStorage
  getCurrentUserId() {
    return localStorage.getItem('userId') || 
           localStorage.getItem('regId') || 
           'anonymous';
  }

  // Get current user role from localStorage
  getCurrentUserRole() {
    return localStorage.getItem('userRole') || 
           localStorage.getItem('role') || 
           'unknown';
  }

  // Generate or get existing session ID
  getSessionId() {
    let sessionId = sessionStorage.getItem('dashboardSessionId');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('dashboardSessionId', sessionId);
    }
    return sessionId;
  }

  // Send log to server (if backend is available)
  async sendToServer(logEntry) {
    try {
      // You can implement this to send logs to your backend
      // await fetch('/api/dashboard-logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logEntry)
      // });
    } catch (error) {
      console.warn('Failed to send log to server:', error);
    }
  }

  // Get logs for a specific dashboard
  getDashboardLogs(dashboardName) {
    return this.logs.filter(log => log.dashboardName === dashboardName);
  }

  // Get logs for a specific user
  getUserLogs(userId) {
    return this.logs.filter(log => log.userId === userId);
  }

  // Get recent logs (last N entries)
  getRecentLogs(count = 50) {
    return this.logs.slice(-count).reverse();
  }

  // Get logs by date range
  getLogsByDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= start && logDate <= end;
    });
  }

  // Get dashboard usage statistics
  getDashboardStats() {
    const stats = {};
    
    this.logs.forEach(log => {
      if (!stats[log.dashboardName]) {
        stats[log.dashboardName] = {
          name: log.dashboardName,
          accessCount: 0,
          uniqueUsers: new Set(),
          lastAccessed: null
        };
      }
      
      stats[log.dashboardName].accessCount++;
      stats[log.dashboardName].uniqueUsers.add(log.userId);
      
      const logDate = new Date(log.timestamp);
      if (!stats[log.dashboardName].lastAccessed || logDate > new Date(stats[log.dashboardName].lastAccessed)) {
        stats[log.dashboardName].lastAccessed = log.timestamp;
      }
    });

    // Convert Set to count
    Object.values(stats).forEach(stat => {
      stat.uniqueUsers = stat.uniqueUsers.size;
    });

    return stats;
  }

  // Clear all logs
  clearLogs() {
    this.logs = [];
    this.saveLogs();
  }

  // Export logs as JSON
  exportLogs() {
    const dataStr = JSON.stringify(this.logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `dashboard-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }
}

// Create singleton instance
const dashboardLogger = new DashboardLogger();

// Export the logger instance
export default dashboardLogger;

// Export individual functions for convenience
export const logDashboardAccess = (dashboardName, userId, userRole) => {
  dashboardLogger.logDashboardAccess(dashboardName, userId, userRole);
};

export const log = (message, type, data) => {
  dashboardLogger.log(message, type, data);
};

export const getDashboardStats = () => {
  return dashboardLogger.getDashboardStats();
};

export const getRecentLogs = (count) => {
  return dashboardLogger.getRecentLogs(count);
};
