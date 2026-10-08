import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const ReportsDashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <div className="content-body">
          <div className="page-header">
            <div>
              <h1 className="page-title">Reports Dashboard</h1>
              <p className="page-desc">View analytical reports for maintenance and feedback</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <select className="filter-input" style={{ width: '180px' }}><option>Maintenance Report</option></select>
              <button className="btn-primary">Generate Report</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div className="stat-card pink" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span className="stat-icon" style={{ color: '#ef4444' }}>🔧</span>
                <div><div className="stat-title">Vehicles Due for Maintenance</div><div className="stat-value">2</div></div>
              </div>
              <button className="btn-primary" style={{ backgroundColor: '#ef4444', padding: '6px 12px', fontSize: '11px' }}>View Report</button>
            </div>

            <div className="stat-card green" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span className="stat-icon" style={{ color: '#16a34a' }}>👤</span>
                <div><div className="stat-title">Driver Ratings</div><div className="stat-value">4.5 <span style={{ fontSize: '11px', color: '#64748b' }}>Average Rating</span></div></div>
              </div>
              <button className="btn-primary" style={{ backgroundColor: '#16a34a', padding: '6px 12px', fontSize: '11px' }}>View Report</button>
            </div>

            <div className="stat-card purple" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span className="stat-icon" style={{ color: '#9333ea' }}>🚌</span>
                <div><div className="stat-title">Vehicle Ratings</div><div className="stat-value">4.3 <span style={{ fontSize: '11px', color: '#64748b' }}>Average Rating</span></div></div>
              </div>
              <button className="btn-primary" style={{ backgroundColor: '#9333ea', padding: '6px 12px', fontSize: '11px' }}>View Report</button>
            </div>

            <div className="stat-card blue" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span className="stat-icon" style={{ color: '#0066ff' }}>💬</span>
                <div><div className="stat-title">Feedback Summary</div><div className="stat-value">125 <span style={{ fontSize: '11px', color: '#64748b' }}>Total Reviews</span></div></div>
              </div>
              <button className="btn-primary" style={{ backgroundColor: '#0066ff', padding: '6px 12px', fontSize: '11px' }}>View Report</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="table-card">
              <div className="table-header-title">Maintenance Status</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '30px' }}>
                <div style={{ width: '130px', height: '130px', borderRadius: '50%', border: '16px solid #16a34a', borderTopColor: '#ef4444', borderRightColor: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  24<br/>Vehicles
                </div>
                <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>🟢 Completed (12)</div>
                  <div>🔵 Scheduled (5)</div>
                  <div>🟡 Pending (5)</div>
                  <div>🔴 Overdue (2)</div>
                </div>
              </div>
            </div>

            <div className="table-card">
              <div className="table-header-title">Rating Distribution</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', padding: '0 20px' }}>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: '10px' }}>5</div><div style={{ width: '30px', height: '20px', backgroundColor: '#ef4444', borderRadius: '4px 4px 0 0' }}></div><div>1</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: '10px' }}>12</div><div style={{ width: '30px', height: '40px', backgroundColor: '#60a5fa', borderRadius: '4px 4px 0 0' }}></div><div>2</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: '10px' }}>25</div><div style={{ width: '30px', height: '80px', backgroundColor: '#60a5fa', borderRadius: '4px 4px 0 0' }}></div><div>3</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: '10px' }}>40</div><div style={{ width: '30px', height: '120px', backgroundColor: '#3b82f6', borderRadius: '4px 4px 0 0' }}></div><div>4</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: '10px' }}>43</div><div style={{ width: '30px', height: '140px', backgroundColor: '#2563eb', borderRadius: '4px 4px 0 0' }}></div><div>5</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;