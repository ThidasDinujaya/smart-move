import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

const MaintenanceManagement = () => {
  const records = [
    { id: 1, vehicleNo: 'NB-1234', type: 'Oil Change', date: '2025-09-10', nextService: '2026-03-10', status: 'Completed' },
    { id: 2, vehicleNo: 'WP-5678', type: 'Brake Check', date: '2025-09-12', nextService: '2026-01-12', status: 'Pending' },
    { id: 3, vehicleNo: 'CP-9012', type: 'Engine Service', date: '2025-08-01', nextService: '2026-02-01', status: 'Overdue' },
    { id: 4, vehicleNo: 'EP-3456', type: 'General Service', date: '2025-09-20', nextService: '2026-03-20', status: 'Completed' },
    { id: 5, vehicleNo: 'NB-7788', type: 'Tire Replacement', date: '2025-09-18', nextService: '2026-03-18', status: 'Scheduled' },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <div className="content-body">
          <div className="page-header">
            <div>
              <h1 className="page-title">Maintenance Management</h1>
              <p className="page-desc">Manage vehicle maintenance records</p>
            </div>
            <Link to="/maintenance/add" className="btn-primary">+ Add Maintenance</Link>
          </div>

          <div className="stats-grid">
            <div className="stat-card blue">
              <span className="stat-icon">🚌</span>
              <div><div className="stat-title">Total Vehicles</div><div className="stat-value">24</div></div>
            </div>
            <div className="stat-card green">
              <span className="stat-icon">🔧</span>
              <div><div className="stat-title">Upcoming Service</div><div className="stat-value">5</div></div>
            </div>
            <div className="stat-card orange">
              <span className="stat-icon">⚠️</span>
              <div><div className="stat-title">Overdue Service</div><div className="stat-value">2</div></div>
            </div>
            <div className="stat-card purple">
              <span className="stat-icon">✅</span>
              <div><div className="stat-title">Completed This Month</div><div className="stat-value">8</div></div>
            </div>
          </div>

          <div className="table-card">
            <div className="table-header-title">Maintenance Records</div>
            <div className="filters-row">
              <input type="text" className="filter-input search" placeholder="🔍 Search maintenance records..." />
              <select className="filter-input select"><option>All Vehicles</option></select>
              <select className="filter-input select"><option>All Status</option></select>
              <input type="date" className="filter-input date" />
            </div>

            <table className="custom-table">
              <thead>
                <tr>
                  <th>#</th><th>Vehicle No</th><th>Maintenance Type</th><th>Date</th><th>Next Service</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td><td>{r.vehicleNo}</td><td>{r.type}</td><td>{r.date}</td><td>{r.nextService}</td>
                    <td><span className={`badge ${r.status.toLowerCase()}`}>{r.status}</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-icon view">👁️</button>
                        <button className="btn-icon edit">✏️</button>
                        <button className="btn-icon delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceManagement;