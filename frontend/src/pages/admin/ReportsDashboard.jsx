import Icon from '../../components/Icon.jsx';
import PageHeader from '../../components/PageHeader.jsx';

const metricCards = [
  { key: 'vehiclesDueForMaintenance', title: 'Vehicles Due for Maintenance', note: 'Require service', icon: 'wrench', tone: 'orange' },
  { key: 'driverAverageRating', title: 'Driver Ratings', note: 'Average rating', icon: 'users', tone: 'green' },
  { key: 'vehicleAverageRating', title: 'Vehicle Ratings', note: 'Average rating', icon: 'bus', tone: 'purple' },
  { key: 'feedbackTotal', title: 'Feedback Summary', note: 'Total reviews', icon: 'message', tone: 'blue' },
];

const maintenanceStatusItems = [
  { key: 'completed', label: 'Completed' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'pending', label: 'Pending' },
  { key: 'overdue', label: 'Overdue' },
];

function displayValue(value) {
  return value === null || value === undefined || value === '' ? '—' : value;
}

export default function ReportsDashboard({ report }) {
  const distribution = Array.isArray(report?.ratingDistribution) ? report.ratingDistribution : [];
  const maximumRatingCount = Math.max(0, ...distribution.map((item) => Number(item.count) || 0));
  const maintenanceStatus = report?.maintenanceStatus || {};

  return (
    <section className="page">
      <PageHeader title="Reports Dashboard" subtitle="Maintenance and passenger feedback overview" />

      <div className="report-cards">
        {metricCards.map((metric) => (
          <article className={'stat-card ' + metric.tone} key={metric.key}>
            <Icon name={metric.icon} size={22} />
            <div>
              <div className="stat-title">{metric.title}</div>
              <div className="stat-value">{displayValue(report?.[metric.key])}</div>
              <div className="stat-note">{metric.note}</div>
            </div>
          </article>
        ))}
      </div>

      <div className="report-grid">
        <section className="report-panel" aria-labelledby="maintenance-status-title">
          <h2 id="maintenance-status-title">Maintenance Status</h2>
          <div className="maintenance-summary">
            <div className="maintenance-total">
              <strong>{displayValue(report?.totalVehicles)}</strong>
              <span>Vehicles</span>
            </div>
            <ul>
              {maintenanceStatusItems.map((item) => (
                <li key={item.key}>
                  <span className={'legend-dot ' + item.key} />
                  {item.label}
                  <b>{displayValue(maintenanceStatus[item.key])}</b>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="report-panel" aria-labelledby="rating-distribution-title">
          <h2 id="rating-distribution-title">Rating Distribution</h2>
          {distribution.length ? (
            <div className="rating-chart">
              {distribution.map((item) => {
                const count = Number(item.count) || 0;
                const height = maximumRatingCount ? (count / maximumRatingCount) * 110 : 0;
                return (
                  <div className="rating-bar" key={item.rating}>
                    <span>{count}</span>
                    <div style={{ height: height + 'px' }} />
                    <b>{item.rating} stars</b>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="report-empty">No rating distribution is available.</p>
          )}
        </section>
      </div>
    </section>
  );
}
