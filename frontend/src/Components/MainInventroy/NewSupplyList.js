import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../MainInventroy/Nav/Sidebar";
import "../MainInventroy/Nav/Sidebar.css";
import "../Styles/NewSupplyList.css"; 

function SupplyLotList() {
    const [lots, setLots] = useState([]);
    const [search, setSearch] = useState("");
    const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
    const navigate = useNavigate();

    const fetchLots = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:5000/supplylot", {
                params: {
                    search: search || undefined,
                    date: filterDate || undefined,
                },
            });
            setLots(res.data);
        } catch (err) {
            console.error("Error fetching supply lots:", err);
        }
    }, [search, filterDate]);

    useEffect(() => {
        fetchLots();
    }, [fetchLots]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this lot? This action cannot be undone.")) return;
        try {
            await axios.delete(`http://localhost:5000/supplylot/${id}`);
            fetchLots();
        } catch (err) {
            console.error("Error deleting lot:", err);
            alert("Failed to delete lot.");
        }
    };

    return (
        <div className="supply-lot-page-wrapper">
            <Sidebar />
            <div className="page-content supply-lot-list-container">
                
                {/* Header and Summary Button Group */}
                <div className="header-group">
                    <h2>New Supply Inventory</h2>
                    <button 
                        className="summary-btn" 
                        onClick={() => navigate('/newsummery')} // Navigate to the Summary page
                    >
                        📈 View Summary
                    </button>
                </div>

                <div className="filter-bar">
                    <input
                        type="text"
                        placeholder="Search by name, NIC, stone code..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />
                    <button className="filter-btn" onClick={fetchLots}>🔍 Filter</button>
                </div>

                <table className="supply-lot-table">
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>NIC</th>
                            <th>Stone Code</th>
                            <th>Type</th>
                            <th>PCS</th>
                            <th>CTS</th>
                            <th>Weight</th>
                            <th>Supply Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lots.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="no-records">
                                    No records found matching the current filters.
                                </td>
                            </tr>
                        ) : (
                            lots.map((lot) => (
                                <tr key={lot._id}>
                                    <td>{lot.full_name} {lot.last_name}</td>
                                    <td>{lot.nic}</td>
                                    <td>{lot.stone_code}</td>
                                    <td>{lot.type}</td>
                                    <td>{lot.pcs}</td>
                                    <td>{lot.cts}</td>
                                    <td>{lot.weight}</td>
                                    <td>{new Date(lot.supply_date).toLocaleDateString()}</td>
                                    <td className="actions-cell">
                                        <button className="view-btn" onClick={() => navigate(`/view/${lot._id}`)}>View</button>
                                        <button className="edit-btn" onClick={() => navigate(`/edit/${lot._id}`)}>Edit</button>
                                        <button className="delete-btn" onClick={() => handleDelete(lot._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SupplyLotList;