
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { getRouteById } from "../utils/routeStorage";

function ViewRoute() {
  const navigate = useNavigate();
  const { id } = useParams();

  const route = getRouteById(Number(id));

  if (!route) {
    return (
      <div className="form-page">
        <div className="form-heading">
          <h1>Route Not Found</h1>
          <p>Please select a route from Route Management.</p>
        </div>

        <button
          className="save-button"
          onClick={() => navigate("/routes")}
        >
          Back to Routes
        </button>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="details-page-header">
        <div>
          <h1>Route Details</h1>
          <p>View complete route information</p>
        </div>

        <button
          type="button"
          className="details-edit-button"
          onClick={() =>
            navigate(`/routes/edit/${route.id}`)
          }
        >
          <Pencil size={17} />
          Edit Route
        </button>
      </div>

      <div className="details-card">
        <div className="details-title">
          <div>
            <h2>{route.routeName}</h2>
            <p>
              {route.startLocation} → {route.endLocation}
            </p>
          </div>

          <span
            className={`driver-status ${route.status.toLowerCase()}`}
          >
            {route.status}
          </span>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span>Route Name</span>
            <strong>{route.routeName}</strong>
          </div>

          <div className="detail-item">
            <span>Start Location</span>
            <strong>{route.startLocation}</strong>
          </div>

          <div className="detail-item">
            <span>End Location</span>
            <strong>{route.endLocation}</strong>
          </div>

          <div className="detail-item">
            <span>Distance</span>
            <strong>{route.distance} km</strong>
          </div>

          <div className="detail-item">
            <span>Estimated Duration</span>
            <strong>{route.estimatedDuration || "Not specified"}</strong>
          </div>

          <div className="detail-item">
            <span>Assigned Vehicle</span>
            <strong>{route.assignedVehicle || "Not Assigned"}</strong>
          </div>

          <div className="detail-item">
            <span>Status</span>
            <strong>{route.status}</strong>
          </div>
        </div>

        <div className="details-actions">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/routes")}
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
