import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react"; // ✅ Import QR

function PrintEmployeeIDCard() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/employees/${id}`);
        setEmployee(res.data);
      } catch (err) {
        console.error("Error fetching employee:", err);
      }
    };
    fetchEmployee();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (!employee) return <div>Loading employee data...</div>;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {/* ID Card */}
      <div
        id="id-card"
        style={{
          border: "2px solid #333",
          width: "350px",
          padding: "20px",
          margin: "auto",
          borderRadius: "10px",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f7f7f7",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        }}
      >
        <h3>Company Name</h3>
        <h4>Employee ID Card</h4>
        {employee.photo && (
          <img
            src={`http://localhost:5000/uploads/${employee.photo}`}
            alt="Employee"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              marginBottom: "10px",
            }}
          />
        )}
        <p><strong>Name:</strong> {employee.name}</p>
        <p><strong>Reg ID:</strong> {employee.registrationId}</p>
        <p><strong>Department:</strong> {employee.department}</p>
        <p><strong>Designation:</strong> {employee.designation}</p>

        {/* ✅ QR Code for Attendance */}
        <div style={{ marginTop: "15px" }}>
          <QRCodeCanvas
            value={employee.registrationId} // encode registrationId
            size={100}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin={true}
          />
          <p style={{ fontSize: "12px" }}>Scan for Attendance</p>
        </div>
      </div>

      {/* Print button (hidden in print) */}
      <button
        onClick={handlePrint}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        className="no-print"
      >
        Print ID Card
      </button>

      {/* Print-specific CSS */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #id-card, #id-card * {
              visibility: visible;
            }
            #id-card {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              margin: auto;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default PrintEmployeeIDCard;
