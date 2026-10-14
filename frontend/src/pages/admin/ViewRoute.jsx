
import { ArrowLeft, Pencil } from 'lucide-react';

function ViewRoute({ route, onBack, onEdit }) {
  if (!route) {
    return (
      <div className="form-page view-route-page">
        <div className="form-heading">
          <h1>Route Not Found</h1>
          <p>Please select a route from Route Management.</p>
        </div>

        <button
          type="button"
          className="save-button"
          onClick={onBack}
        >
          <ArrowLeft size={17} />
          Back to Routes
        </button>
      </div>
    );
  }

  const details = [
    ['Route Number', route.routeNo],
    ['Route Name', route.routeName],
    ['Start Location', route.startLocation],
    ['End Location', route.endLocation],
    ['Distance', route.distance ? `${route.distance} km` : '-'],
    ['Estimated Travel Time', route.estimatedTime],
    ['Fare', `LKR ${Number(route.fare || 0).toFixed(2)}`],
    ['Status', route.status],
    ['Description', route.description],
  ];

  return (
    <div className="form-page view-route-page">
      <div className="details-page-header">
        <div>
          <h1>Route Details</h1>
          <p>View complete route information</p>
        </div>

        <button
          type="button"
          className="details-edit-button"
          onClick={() => onEdit(route)}
        >
          <Pencil size={17} />
          Edit Route
        </button>
      </div>

      <div className="details-card">
        <div className="details-title">
          <div>
            <h2>{route.routeName}</h2>
            <p>Route No: {route.routeNo}</p>
          </div>

          <span className={`route-status ${
            String(route.status || '').toLowerCase()
          }`}>
            {route.status}
          </span>
        </div>

        <div className="details-grid">
          {details.map(([label, value]) => (
            <div className="detail-item" key={label}>
              <span>{label}</span>
              <strong>{value || 'Not specified'}</strong>
            </div>
          ))}
        </div>

        <div className="details-actions">
          <button
            type="button"
            className="back-button"
            onClick={onBack}
          >
            <ArrowLeft size={17} />
            Back to Routes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewRoute;
