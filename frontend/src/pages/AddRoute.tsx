
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addRoute } from "../utils/routeStorage";

function AddRoute() {
  const navigate = useNavigate();

  const [routeName, setRouteName] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [assignedVehicle, setAssignedVehicle] = useState("");
  const [status, setStatus] = useState("Active");

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !routeName.trim() ||
      !startLocation.trim() ||
      !endLocation.trim()
    ) {
      alert("Please fill all required fields!");
      return;
    }

    const distanceNumber = Number(distance);

    if (!Number.isFinite(distanceNumber) || distanceNumber <= 0) {
      alert("Please enter a valid distance!");
      return;
    }

    try {
      addRoute({
        routeName: routeName.trim(),
        startLocation: startLocation.trim(),
        endLocation: endLocation.trim(),
        distance: distanceNumber,
        estimatedDuration: estimatedDuration.trim(),
        assignedVehicle: assignedVehicle.trim(),
        status,
      });

      alert("Route added successfully!");
      navigate("/routes");
    } catch {
      alert("Unable to add route.");
    }
  };

  return (
    <div className="form-page">
      <div className="form-heading">
        <h1>Add New Route</h1>
        <p>Enter route details</p>
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
                  placeholder="e.g. Colombo - Kandy"
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
                  placeholder="Enter start location"
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
                  placeholder="Enter end location"
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
                  placeholder="Enter distance"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Estimated Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 3 hours"
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
                  placeholder="e.g. NB-1234"
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
            Save Route
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddRoute;
