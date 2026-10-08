import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const AddMaintenance = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <div className="content-body">
          <div className="page-header">
            <div>
              <h1 className="page-title">Add Maintenance Record</h1>
              <p className="page-desc">Enter maintenance details for the vehicle</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-section">
              <div className="form-section-title">Maintenance Details</div>
              <div className="form-group">
                <label>Vehicle *</label>
                <select className="form-control"><option>NB-1234 (Bus)</option></select>
              </div>
              <div className="form-group">
                <label>Maintenance Type *</label>
                <select className="form-control"><option>Oil Change</option></select>
              </div>
              <div className="form-group">
                <label>Service Date *</label>
                <input type="text" className="form-control" defaultValue="28/09/2025" />
              </div>
              <div className="form-group">
                <label>Next Service Date *</label>
                <input type="text" className="form-control" defaultValue="28/03/2026" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows="3" defaultValue="Change engine oil and oil filter."></textarea>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title">Additional Information</div>
              <div className="form-group">
                <label>Service Cost (Rs.)</label>
                <input type="text" className="form-control" defaultValue="8500.00" />
              </div>
              <div className="form-group">
                <label>Service Provider</label>
                <input type="text" className="form-control" defaultValue="ABC Auto Services" />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select className="form-control"><option>Scheduled</option></select>
              </div>
              <div className="form-group">
                <label>Attachment (Invoice/Document)</label>
                <div className="file-upload">
                  📄 Choose File <span style={{ color: '#64748b' }}>invoice.pdf</span>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary" onClick={() => navigate('/maintenance')}>💾 Save</button>
                <button className="btn-secondary" onClick={() => navigate('/maintenance')}>🚫 Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMaintenance;