```jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Icon from '../../components/Icon.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import '../../styles/ReportsDashboard.css';

const metricCards = [
  {
    key: 'vehiclesDueForMaintenance',
    title: 'Vehicles Due for Maintenance',
    note: 'Require service',
    icon: 'wrench',
    tone: 'orange',
  },
  {
    key: 'driverAverageRating',
    title: 'Driver Ratings',
    note: 'Average rating',
    icon: 'users',
    tone: 'green',
  },
  {
    key: 'vehicleAverageRating',
    title: 'Vehicle Ratings',
    note: 'Average rating',
    icon: 'bus',
    tone: 'purple',
  },
  {
    key: 'feedbackTotal',
    title: 'Feedback Summary',
    note: 'Total reviews',
    icon: 'message',
    tone: 'blue',
  },
];

const maintenanceStatusItems = [
  { key: 'completed', label: 'Completed' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'due', label: 'Due' },
  { key: 'pending', label: 'Pending' },
  { key: 'overdue', label: 'Overdue' },
];

function displayValue(value) {
  return value === null || value === undefined || value === ''
    ? '—'
    : value;
}

export default function ReportsDashboard({ report = {} }) {
  const distribution = Array.isArray(report?.ratingDistribution)
    ? report.ratingDistribution
    : [];

  const maximumRatingCount = Math.max(
    0,
    ...distribution.map((item) => Number(item.count) || 0)
  );

  const maintenanceStatus = report?.maintenanceStatus || {};

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-wrapper">
        <Header />

        <div className="content-body reports-dashboard">
          <PageHeader
            title="Reports Dashboard"
            subtitle="Maintenance and passenger feedback overview"
          />

          <div className="report-cards">
            {metricCards.map((metric) => (
              <article
                className={`stat-card ${metric.tone}`}
                key={metric.key}
              >
                <Icon name={metric.icon} size={22} />

                <div>
                  <div className="stat-title">{metric.title}</div>
                  <div className="stat-value">
                    {displayValue(report?.[metric.key])}
                  </div>
                  <div className="stat-note">{metric.note}</div>
                </div>
              </article>
            ))}
          </div>

          <section className="report-section">
            <h2>Maintenance Status</h2>

            <div className="maintenance-status-list">
              {maintenanceStatusItems.map((item) => (
                <div className="maintenance-status-item" key={item.key}>
                  <span>{item.label}</span>
                  <strong>
                    {displayValue(maintenanceStatus[item.key] ?? 0)}
                  </strong>
                </div>
              ))}
            </div>
          </section>

          <section className="report-section">
            <h2>Rating Distribution</h2>

            {distribution.length === 0 ? (
              <p>No rating data available.</p>
            ) : (
              <div className="rating-distribution">
                {distribution.map((item, index) => {
                  const count = Number(item.count) || 0;
                  const percentage =
                    maximumRatingCount > 0
                      ? (count / maximumRatingCount) * 100
                      : 0;

                  return (
                    <div className="rating-row" key={item.rating ?? index}>
                      <span>{item.rating ?? index + 1} Stars</span>

                      <div className="rating-bar">
                        <div
                          className="rating-bar-fill"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <strong>{count}</strong>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
```