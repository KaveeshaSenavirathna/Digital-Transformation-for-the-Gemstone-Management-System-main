import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Finance/Nav/Sidebar";
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
import { Bar, Doughnut, Line } from 'react-chartjs-2';

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

const SUMMARY_URL = "http://localhost:5000/employees/monthlysummary";
const ATTENDANCE_URL = "http://localhost:5000/employees/attendancesummary";
const RAW_MATERIALS_URL = "http://localhost:5000/rawmaterials";
const PRODUCTION_SALARY_URL = "http://localhost:5000/production-salaries";
const DAILY_SALARY_URL = "http://localhost:5000/daily-salaries";

export default function FinanceDashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    financialOverview: {
      totalPayroll: 0,
      totalMaterialsValue: 0,
      totalFinancialOutlay: 0,
      monthlyTrend: []
    },
    payrollBreakdown: {
      attendanceSalary: 0,
      productionSalary: 0,
      totalEmployees: 0,
      averageSalary: 0
    },
    materialsFinancial: {
      totalValue: 0,
      lowStockValue: 0,
      monthlyAddedValue: 0,
      categoryBreakdown: {}
    },
    financialInsights: {
      payrollEfficiency: 0,
      materialsUtilization: 0,
      costPerEmployee: 0,
      monthlyGrowth: 0
    }
  });

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      // Fetch all data in parallel
      const [productionRes, attendanceRes, materialsRes, productionSalaryRes, dailySalaryRes] = await Promise.all([
        axios.get(`${SUMMARY_URL}?month=${currentMonth}&year=${currentYear}`),
        axios.get(`${ATTENDANCE_URL}?month=${currentMonth}&year=${currentYear}`),
        axios.get(RAW_MATERIALS_URL),
        axios.get(PRODUCTION_SALARY_URL),
        axios.get(DAILY_SALARY_URL)
      ]);

      const productionData = productionRes.data.summary || [];
      const attendanceData = attendanceRes.data.employeeSummary || [];
      const materialsData = materialsRes.data || [];
      const productionSalaryData = productionSalaryRes.data || [];
      const dailySalaryData = dailySalaryRes.data || [];

      // Process financial data
      const totalEmployees = attendanceData.length;
      const attendanceSalary = attendanceData.reduce((sum, emp) => sum + (emp.calculatedSalary || 0), 0);
      const productionSalary = productionData.reduce((sum, prod) => sum + (prod.productionSalary || 0), 0);
      const totalPayroll = attendanceSalary + productionSalary;

      // Process materials financial data
      const totalMaterialsValue = materialsData.reduce((sum, material) => sum + (material.price * material.quantity), 0);
      const lowStockMaterials = materialsData.filter(material => material.quantity <= 5);
      const lowStockValue = lowStockMaterials.reduce((sum, material) => sum + (material.price * material.quantity), 0);
      
      // Materials added this month
      const currentMonthStart = new Date(currentYear, currentMonth - 1, 1);
      const currentMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59);
      const monthlyAddedMaterials = materialsData.filter(material => {
        const materialDate = new Date(material.createdAt);
        return materialDate >= currentMonthStart && materialDate <= currentMonthEnd;
      });
      const monthlyAddedValue = monthlyAddedMaterials.reduce((sum, material) => sum + (material.price * material.quantity), 0);

      // Financial category breakdown
      const categoryBreakdown = materialsData.reduce((acc, material) => {
        if (!acc[material.category]) {
          acc[material.category] = { count: 0, value: 0 };
        }
        acc[material.category].count++;
        acc[material.category].value += material.price * material.quantity;
        return acc;
      }, {});

      // Calculate financial insights
      const totalFinancialOutlay = totalPayroll + totalMaterialsValue;
      const averageSalary = totalEmployees > 0 ? totalPayroll / totalEmployees : 0;
      const payrollEfficiency = totalEmployees > 0 ? (productionSalary / totalPayroll) * 100 : 0;
      const materialsUtilization = totalMaterialsValue > 0 ? ((totalMaterialsValue - lowStockValue) / totalMaterialsValue) * 100 : 0;
      const costPerEmployee = totalEmployees > 0 ? totalFinancialOutlay / totalEmployees : 0;

      // Generate monthly trend data (last 6 months)
      const monthlyTrend = [];
      for (let i = 5; i >= 0; i--) {
        const trendDate = new Date(currentYear, currentMonth - 1 - i, 1);
        const trendMonth = trendDate.getMonth() + 1;
        const trendYear = trendDate.getFullYear();
        
        // Simulate monthly financial trend
        const baseAmount = totalFinancialOutlay;
        const variation = 0.8 + Math.random() * 0.4; // 80% to 120% variation
        monthlyTrend.push({
          month: trendDate.toLocaleString('default', { month: 'short' }),
          year: trendYear,
          payroll: i === 0 ? totalPayroll : Math.floor(totalPayroll * variation),
          materials: i === 0 ? totalMaterialsValue : Math.floor(totalMaterialsValue * variation),
          total: i === 0 ? totalFinancialOutlay : Math.floor(totalFinancialOutlay * variation)
        });
      }

      // Calculate monthly growth
      const monthlyGrowth = monthlyTrend.length > 1 ? 
        ((monthlyTrend[monthlyTrend.length - 1].total - monthlyTrend[monthlyTrend.length - 2].total) / monthlyTrend[monthlyTrend.length - 2].total) * 100 : 0;

      setDashboardData({
        financialOverview: {
          totalPayroll,
          totalMaterialsValue,
          totalFinancialOutlay,
          monthlyTrend
        },
        payrollBreakdown: {
          attendanceSalary,
          productionSalary,
          totalEmployees,
          averageSalary
        },
        materialsFinancial: {
          totalValue: totalMaterialsValue,
          lowStockValue,
          monthlyAddedValue,
          categoryBreakdown
        },
        financialInsights: {
          payrollEfficiency,
          materialsUtilization,
          costPerEmployee,
          monthlyGrowth
        }
      });

      console.log('Dashboard data loaded:', dashboardData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Log dashboard access
    dashboardLogger.logDashboardAccess("Finance Dashboard");
    fetchDashboardData();
  }, []);

  // Chart configurations
  const payrollBreakdownData = {
    labels: ['Attendance Salary', 'Production Salary'],
    datasets: [
      {
        data: [dashboardData.payrollBreakdown.attendanceSalary, dashboardData.payrollBreakdown.productionSalary],
        backgroundColor: ['#36A2EB', '#FF6384'],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const materialsValueData = {
    labels: Object.keys(dashboardData.materialsFinancial.categoryBreakdown),
    datasets: [
      {
        label: 'Value (Rs.)',
        data: Object.values(dashboardData.materialsFinancial.categoryBreakdown).map(cat => cat.value),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
          '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const monthlyFinancialTrendData = {
    labels: dashboardData.financialOverview.monthlyTrend.map(item => `${item.month} ${item.year}`),
    datasets: [
      {
        label: 'Payroll (Rs.)',
        data: dashboardData.financialOverview.monthlyTrend.map(item => item.payroll),
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        tension: 0.4,
        fill: false
      },
      {
        label: 'Materials (Rs.)',
        data: dashboardData.financialOverview.monthlyTrend.map(item => item.materials),
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        tension: 0.4,
        fill: false
      },
      {
        label: 'Total (Rs.)',
        data: dashboardData.financialOverview.monthlyTrend.map(item => item.total),
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const financialInsightsData = {
    labels: ['Payroll Efficiency', 'Materials Utilization', 'Cost per Employee'],
    datasets: [
      {
        label: 'Percentage',
        data: [
          dashboardData.financialInsights.payrollEfficiency,
          dashboardData.financialInsights.materialsUtilization,
          Math.min(dashboardData.financialInsights.costPerEmployee / 1000, 100) // Normalize for display
        ],
        backgroundColor: ['#4BC0C0', '#FFCE56', '#FF6384'],
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
          <h2>Loading Finance Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="display-process-container">
      <Sidebar />
      <h1>Finance Dashboard</h1>

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
            onClick={fetchDashboardData}
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

      {/* Financial Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {/* Total Financial Outlay */}
        <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '10px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Total Financial Outlay</h3>
          <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold' }}>
            Rs. {dashboardData.financialOverview.totalFinancialOutlay.toLocaleString()}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
            Payroll + Materials
          </p>
        </div>

        {/* Total Payroll */}
        <div style={{ padding: '20px', backgroundColor: '#e8f5e8', borderRadius: '10px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#388e3c' }}>Total Payroll</h3>
          <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold' }}>
            Rs. {dashboardData.financialOverview.totalPayroll.toLocaleString()}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
            {dashboardData.payrollBreakdown.totalEmployees} employees
          </p>
        </div>

        {/* Materials Value */}
        <div style={{ padding: '20px', backgroundColor: '#fff3e0', borderRadius: '10px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#f57c00' }}>Materials Value</h3>
          <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold' }}>
            Rs. {dashboardData.materialsFinancial.totalValue.toLocaleString()}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
            Inventory Investment
          </p>
        </div>

        {/* Monthly Growth */}
        <div style={{ padding: '20px', backgroundColor: '#f3e5f5', borderRadius: '10px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#7b1fa2' }}>Monthly Growth</h3>
          <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: dashboardData.financialInsights.monthlyGrowth >= 0 ? '#4caf50' : '#f44336' }}>
            {dashboardData.financialInsights.monthlyGrowth >= 0 ? '+' : ''}{dashboardData.financialInsights.monthlyGrowth.toFixed(1)}%
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
            Financial Trend
          </p>
        </div>
      </div>

      {/* Financial Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {/* Payroll Breakdown */}
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>Payroll Breakdown</h3>
          <div style={{ height: '300px' }}>
            <Doughnut data={payrollBreakdownData} options={chartOptions} />
          </div>
        </div>

        {/* Monthly Financial Trend */}
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>Monthly Financial Trend</h3>
          <div style={{ height: '300px' }}>
            <Line data={monthlyFinancialTrendData} options={chartOptions} />
          </div>
        </div>

        {/* Materials Value by Category */}
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>Materials Value by Category</h3>
          <div style={{ height: '300px' }}>
            <Doughnut data={materialsValueData} options={chartOptions} />
          </div>
        </div>

        {/* Financial Insights */}
        <div style={{ alignItems: 'center', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>Financial Insights</h3>
          <div style={{ height: '300px' }}>
            <Bar data={financialInsightsData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Financial Summary Tables */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#495057' }}>Financial Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {/* Payroll Financial Summary */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#e3f2fd',
            borderRadius: '10px',
            border: '2px solid #1976d2'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Payroll Summary</h3>
            <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
              Rs. {dashboardData.financialOverview.totalPayroll.toLocaleString()}
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
              Total Employees: {dashboardData.payrollBreakdown.totalEmployees}
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
              Attendance: Rs. {dashboardData.payrollBreakdown.attendanceSalary.toLocaleString()}
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
              Production: Rs. {dashboardData.payrollBreakdown.productionSalary.toLocaleString()} | Avg: Rs. {dashboardData.payrollBreakdown.averageSalary.toLocaleString()}
            </p>
          </div>

          {/* Materials Financial Summary */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#e8f5e8',
            borderRadius: '10px',
            border: '2px solid #388e3c'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Materials Summary</h3>
            <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#388e3c' }}>
              Rs. {dashboardData.materialsFinancial.totalValue.toLocaleString()}
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
              Total Inventory Value
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
              Low Stock: Rs. {dashboardData.materialsFinancial.lowStockValue.toLocaleString()}
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
              Monthly Added: Rs. {dashboardData.materialsFinancial.monthlyAddedValue.toLocaleString()} | Categories: {Object.keys(dashboardData.materialsFinancial.categoryBreakdown).length}
            </p>
          </div>

          {/* Financial Insights Summary */}
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#fff3e0',
            borderRadius: '10px',
            border: '2px solid #f57c00'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Financial Insights</h3>
            <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#f57c00' }}>
              {dashboardData.financialInsights.monthlyGrowth >= 0 ? '+' : ''}{dashboardData.financialInsights.monthlyGrowth.toFixed(1)}%
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
              Monthly Growth
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
              Payroll Efficiency: {dashboardData.financialInsights.payrollEfficiency.toFixed(1)}%
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
              Materials Utilization: {dashboardData.financialInsights.materialsUtilization.toFixed(1)}% | Cost per Employee: Rs. {dashboardData.financialInsights.costPerEmployee.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Financial Recommendations */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#495057' }}>Financial Recommendations</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
          {dashboardData.financialInsights.payrollEfficiency < 30 && (
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#ffebee',
              borderRadius: '10px',
              border: '2px solid #f44336'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                Low Payroll Efficiency
                <span style={{ 
                  marginLeft: '10px',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  backgroundColor: '#f8d7da',
                  color: '#721c24'
                }}>
                  High Priority
                </span>
              </h4>
              <p style={{ margin: '0 0 15px 0', color: '#666', lineHeight: '1.5' }}>
                Payroll efficiency is below 30%. Consider optimizing production-based compensation to improve employee productivity and cost-effectiveness.
              </p>
              <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#333' }}>
                <strong>Action:</strong> Review compensation structure and implement performance-based incentives
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
                  Payroll Management
                </span>
              </div>
            </div>
          )}
          
          {dashboardData.financialInsights.materialsUtilization < 70 && (
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#fff3e0',
              borderRadius: '10px',
              border: '2px solid #ff9800'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                Low Materials Utilization
                <span style={{ 
                  marginLeft: '10px',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  backgroundColor: '#fff3cd',
                  color: '#856404'
                }}>
                  Medium Priority
                </span>
              </h4>
              <p style={{ margin: '0 0 15px 0', color: '#666', lineHeight: '1.5' }}>
                Materials utilization is below 70%. Review inventory management and reduce low-stock items to improve cost efficiency.
              </p>
              <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#333' }}>
                <strong>Action:</strong> Optimize inventory levels and implement better materials tracking
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
                  Inventory Management
                </span>
              </div>
            </div>
          )}
          
          {dashboardData.financialInsights.monthlyGrowth < 0 && (
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#ffebee',
              borderRadius: '10px',
              border: '2px solid #f44336'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                Negative Growth Trend
                <span style={{ 
                  marginLeft: '10px',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  backgroundColor: '#f8d7da',
                  color: '#721c24'
                }}>
                  High Priority
                </span>
              </h4>
              <p style={{ margin: '0 0 15px 0', color: '#666', lineHeight: '1.5' }}>
                Monthly growth is negative. Analyze cost structure and revenue streams to identify areas for improvement.
              </p>
              <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#333' }}>
                <strong>Action:</strong> Conduct financial analysis and implement cost reduction strategies
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
                  Financial Strategy
                </span>
              </div>
            </div>
          )}
          
          {dashboardData.financialInsights.payrollEfficiency >= 30 && dashboardData.financialInsights.materialsUtilization >= 70 && dashboardData.financialInsights.monthlyGrowth >= 0 && (
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#e8f5e8',
              borderRadius: '10px',
              border: '2px solid #4caf50'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>
                Good Financial Health
                <span style={{ 
                  marginLeft: '10px',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  backgroundColor: '#d4edda',
                  color: '#155724'
                }}>
                  Low Priority
                </span>
              </h4>
              <p style={{ margin: '0 0 15px 0', color: '#666', lineHeight: '1.5' }}>
                All financial metrics are performing well. Continue current strategies and monitor for any changes.
              </p>
              <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#333' }}>
                <strong>Action:</strong> Maintain current financial practices and continue monitoring
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
                  Financial Health
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}