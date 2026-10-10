
import { ArrowLeft, Pencil } from 'lucide-react';

function ViewDriver({ driver, onBack, onEdit }) {
  if (!driver) {
    return (
      <div className="form-page view-driver-page">
        <div className="form-heading">
          <h1>Driver Not Found</h1>
          <p>Please select a driver from Driver Management.</p>
        </div>

        <button
          type="button"
          className="save-button"
          onClick={onBack}
        >
          <ArrowLeft size={17} />
          Back to Drivers
        </button>
      </div>
    );
  }

  const statusClass = String(driver.status || '')
    .toLowerCase()
    .replaceAll(' ', '-');

  return (
    <div className="form-page view-driver-page">
      {/* PAGE HEADER */}
      <div className="details-page-header">
        <div>
          <h1>Driver Details</h1>
          <p>View complete driver information</p>
        </div>

        <button
          type="button"
          className="details-edit-button"
          onClick={() => onEdit(driver)}
        >
          <Pencil size={17} />
          Edit Driver
        </button>
      </div>

      {/* DRIVER DETAILS CARD */}
      <div className="details-card">
        <div className="details-title">
          <div>
            <h2>{driver.name}</h2>
            <p>License: {driver.licenseNo}</p>
          </div>

          <span className={`driver-status ${statusClass}`}>
            {driver.status}
          </span>
        </div>

        {/* DRIVER INFORMATION */}
        <div className="details-grid">
          <div className="detail-item">
            <span>Driver Name</span>
            <strong>{driver.name || 'Not specified'}</strong>
          </div>

          <div className="detail-item">
            <span>NIC Number</span>
            <strong>{driver.nic || 'Not specified'}</strong>
          </div>

          <div className="detail-item">
            <span>License Number</span>
            <strong>{driver.licenseNo || 'Not specified'}</strong>
          </div>

          <div className="detail-item">
            <span>Contact Number</span>
            <strong>
              {driver.contact || driver.phone || 'Not specified'}
            </strong>
          </div>

          <div className="detail-item">
            <span>Email Address</span>
            <strong>{driver.email || 'Not specified'}</strong>
          </div>

          <div className="detail-item">
            <span>Assigned Vehicle</span>
            <strong>
              {driver.assignedVehicle || 'Not Assigned'}
            </strong>
          </div>

          <div className="detail-item">
            <span>Status</span>
            <strong>{driver.status || 'Not specified'}</strong>
          </div>

          <div className="detail-item">
            <span>Address</span>
            <strong>{driver.address || 'Not specified'}</strong>
          </div>
        </div>

        {/* BACK BUTTON */}
        <div className="details-actions">
          <button
            type="button"
            className="back-button"
            onClick={onBack}
          >
            <ArrowLeft size={17} />
            Back to Drivers
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewDriver;
