
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { getVehicleById } from "../utils/vehicleStorage";

function ViewVehicle() {
  const navigate = useNavigate();
  const { id } = useParams();

  const vehicle = getVehicleById(Number(id));

  if (!vehicle) {
    return (
      <div className="form-page">
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
          onClick={() => navigate("/vehicles")}
        >
          Back to Vehicles
        </button>
      </div>
    );
  }

  const getStatusClass = (status: string) =>
    status.toLowerCase().replaceAll(" ", "-");

  return (
    <div className="form-page">
      <div className="details-page-header">
        <div>
          <h1>Vehicle Details</h1>
          <p>View complete vehicle information</p>
        </div>

        <button
          type="button"
          className="details-edit-button"
          onClick={() =>
            navigate(`/vehicles/edit/${vehicle.id}`)
          }
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
              {vehicle.brand} {vehicle.model ?? ""}
            </p>
          </div>

          <span
            className={`vehicle-status ${getStatusClass(
              vehicle.status
            )}`}
          >
            {vehicle.status}
          </span>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span>Vehicle Number</span>
            <strong>{vehicle.vehicleNo}</strong>
          </div>

          <div className="detail-item">
            <span>Vehicle Type</span>
            <strong>{vehicle.type}</strong>
          </div>

          <div className="detail-item">
            <span>Brand</span>
            <strong>{vehicle.brand}</strong>
          </div>

          <div className="detail-item">
            <span>Model</span>
            <strong>{vehicle.model || "Not specified"}</strong>
          </div>

          <div className="detail-item">
            <span>Manufacture Year</span>
            <strong>{vehicle.year || "Not specified"}</strong>
          </div>

          <div className="detail-item">
            <span>Capacity</span>
            <strong>{vehicle.capacity} Seats</strong>
          </div>

          <div className="detail-item">
            <span>Status</span>
            <strong>{vehicle.status}</strong>
          </div>

          <div className="detail-item">
            <span>Last Service Date</span>
            <strong>
              {vehicle.lastService || "Not specified"}
            </strong>
          </div>
        </div>

        <div className="details-actions">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/vehicles")}
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
