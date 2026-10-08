
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud } from "lucide-react";

import { addVehicle } from "../utils/vehicleStorage";

function AddVehicle() {
  const navigate = useNavigate();

  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [capacity, setCapacity] = useState("");
  const [status, setStatus] = useState("Active");
  const [serviceDate, setServiceDate] = useState("");

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!vehicleNo.trim()) {
      alert("Please enter the vehicle number!");
      return;
    }

    const seats = Number(capacity);

    if (!Number.isInteger(seats) || seats <= 0) {
      alert("Please enter a valid capacity!");
      return;
    }

    try {
      addVehicle({
        vehicleNo: vehicleNo.trim(),
        type: vehicleType,
        brand,
        model: model.trim(),
        year,
        capacity: seats,
        status,
        lastService: serviceDate,
      });

      alert("Vehicle saved successfully!");
      navigate("/vehicles");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to save vehicle."
      );
    }
  };

  return (
    <div className="form-page">
      <div className="form-heading">
        <h1>Add New Vehicle</h1>
        <p>Enter the vehicle details</p>
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
                  placeholder="e.g. NB-1234"
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
                  placeholder="yyyy"
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
                  placeholder="Enter capacity"
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
              <strong>Choose image</strong>
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
            Save Vehicle
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddVehicle;
