import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../MainInventroy/Nav/Sidebar";
import "../MainInventroy/Nav/Sidebar.css";
import "../Styles/ViewNewSupply.css"; // Assuming this is your CSS file

// Helper function to format date
const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        });
    } catch {
        return dateString;
    }
};

// Helper function to render a single detail item
const DetailItem = ({ label, value, fullWidth = false }) => (
    <div className="profile-item" style={fullWidth ? { gridColumn: '1 / -1' } : {}}>
        <span className="profile-label">{label}</span>
        <span className="profile-value">{value || 'N/A'}</span>
    </div>
);


function ViewSupplyLot() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lot, setLot] = useState(null);

    useEffect(() => {
        const fetchLot = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/supplylot/${id}`);
                setLot(res.data);
            } catch (error) {
                console.error("Failed to fetch lot details:", error);
                setLot(false);
            }
        };
        fetchLot();
    }, [id]);

    if (lot === false) return <p className="loading-message">Error: Lot not found or failed to load.</p>;
    if (!lot) return <p className="loading-message">Loading...</p>;

    return (
        <div className="view-container">
          <Sidebar />
            <h2 className="view-header">Supply Details: <span className="highlight-id">{lot.stone_code}</span></h2>

            {/* Main Content Card */}
            <div className="profile-card">
                
                {/* -------------------------------------- */}
                {/* 💎 STONE DETAILS SECTION */}
                {/* -------------------------------------- */}
                <h3 className="section-title">Stone & Inventory Details</h3>
                <div className="profile-grid">
                    <DetailItem label="Stone Code" value={lot.stone_code} />
                    <DetailItem label="Supply Date" value={formatDate(lot.supply_date)} />
                    
                    <DetailItem label="Type" value={lot.type} />
                    <DetailItem label="Color Note" value={lot.color_note} />
                    
                    <DetailItem label="Size" value={lot.size} />
                    <DetailItem label="Current Stage" value={lot.currentStage_id} />

                    <DetailItem label="Pieces (PCS)" value={lot.pcs} />
                    <DetailItem label="Carats (CTS)" value={lot.cts} />
                    
                    <DetailItem label="Total Weight" value={`${lot.weight} g`} />
                    <DetailItem label="Record ID" value={lot._id} />
                    
                    <DetailItem label="Clarity Note" value={lot.clarity_note} fullWidth={true} />
                </div>

                {/* -------------------------------------- */}
                {/* 👥 SUPPLIER DETAILS SECTION */}
                {/* -------------------------------------- */}
                <h3 className="section-title" style={{ marginTop: '20px' }}>Supplier Information</h3>
                <div className="profile-grid">
                    <DetailItem label="Full Name" value={`${lot.full_name} ${lot.last_name}`} />
                    <DetailItem label="NIC / ID" value={lot.nic} />

                    <DetailItem label="Contact No." value={lot.contact_no} />
                    <DetailItem label="Email" value={lot.gmail} />
                    
                    <DetailItem label="Address" value={lot.Address} fullWidth={true} />
                </div>
            </div>


            {/* Actions */}
            <div className="actions-footer">
                <button
                    onClick={() => navigate(-1)} 
                    className="back-btn"
                >
                    ⬅ Back to List
                </button>
                <button
                    onClick={() => navigate(`/edit/${lot._id}`)}
                    className="edit-btn" 
                >
                    📝 Edit Lot
                </button>
            </div>
        </div>
    );
}

export default ViewSupplyLot;