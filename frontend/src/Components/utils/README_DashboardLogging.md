# Dashboard Logging System

## Overview
The Dashboard Logging System tracks and monitors user access to different dashboard pages in the Gemstone Management System. It provides comprehensive logging, analytics, and reporting capabilities.

## Features

### 🔍 **Comprehensive Logging**
- Tracks all dashboard page access
- Records user information, timestamps, and session data
- Stores logs locally in browser storage
- Supports server-side logging (configurable)

### 📊 **Analytics & Statistics**
- Dashboard usage statistics
- User access patterns
- Popular dashboard tracking
- Time-based analytics

### 🎯 **Real-time Monitoring**
- Live dashboard access tracking
- Session management
- User activity monitoring
- Access pattern analysis

## Components

### 1. **DashboardLogger Class** (`dashboardLogger.js`)
Core logging functionality with methods for:
- `logDashboardAccess()` - Log dashboard access
- `getDashboardStats()` - Get usage statistics
- `getRecentLogs()` - Get recent access logs
- `getUserLogs()` - Get logs for specific user
- `exportLogs()` - Export logs as JSON

### 2. **DashboardLogsViewer Component** (`DashboardLogsViewer.js`)
React component for viewing and managing logs:
- Recent logs display
- Statistics dashboard
- Filtering and search
- Export functionality
- Log management

### 3. **Test Utilities** (`testDashboardLogger.js`)
Testing and development utilities for the logging system.

## Usage

### Basic Logging
```javascript
import dashboardLogger from './utils/dashboardLogger';

// Log dashboard access
dashboardLogger.logDashboardAccess("Employee Dashboard", "user123", "EMPLOYEE");
```

### Getting Statistics
```javascript
// Get dashboard usage statistics
const stats = dashboardLogger.getDashboardStats();
console.log(stats);
```

### Viewing Logs
```javascript
// Get recent logs
const recentLogs = dashboardLogger.getRecentLogs(50);
console.log(recentLogs);
```

## Dashboard Integration

All dashboard components automatically log access when mounted:

### Employee Dashboard
- **Route**: `/empdashboard`
- **Logs**: "Employee Dashboard" access

### Finance Dashboard
- **Route**: `/financedashboard`
- **Logs**: "Finance Dashboard" access

### Inventory Dashboard
- **Route**: `/indashboard`
- **Logs**: "Inventory Dashboard" access

### Production Dashboard
- **Route**: `/pandpdashboard`
- **Logs**: "Production Dashboard" access

### Customer Dashboard
- **Route**: `/place`
- **Logs**: "Customer Dashboard" access

### Certificate Dashboard
- **Route**: `/certificate`
- **Logs**: "Certificate Dashboard" access

### Login Page
- **Route**: `/d_loging`
- **Logs**: "Login Page" access

## Log Data Structure

Each log entry contains:
```javascript
{
  id: "unique_log_id",
  timestamp: "2024-01-01T12:00:00.000Z",
  dashboardName: "Employee Dashboard",
  userId: "user123",
  userRole: "EMPLOYEE",
  sessionId: "session_1234567890_abc123",
  userAgent: "Mozilla/5.0...",
  url: "http://localhost:3000/empdashboard",
  referrer: "http://localhost:3000/d_loging"
}
```

## Accessing Logs Viewer

Navigate to `/dashboard-logs` to view the Dashboard Logs Viewer interface.

### Features:
- **Recent Logs**: View latest dashboard access logs
- **Statistics**: Dashboard usage analytics
- **Filtering**: Filter logs by dashboard, user, date range
- **Export**: Download logs as JSON
- **Management**: Clear logs, refresh data

## Configuration

### Storage Settings
- **Local Storage**: Logs stored in browser localStorage
- **Session Storage**: Session IDs stored in sessionStorage
- **Max Logs**: 1000 entries (auto-cleanup)

### Server Integration
To enable server-side logging, uncomment and configure the `sendToServer()` method in `dashboardLogger.js`:

```javascript
async sendToServer(logEntry) {
  try {
    await fetch('/api/dashboard-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logEntry)
    });
  } catch (error) {
    console.warn('Failed to send log to server:', error);
  }
}
```

## Testing

Use the test utilities to verify logging functionality:

```javascript
import { testDashboardLogging } from './utils/testDashboardLogger';

// Run test
testDashboardLogging();
```

## Security & Privacy

- **No Sensitive Data**: Only logs dashboard access, not user actions
- **Local Storage**: Data stays in user's browser
- **Session Tracking**: Uses session IDs, not persistent user tracking
- **Data Export**: Users can export their own logs

## Troubleshooting

### Common Issues

1. **Logs Not Appearing**
   - Check browser console for errors
   - Verify localStorage is enabled
   - Check component mounting

2. **Statistics Not Updating**
   - Refresh the logs viewer
   - Clear browser cache
   - Check localStorage data

3. **Export Not Working**
   - Ensure browser supports file downloads
   - Check for popup blockers
   - Verify JSON data format

### Debug Mode
Enable debug logging by setting:
```javascript
localStorage.setItem('dashboardLogger_debug', 'true');
```

## Future Enhancements

- [ ] Real-time dashboard monitoring
- [ ] Advanced analytics and reporting
- [ ] User behavior tracking
- [ ] Performance metrics
- [ ] Automated reporting
- [ ] Integration with external analytics tools

## Support

For issues or questions about the Dashboard Logging System:
1. Check browser console for errors
2. Verify localStorage permissions
3. Test with different browsers
4. Review component integration

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Author**: Gemstone Management System Team
