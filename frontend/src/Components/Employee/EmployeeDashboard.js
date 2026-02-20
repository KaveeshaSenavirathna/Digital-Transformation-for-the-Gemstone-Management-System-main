import React, { useState, useEffect } from "react";
import Sidebar from "../Employee/Nav/Sidebar";
import "../Employee/Nav/Sidebar.css";
import { Link } from "react-router-dom";
import axios from "axios";
import dashboardLogger from "../utils/dashboardLogger";

function Home() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [dailyPresentCount, setDailyPresentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [departmentStats, setDepartmentStats] = useState({});

  // Department names for your system
  const departments = [
    "human_resource",
    "prduction&process",
    "quality_assurance",
    "administration",
    "finance",
  ];

  // Log dashboard access and fetch all data on mount
  useEffect(() => {
    // Log dashboard access
    dashboardLogger.logDashboardAccess("Employee Dashboard");
    
    const fetchData = async () => {
      try {
        setLoading(true);

        const [employeesRes, tasksRes] = await Promise.all([
          axios.get("http://localhost:5000/api/employees"),
          axios.get("http://localhost:5000/api/tasks"),
        ]);

        setEmployees(employeesRes.data || []);
        setTasks(tasksRes.data || []);

        // Department statistics
        const deptStats = {};
        departments.forEach((dept) => {
          const deptEmployees = employeesRes.data.filter(
            (emp) => emp.department === dept
          );
          const deptTasks = tasksRes.data.filter(
            (task) => task.department === dept
          );

          deptStats[dept] = {
            totalEmployees: deptEmployees.length,
            activeTasks: deptTasks.filter((t) => t.status === "in_progress").length,
            pendingTasks: deptTasks.filter((t) => t.status === "pending").length,
            completedTasks: deptTasks.filter((t) => t.status === "done").length,
          };
        });

        setDepartmentStats(deptStats);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch daily present count
  useEffect(() => {
    const fetchDailyPresentCount = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/attendance/todaypresentcount"
        );
        setDailyPresentCount(res.data.count || 0);
      } catch (err) {
        console.error("Error fetching daily present count:", err);
      }
    };

    fetchDailyPresentCount();
    const interval = setInterval(fetchDailyPresentCount, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calculated stats
  const totalEmployees = employees.length;
  const activeTasks = tasks.filter((t) => t.status === "in_progress").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const recentTasks = tasks.slice(0, 5);

  const getDepartmentTitle = (dept) => {
    const map = {
      human_resource: "Human Resource",
      "production&process": "Production & Process",
      quality_assurance: "Quality Assurance",
      administration: "Administration",
      finance: "Finance",
    };
    return map[dept] || dept;
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="display-process-container">
      <Sidebar />
      <div>
        <div style={{
          marginBottom: '30px',
          padding: '25px',
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #17a2b8',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              margin: '0 0 10px 0',
              color: '#495057',
              fontSize: '2rem',
              fontWeight: '600'
            }}>
              Employee & Task Management Dashboard
            </h1>
            <p style={{
              margin: '0',
              color: '#666',
              fontSize: '1rem'
            }}>
              Monitor daily operations and department performance at a glance
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "20px",
            marginBottom: "30px",
          }}
        >
          <MetricCard
            title="Total Employees"
            value={totalEmployees}
            color="#007bff"
            description="All registered employees"
          />
          <MetricCard
            title="Present Today"
            value={dailyPresentCount}
            color="#28a745"
            description="Employees marked present"
          />
          <MetricCard
            title="Active Tasks"
            value={activeTasks}
            color="#17a2b8"
            description="Tasks currently in progress"
          />
          <MetricCard
            title="Pending Tasks"
            value={pendingTasks}
            color="#ffc107"
            description="Awaiting completion"
          />
          <MetricCard
            title="Completed Tasks"
            value={completedTasks}
            color="#28a745"
            description="Successfully finished"
          />
        </div>

        {/* Department Overview */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: "#fff",
            marginBottom: "30px",
          }}
        >
          <h2>Department Overview</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
              marginTop: "10px",
            }}
          >
            {departments.map((dept) => {
              const stats = departmentStats[dept] || {};
              return (
                <div
                  key={dept}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "15px",
                    backgroundColor: "#f8f9fa",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  }}
                >
                  <h4 style={{ color: "#007bff", marginBottom: "10px" }}>
                    {getDepartmentTitle(dept)}
                  </h4>
                  <p>
                    <strong>{stats.totalEmployees || 0}</strong> Employees
                  </p>
                  <p style={{ margin: "5px 0" }}>
                    <span style={{ color: "#17a2b8" }}>
                      Active: {stats.activeTasks || 0}
                    </span>{" "}
                    |{" "}
                    <span style={{ color: "#ffc107" }}>
                      Pending: {stats.pendingTasks || 0}
                    </span>{" "}
                    |{" "}
                    <span style={{ color: "#28a745" }}>
                      Completed: {stats.completedTasks || 0}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Tasks */}
        <RecentTasks tasks={recentTasks} />
      </div>
    </div>
  );
}

// ✅ Reusable Metric Card
const MetricCard = ({ title, value, color, description }) => (
  <div
    style={{
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "20px",
      backgroundColor: "#f8f9fa",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    }}
  >
    <h3 style={{ color, marginBottom: "8px" }}>{title}</h3>
    <p style={{ fontSize: "26px", fontWeight: "bold", margin: "0", color }}>
      {value}
    </p>
    <small style={{ color: "#6c757d" }}>{description}</small>
  </div>
);

// ✅ Recent Tasks Component
const RecentTasks = ({ tasks }) => (
  <div
    style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "20px",
      backgroundColor: "#fff",
    }}
  >
    <h2>Recent Tasks</h2>
    {tasks.length === 0 ? (
      <p style={{ fontStyle: "italic", color: "#6c757d" }}>No recent tasks</p>
    ) : (
      tasks.map((task, i) => (
        <div
          key={task._id || i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            borderBottom: i < tasks.length - 1 ? "1px solid #eee" : "none",
          }}
        >
          <div>
            <strong>{task.title}</strong>
            <p style={{ margin: "0", fontSize: "13px", color: "#6c757d" }}>
              {task.userName} — {task.department}
            </p>
          </div>
          <span
            style={{
              backgroundColor:
                task.status === "done"
                  ? "#d4edda"
                  : task.status === "in_progress"
                  ? "#d1ecf1"
                  : "#fff3cd",
              color:
                task.status === "done"
                  ? "#28a745"
                  : task.status === "in_progress"
                  ? "#17a2b8"
                  : "#856404",
              padding: "4px 10px",
              borderRadius: "4px",
              fontWeight: "bold",
              fontSize: "12px",
            }}
          >
            {task.status || "pending"}
          </span>
        </div>
      ))
    )}
    <Link to="/task" style={{ textDecoration: "none" }}>
      <button
        style={{
          marginTop: "15px",
          padding: "10px 18px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        View All Tasks
      </button>
    </Link>
  </div>
);

export default Home;
