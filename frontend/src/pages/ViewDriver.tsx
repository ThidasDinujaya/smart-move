
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { getDriverById } from "../utils/driverStorage";

function ViewDriver() {
  const navigate = useNavigate();
  const { id } = useParams();

  const driver = getDriverById(Number(id));

  if (!driver) {
    return (
      <div className="form-page">
        <div className="form-heading">
          <h1>Driver Not Found</h1>
          <p>Please select a driver from Driver Management.</p>
        </div>

        <button
          type="button"
          className="save-button"
          onClick={() => navigate("/drivers")}
        >
          Back to Drivers
        </button>
      </div>
    );
  }

  const statusClass = driver.status
    .toLowerCase()
    .replaceAll(" ", "-");

  return (
    <div className="form-page">
      <div className="details-page-header">
        <div>
          <h1>Driver Details</h1>
          <p>View complete driver information</p>
        </div>

        <button
          type="button"
          className="details-edit-button"
          onClick={() => navigate(`/drivers/edit/${driver.id}`)}
        >
          <Pencil size={17} />
          Edit Driver
        </button>
      </div>

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

        <div className="details-grid">
          <div className="detail-item">
            <span>Driver Name</span>
            <strong>{driver.name}</strong>
          </div>

          <div className="detail-item">
            <span>License Number</span>
            <strong>{driver.licenseNo}</strong>
          </div>

          <div className="detail-item">
            <span>Contact Number</span>
            <strong>{driver.contact}</strong>
          </div>

          <div className="detail-item">
            <span>Assigned Vehicle</span>
            <strong>{driver.assignedVehicle || "Not Assigned"}</strong>
          </div>

          <div className="detail-item">
            <span>Status</span>
            <strong>{driver.status}</strong>
          </div>
        </div>

        <div className="details-actions">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/drivers")}
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
