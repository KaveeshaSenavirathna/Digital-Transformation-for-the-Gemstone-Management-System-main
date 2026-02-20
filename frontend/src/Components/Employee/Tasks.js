import React, { useEffect, useState, useMemo, useCallback } from "react";
import Sidebar from "../Employee/Nav/Sidebar";
import "../Employee/Nav/Sidebar.css";
import "../Styles/DisplayProcess.css";
import axios from "axios";
// Ensure this import points to the new CSS file
import "../Styles/Tasks.css"; 

function Tasks() {
    // --- Sidebar State Management (Assuming collapse functionality) ---
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prev => !prev);
    }, []);
    // -----------------------------------------------------------------

    const departments = useMemo(
        () => [
            "human_resource",
            "prduction&process",
            "quality_assurance",
            "administration",
            "finance",
        ],
        []
    );

    const [selectedDept, setSelectedDept] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [tasks, setTasks] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    // Fetch employees by department
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const params = selectedDept ? { department: selectedDept } : {};
                const res = await axios.get("http://localhost:5000/api/employees", { params });
                setUsers(res.data || []);
            } catch (err) {
                console.error("Error fetching users:", err);
                setUsers([]);
            }
        };
        fetchUsers();
    }, [selectedDept]);

    // Fetch all users
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/employees");
                setAllUsers(res.data || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAllUsers();
    }, []);

    // Fetch tasks for selected department
    const fetchTasksByDept = useCallback(async () => {
        try {
            const params = selectedDept ? { department: selectedDept } : {};
            const res = await axios.get("http://localhost:5000/api/tasks", { params });
            setTasks(res.data || []);
        } catch (err) {
            console.error(err);
        }
    }, [selectedDept]);

    useEffect(() => {
        fetchTasksByDept();
    }, [fetchTasksByDept]);

    // Fetch all tasks (for summary)
    const fetchAllTasks = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/tasks");
            setAllTasks(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAllTasks();
    }, []);

    // Assign new task
    const assignTask = async (e) => {
        e.preventDefault();
        if (!selectedUser || !selectedDept || !title) {
            alert("Please select department, user, and title.");
            return;
        }

        const user = users.find((u) => u._id === selectedUser);

        try {
            await axios.post("http://localhost:5000/api/tasks", {
                userId: user._id,
                userName: user.name,
                department: selectedDept,
                title,
                description,
                dueDate: dueDate || undefined,
            });

            alert("✅ Task assigned successfully");
            setTitle("");
            setDescription("");
            setDueDate("");
            setSelectedUser("");

            // Re-fetch tasks after assignment
            fetchTasksByDept();
            fetchAllTasks();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to assign task");
        }
    };

    // Update status
    const updateTaskStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/tasks/${id}/status`, { status });
            // Re-fetch tasks after update
            fetchTasksByDept();
            fetchAllTasks();
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    // Delete task
    const deleteTask = async (id) => {
        if (!window.confirm("Delete this task?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`);
            // Re-fetch tasks after deletion
            fetchTasksByDept();
            fetchAllTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const mainContentClass = `page-content ${isSidebarOpen ? '' : 'full-width'}`;

    return (
        <div className="display-process-container">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            
            {/* Hamburger Icon if sidebar is closed (Optional, depending on your Sidebar component) */}
            {!isSidebarOpen && (
                <button className="sidebar-toggle-icon" onClick={toggleSidebar}>
                    &#9776;
                </button>
            )}

            <div>
                <div style={{
                    marginBottom: '30px',
                    padding: '25px',
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #28a745',
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
                            Task Management Dashboard
                        </h1>
                        <p style={{
                            margin: '0',
                            color: '#666',
                            fontSize: '1rem'
                        }}>
                            Assign tasks to employees and track task progress across departments
                        </p>
                    </div>
                </div>

                {/* Assign Task Section */}
                <section className="task-section">
                    <h3>Assign New Task</h3>
                    <form onSubmit={assignTask} className="task-form">
                        <div className="form-row">
                            <label>Department:</label>
                            <select value={selectedDept} onChange={(e) => {
                                setSelectedDept(e.target.value);
                                setSelectedUser(""); // Reset user when department changes
                            }} required>
                                <option value="">Select Department</option>
                                {departments.map((d) => (
                                    <option key={d} value={d}>
                                        {d.replace(/_/g, " ").toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-row">
                            <label>User:</label>
                            <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required disabled={!selectedDept}>
                                <option value="">Select User</option>
                                {users.map((u) => (
                                    <option key={u._id} value={u._id}>{u.name} ({u.registrationId})</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-row">
                            <label>Title:</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>

                        <div className="form-row">
                            <label>Due Date:</label>
                            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                        </div>

                        <div className="form-row">
                            <label>Description (Optional):</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="assign-btn"
                        >
                            Assign Task
                        </button>
                    </form>
                </section>

                {/* Department Task Table */}
                <section className="task-section">
                    <h3>Tasks - {selectedDept ? selectedDept.replace(/_/g, " ").toUpperCase() : "Select a Department Above"}</h3>
                    <div className="table-responsive">
                        {tasks.length === 0 && selectedDept ? (
                            <p>No tasks found for the {selectedDept.replace(/_/g, " ").toUpperCase()} department.</p>
                        ) : tasks.length === 0 && !selectedDept ? (
                            <p>Select a department above to view its assigned tasks.</p>
                        ) : (
                            <table className="task-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>User</th>
                                        <th>Department</th>
                                        <th>Due Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((t) => (
                                        <tr key={t._id}>
                                            <td>{t.title}</td>
                                            <td>{t.userName}</td>
                                            <td>{t.department}</td>
                                            <td>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "N/A"}</td>
                                            <td>
                                                <select 
                                                    value={t.status} 
                                                    onChange={(e) => updateTaskStatus(t._id, e.target.value)}
                                                    className={`status-${t.status}`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="done">Done</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button 
                                                    style={{
                                                        padding: '6px 12px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: '600',
                                                        backgroundColor: '#dc3545',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        boxShadow: '0 2px 4px rgba(220, 53, 69, 0.3)'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.target.style.backgroundColor = '#c82333';
                                                        e.target.style.transform = 'translateY(-1px)';
                                                        e.target.style.boxShadow = '0 4px 8px rgba(220, 53, 69, 0.4)';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.target.style.backgroundColor = '#dc3545';
                                                        e.target.style.transform = 'translateY(0)';
                                                        e.target.style.boxShadow = '0 2px 4px rgba(220, 53, 69, 0.3)';
                                                    }}
                                                    onClick={() => deleteTask(t._id)}
                                                >
                                                    🗑 Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>

                {/* All Users Summary */}
                <section className="task-section">
                    <h3>Task Summary by User</h3>
                    <div className="table-responsive">
                        {allUsers.length === 0 ? (
                            <p>No users found</p>
                        ) : (
                            <table className="task-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>ID</th>
                                        <th>Department</th>
                                        <th>Assigned Tasks</th>
                                        <th>Done Tasks</th>
                                        <th>Completion Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUsers.map((user) => {
                                        const userTasks = allTasks.filter((t) => t.userId === user._id);
                                        const doneTasks = userTasks.filter((t) => t.status === "done");
                                        const completionRate = userTasks.length > 0 
                                            ? `${Math.round((doneTasks.length / userTasks.length) * 100)}%` 
                                            : "N/A";
                                        return (
                                            <tr key={user._id}>
                                                <td>{user.name}</td>
                                                <td>{user.registrationId}</td>
                                                <td>{user.department}</td>
                                                <td>{userTasks.length}</td>
                                                <td>{doneTasks.length}</td>
                                                <td>{completionRate}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Tasks;