
import { ArrowLeft, Pencil } from 'lucide-react';

function ViewVehicle({ vehicle, onBack, onEdit }) {
  if (!vehicle) {
    return (
      <div className="form-page view-vehicle-page">
        <div className="form-heading">
          <h1>Vehicle Not Found</h1>
          <p>
            Please return to Vehicle Management and select
            a vehicle.
          </p>
        </div>

        <button
          type="button"
          className="save-button"
          onClick={onBack}
        >
          Back to Vehicles
        </button>
      </div>
    );
  }

  const getStatusClass = (status) =>
    String(status || 'unknown')
      .toLowerCase()
      .replaceAll(' ', '-');

  return (
    <div className="form-page view-vehicle-page">
      <div className="details-page-header">
        <div>
          <h1>Vehicle Details</h1>
          <p>View complete vehicle information</p>
        </div>

        <button
          type="button"
          className="details-edit-button"
          onClick={() => onEdit(vehicle)}
        >
          <Pencil size={17} />
          Edit Vehicle
        </button>
      </div>

      <div className="details-card">
        <div className="details-title">
          <div>
            <h2>{vehicle.vehicleNo}</h2>
            <p>
              {vehicle.brand} {vehicle.model || ''}
            </p>
          </div>

          <span
            className={`vehicle-status ${getStatusClass(
              vehicle.status
            )}`}
          >
            {vehicle.status || 'Not specified'}
          </span>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span>Vehicle Number</span>
            <strong>{vehicle.vehicleNo}</strong>
          </div>

          <div className="detail-item">
            <span>Vehicle Type</span>
            <strong>
              {vehicle.type || vehicle.vehicleType || 'Not specified'}
            </strong>
          </div>

          <div className="detail-item">
            <span>Brand</span>
            <strong>{vehicle.brand}</strong>
          </div>

          <div className="detail-item">
            <span>Model</span>
            <strong>{vehicle.model || 'Not specified'}</strong>
          </div>

          <div className="detail-item">
            <span>Manufacture Year</span>
            <strong>{vehicle.year || 'Not specified'}</strong>
          </div>

          <div className="detail-item">
            <span>Capacity</span>
            <strong>
              {vehicle.capacity != null && vehicle.capacity !== ''
                ? `${vehicle.capacity} Seats`
                : 'Not specified'}
            </strong>
          </div>

          <div className="detail-item">
            <span>Status</span>
            <strong>{vehicle.status || 'Not specified'}</strong>
          </div>

          <div className="detail-item">
            <span>Last Service Date</span>
            <strong>
              {vehicle.lastService ||
                vehicle.serviceDate ||
                'Not specified'}
            </strong>
          </div>
        </div>

        <div className="details-actions">
          <button
            type="button"
            className="back-button"
            onClick={onBack}
          >
            <ArrowLeft size={17} />
            Back to Vehicles
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewVehicle;
