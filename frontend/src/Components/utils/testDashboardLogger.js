// Test file for Dashboard Logger
// This file can be used to test the dashboard logging functionality

import dashboardLogger from './dashboardLogger';

// Test function to simulate dashboard access
export const testDashboardLogging = () => {
  console.log('🧪 Testing Dashboard Logging System...');
  
  // Test logging different dashboard accesses
  dashboardLogger.logDashboardAccess("Employee Dashboard", "test_user_001", "EMPLOYEE");
  dashboardLogger.logDashboardAccess("Finance Dashboard", "test_user_002", "FINANCE");
  dashboardLogger.logDashboardAccess("Inventory Dashboard", "test_user_003", "INVENTORY");
  dashboardLogger.logDashboardAccess("Production Dashboard", "test_user_004", "PRODUCTION");
  dashboardLogger.logDashboardAccess("Customer Dashboard", "test_user_005", "CUSTOMER");
  dashboardLogger.logDashboardAccess("Certificate Dashboard", "test_user_006", "CERTIFICATE");
  dashboardLogger.logDashboardAccess("Login Page", "guest_user", "GUEST");
  
  // Test getting statistics
  const stats = dashboardLogger.getDashboardStats();
  console.log('📊 Dashboard Statistics:', stats);
  
  // Test getting recent logs
  const recentLogs = dashboardLogger.getRecentLogs(10);
  console.log('📋 Recent Logs:', recentLogs);
  
  console.log('✅ Dashboard Logging Test Completed!');
  return {
    stats,
    recentLogs,
    totalLogs: dashboardLogger.logs.length
  };
};

// Auto-run test when imported (for development)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Development Mode: Dashboard Logger Test Available');
  console.log('💡 Run testDashboardLogging() in browser console to test');
}
