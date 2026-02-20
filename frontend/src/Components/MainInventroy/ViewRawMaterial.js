import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../Styles/ViewRawMaterial.css";

const RAW_URL = "http://localhost:5000/rawmaterials";

function ViewRawMaterial() {
  const { id } = useParams();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const res = await axios.get(`${RAW_URL}/${id}`);
        setMaterial(res.data);
      } catch (err) {
        console.error("Error fetching raw material:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterial();
  }, [id]);

  if (loading) {
    return <p className="view-material-container">Loading material details...</p>;
  }

  if (!material) {
    return <p className="view-material-container">Material not found.</p>;
  }

  const isLowStock = material.quantity <= 5; // Highlight low-stock

  return (
    <div className="view-material-container">
      <h2>Raw Material Details</h2>
      <table className="view-material-table">
        <tbody>
          <tr>
            <th>Name</th>
            <td>{material.material_name}</td>
          </tr>
          <tr>
            <th>Category</th>
            <td>{material.category}</td>
          </tr>
          <tr className={isLowStock ? "low-stock" : ""}>
            <th>Quantity</th>
            <td>{material.quantity}</td>
          </tr>
          <tr>
            <th>Unit</th>
            <td>{material.unit_value} {material.unit_type}</td>
          </tr>
          <tr>
            <th>Supplier</th>
            <td>{material.supplier || "N/A"}</td>
          </tr>
          <tr>
            <th>Arrival Date</th>
            <td>{material.arrival_date?.substring(0, 10)}</td>
          </tr>
          <tr>
            <th>Expire Date</th>
            <td>{material.expire_date?.substring(0, 10) || "N/A"}</td>
          </tr>
          <tr>
            <th>Price</th>
            <td>{material.price}</td>
          </tr>
          <tr>
            <th>Notes</th>
            <td>{material.notes || "N/A"}</td>
          </tr>
        </tbody>
      </table>

      <Link to="/raw_m">
        <button className="back-btn">Back</button>
      </Link>
    </div>
  );
}

export default ViewRawMaterial;
