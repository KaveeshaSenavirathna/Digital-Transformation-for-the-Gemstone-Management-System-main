import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaDownload, FaQrcode } from "react-icons/fa";
import "../Styles/CertificateVerification.css";

const VERIFY_URL = "http://localhost:5000/certificates/verify";

function CertificateVerification() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    verifyCertificate();
  }, [id]);

  const verifyCertificate = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${VERIFY_URL}/${id}`);
      
      if (response.data.valid) {
        setCertificate(response.data.certificate);
        setVerificationStatus('valid');
      } else {
        setError(response.data.error || 'Invalid certificate');
        setVerificationStatus('invalid');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.response?.data?.error || 'Certificate not found or verification failed');
      setVerificationStatus('invalid');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const downloadCertificate = () => {
    // This would typically download the actual certificate PDF
    alert('Certificate download functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className="verification-container">
        <div className="verification-card loading">
          <div className="loading-spinner">
            <FaSpinner className="spinner" />
          </div>
          <h2>Verifying Certificate...</h2>
          <p>Please wait while we verify the certificate details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="verification-container">
      <div className="verification-card">
        <div className="verification-header">
          <div className="status-icon">
            {verificationStatus === 'valid' ? (
              <FaCheckCircle className="valid-icon" />
            ) : (
              <FaTimesCircle className="invalid-icon" />
            )}
          </div>
          <h1>
            {verificationStatus === 'valid' 
              ? 'Certificate Verified Successfully' 
              : 'Certificate Verification Failed'
            }
          </h1>
          <p className="verification-subtitle">
            {verificationStatus === 'valid' 
              ? 'This certificate has been verified and is authentic.' 
              : 'This certificate could not be verified or does not exist.'
            }
          </p>
        </div>

        {verificationStatus === 'valid' && certificate && (
          <div className="certificate-details">
            <h2>Certificate Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <label>Certificate Number:</label>
                <span className="cert-number">{certificate.certificate_number}</span>
              </div>
              <div className="detail-item">
                <label>Certificate Type:</label>
                <span>{certificate.certificate_type}</span>
              </div>
              <div className="detail-item">
                <label>Laboratory:</label>
                <span className="lab-name">{certificate.lab_name}</span>
              </div>
              <div className="detail-item">
                <label>Issue Date:</label>
                <span>{formatDate(certificate.issue_date)}</span>
              </div>
              <div className="detail-item">
                <label>Origin:</label>
                <span>{certificate.origin || 'Not specified'}</span>
              </div>
              <div className="detail-item">
                <label>Variety:</label>
                <span>{certificate.variety || 'Not specified'}</span>
              </div>
              <div className="detail-item">
                <label>Created:</label>
                <span>{formatDate(certificate.created_at)}</span>
              </div>
              <div className="detail-item">
                <label>Last Updated:</label>
                <span>{formatDate(certificate.updated_at)}</span>
              </div>
            </div>

            <div className="verification-actions">
              <button 
                className="download-btn"
                onClick={downloadCertificate}
              >
                <FaDownload /> Download Certificate
              </button>
              <button 
                className="qr-btn"
                onClick={() => window.print()}
              >
                <FaQrcode /> Print Verification
              </button>
            </div>
          </div>
        )}

        {verificationStatus === 'invalid' && (
          <div className="error-details">
            <h2>Verification Error</h2>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <button 
                className="retry-btn"
                onClick={verifyCertificate}
              >
                Try Again
              </button>
              <button 
                className="home-btn"
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </button>
            </div>
          </div>
        )}

        <div className="verification-footer">
          <p>
            <strong>Verification ID:</strong> {id}
          </p>
          <p>
            <strong>Verified on:</strong> {new Date().toLocaleString()}
          </p>
          <p className="disclaimer">
            This verification is provided by the Gemstone Management System. 
            For official verification, please contact the issuing laboratory directly.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CertificateVerification;
