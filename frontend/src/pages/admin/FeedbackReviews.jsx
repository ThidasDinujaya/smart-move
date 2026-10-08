import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const FeedbackReviews = () => {
  const reviews = [
    { id: 1, name: 'Nimal Perera', route: 'Colombo - Kandy', rating: '⭐⭐⭐⭐⭐', comment: 'Excellent service and comfortable journey.', date: '2025-09-28' },
    { id: 2, name: 'Sanduni Fernando', route: 'Colombo - Galle', rating: '⭐⭐⭐⭐☆', comment: 'Clean bus and friendly staff.', date: '2025-09-27' },
    { id: 3, name: 'Kasun Silva', route: 'Kandy - Matara', rating: '⭐⭐⭐⭐⭐', comment: 'Very punctual and safe trip.', date: '2025-09-26' },
    { id: 4, name: 'Rashmi Jayasinghe', route: 'Colombo - Jaffna', rating: '⭐⭐⭐⭐☆', comment: 'Good service, but seats could be more comfortable.', date: '2025-09-25' },
    { id: 5, name: 'Dilshan Perera', route: 'Colombo - Anuradhapura', rating: '⭐⭐⭐☆☆', comment: 'AC was not working properly.', date: '2025-09-24' },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <div className="content-body">
          <div className="page-header">
            <div>
              <h1 className="page-title">Feedback & Reviews</h1>
              <p className="page-desc">View and manage passenger feedback and reviews</p>
            </div>
            <button className="btn-primary">+ Add Feedback</button>
          </div>

          <div className="stats-grid">
            <div className="stat-card pink">
              <span className="stat-icon">💬</span>
              <div><div className="stat-title">Total Reviews</div><div className="stat-value">125</div></div>
            </div>
            <div className="stat-card green">
              <span className="stat-icon">⭐</span>
              <div><div className="stat-title">Average Rating</div><div className="stat-value">4.3</div></div>
            </div>
            <div className="stat-card blue">
              <span className="stat-icon">👍</span>
              <div><div className="stat-title">Positive Reviews</div><div className="stat-value">102</div></div>
            </div>
            <div className="stat-card orange">
              <span className="stat-icon">👎</span>
              <div><div className="stat-title">Complaints</div><div className="stat-value">8</div></div>
            </div>
          </div>

          <div className="table-card">
            <div className="table-header-title">Passenger Reviews</div>
            <div className="filters-row">
              <input type="text" className="filter-input search" placeholder="🔍 Search reviews..." />
              <select className="filter-input select"><option>All Routes</option></select>
              <select className="filter-input select"><option>All Ratings</option></select>
              <input type="date" className="filter-input date" />
            </div>

            <table className="custom-table">
              <thead>
                <tr>
                  <th>#</th><th>Passenger</th><th>Route</th><th>Rating</th><th>Comment</th><th>Date</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td><td>{r.name}</td><td>{r.route}</td>
                    <td style={{ color: '#f59e0b' }}>{r.rating}</td>
                    <td>{r.comment}</td><td>{r.date}</td>
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

export default FeedbackReviews;