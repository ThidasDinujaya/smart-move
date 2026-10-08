
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UploadCloud } from "lucide-react";

import {
  getVehicleById,
  updateVehicle,
} from "../utils/vehicleStorage";

import type { Vehicle } from "../utils/vehicleStorage";

function EditVehicle() {
  const navigate = useNavigate();
  const { id } = useParams();

  const vehicle = getVehicleById(Number(id));

  const [vehicleNo, setVehicleNo] = useState(
    vehicle?.vehicleNo ?? ""
  );
  const [vehicleType, setVehicleType] = useState(
    vehicle?.type ?? ""
  );
  const [brand, setBrand] = useState(vehicle?.brand ?? "");
  const [model, setModel] = useState(vehicle?.model ?? "");
  const [year, setYear] = useState(vehicle?.year ?? "");
  const [capacity, setCapacity] = useState(
    vehicle?.capacity.toString() ?? ""
  );
  const [status, setStatus] = useState(
    vehicle?.status ?? "Active"
  );
  const [serviceDate, setServiceDate] = useState(
    vehicle?.lastService ?? ""
  );

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

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const updatedVehicle: Vehicle = {
      ...vehicle,
      vehicleNo: vehicleNo.trim(),
      type: vehicleType,
      brand,
      model: model.trim(),
      year,
      capacity: Number(capacity),
      status,
      lastService: serviceDate,
    };

    if (!updatedVehicle.vehicleNo) {
      alert("Vehicle number is required!");
      return;
    }

    if (
      !Number.isInteger(updatedVehicle.capacity) ||
      updatedVehicle.capacity <= 0
    ) {
      alert("Please enter a valid capacity!");
      return;
    }

    try {
      updateVehicle(updatedVehicle);
      alert("Vehicle updated successfully!");
      navigate("/vehicles");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to update vehicle."
      );
    }
  };

  return (
    <div className="form-page">
      <div className="form-heading">
        <h1>Edit Vehicle</h1>
        <p>Update the vehicle details</p>
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
                  Vehicle No <span>*</span>
                </label>

                <input
                  type="text"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Manufacture Year</label>

                <input
                  type="number"
                  min="1990"
                  max="2030"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>
                  Vehicle Type <span>*</span>
                </label>

                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Bus">Bus</option>
                  <option value="Van">Van</option>
                  <option value="Car">Car</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Capacity (Seats) <span>*</span>
                </label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Brand <span>*</span>
                </label>

                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                >
                  <option value="">Select Brand</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Tata">Tata</option>
                  <option value="Ashok Leyland">
                    Ashok Leyland
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  Status <span>*</span>
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="In Service">In Service</option>
                  <option value="Under Maintenance">
                    Under Maintenance
                  </option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="form-group">
                <label>Model</label>

                <input
                  type="text"
                  placeholder="Enter model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Last Service Date</label>

                <input
                  type="date"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="vehicle-image-section">
            <label className="image-title">
              Vehicle Image
            </label>

            <label className="image-upload-box">
              <UploadCloud size={45} />
              <strong>Change image</strong>
              <span>Image upload coming soon</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/vehicles")}
          >
            Cancel
          </button>

          <button type="submit" className="save-button">
            Update Vehicle
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditVehicle;
