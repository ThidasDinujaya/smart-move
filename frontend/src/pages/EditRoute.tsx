
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getRouteById,
  updateRoute,
} from "../utils/routeStorage";

import type { TransportRoute } from "../utils/routeStorage";

function EditRoute() {
  const navigate = useNavigate();
  const { id } = useParams();

  const route = getRouteById(Number(id));

  const [routeName, setRouteName] = useState(
    route?.routeName ?? ""
  );
  const [startLocation, setStartLocation] = useState(
    route?.startLocation ?? ""
  );
  const [endLocation, setEndLocation] = useState(
    route?.endLocation ?? ""
  );
  const [distance, setDistance] = useState(
    route?.distance.toString() ?? ""
  );
  const [estimatedDuration, setEstimatedDuration] = useState(
    route?.estimatedDuration ?? ""
  );
  const [assignedVehicle, setAssignedVehicle] = useState(
    route?.assignedVehicle ?? ""
  );
  const [status, setStatus] = useState(
    route?.status ?? "Active"
  );

  if (!route) {
    return (
      <div className="form-page">
        <div className="form-heading">
          <h1>Route Not Found</h1>
          <p>Please return to Route Management.</p>
        </div>

        <button
          type="button"
          className="save-button"
          onClick={() => navigate("/routes")}
        >
          Back to Routes
        </button>
      </div>
    );
  }

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const distanceNumber = Number(distance);

    if (
      !routeName.trim() ||
      !startLocation.trim() ||
      !endLocation.trim()
    ) {
      alert("Please fill all required fields!");
      return;
    }

    if (!Number.isFinite(distanceNumber) || distanceNumber <= 0) {
      alert("Please enter a valid distance!");
      return;
    }

    const updatedRoute: TransportRoute = {
      ...route,
      routeName: routeName.trim(),
      startLocation: startLocation.trim(),
      endLocation: endLocation.trim(),
      distance: distanceNumber,
      estimatedDuration: estimatedDuration.trim(),
      assignedVehicle: assignedVehicle.trim(),
      status,
    };

    try {
      updateRoute(updatedRoute);
      alert("Route updated successfully!");
      navigate("/routes");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to update route."
      );
    }
  };

  return (
    <div className="form-page">
      <div className="form-heading">
        <h1>Edit Route</h1>
        <p>Update route information</p>
      </div>

      <form
        className="vehicle-form-card"
        onSubmit={handleSubmit}
      >
        <div className="vehicle-form-content">
          <div className="vehicle-fields">
            <div className="form-grid">
              <div className="form-group">
                <label>
                  Route Name <span>*</span>
                </label>
                <input
                  type="text"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Start Location <span>*</span>
                </label>
                <input
                  type="text"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  End Location <span>*</span>
                </label>
                <input
                  type="text"
                  value={endLocation}
                  onChange={(e) => setEndLocation(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Distance (km) <span>*</span>
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Estimated Duration</label>
                <input
                  type="text"
                  value={estimatedDuration}
                  onChange={(e) =>
                    setEstimatedDuration(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Assigned Vehicle</label>
                <input
                  type="text"
                  value={assignedVehicle}
                  onChange={(e) =>
                    setAssignedVehicle(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Status <span>*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/routes")}
          >
            Cancel
          </button>

          <button type="submit" className="save-button">
            Update Route
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditRoute;
