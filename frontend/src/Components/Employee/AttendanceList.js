import React, { useEffect, useState } from "react";
import axios from "axios";
import AttendanceForm from "./AttendanceDaily";

function AttendanceList() {
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchDaily = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/attendance/daily");
      setDaily(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDaily();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete attendance?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/attendance/${id}`);
      fetchDaily(); // Refresh table
    } catch (err) {
      console.error(err);
      alert("Failed to delete attendance");
    }
  };

  if (loading) return <p>Loading...</p>;

  const filtered = daily.filter((d) =>
    d.employeeId.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "1200px", margin: "auto" }}>
      <h2>Daily Attendance</h2>
      <AttendanceForm fetchDaily={fetchDaily} />

      <input
        placeholder="Search employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "10px" }}
      />

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Reg ID</th>
            <th>Status</th>
            <th>Time In</th>
            <th>Leave Start</th>
            <th>Leave End</th>
            <th>Reason</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((att) => (
            <tr key={att._id}>
              <td>{att.employeeId.name}</td>
              <td>{att.employeeId.registrationId}</td>
              <td>{att.status}</td>
              <td>{att.timeIn || "-"}</td>
              <td>{att.leaveStartTime || "-"}</td>
              <td>{att.leaveEndTime || "-"}</td>
              <td>{att.leaveReason || "-"}</td>
              <td>
                <button onClick={() => handleDelete(att._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceList;
