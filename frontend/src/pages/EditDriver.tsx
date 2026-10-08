
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getDriverById,
  updateDriver,
} from "../utils/driverStorage";

import type { Driver } from "../utils/driverStorage";

function EditDriver() {
  const navigate = useNavigate();
  const { id } = useParams();

  const driver = getDriverById(Number(id));

  const [name, setName] = useState(driver?.name ?? "");
  const [licenseNo, setLicenseNo] = useState(
    driver?.licenseNo ?? ""
  );
  const [contact, setContact] = useState(
    driver?.contact ?? ""
  );
  const [assignedVehicle, setAssignedVehicle] = useState(
    driver?.assignedVehicle ?? ""
  );
  const [status, setStatus] = useState(
    driver?.status ?? "Active"
  );

  if (!driver) {
    return (
      <div className="form-page">
        <div className="form-heading">
          <h1>Driver Not Found</h1>
          <p>Please return to Driver Management.</p>
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

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const updatedDriver: Driver = {
      ...driver,
      name: name.trim(),
      licenseNo: licenseNo.trim(),
      contact: contact.trim(),
      assignedVehicle: assignedVehicle.trim(),
      status,
    };

    if (
      !updatedDriver.name ||
      !updatedDriver.licenseNo ||
      !updatedDriver.contact
    ) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      updateDriver(updatedDriver);
      alert("Driver updated successfully!");
      navigate("/drivers");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to update driver."
      );
    }
  };

  return (
    <div className="form-page">
      <div className="form-heading">
        <h1>Edit Driver</h1>
        <p>Update driver information</p>
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
                  Driver Name <span>*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  License Number <span>*</span>
                </label>
                <input
                  type="text"
                  value={licenseNo}
                  onChange={(e) => setLicenseNo(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Contact Number <span>*</span>
                </label>
                <input
                  type="tel"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Assigned Vehicle</label>
                <input
                  type="text"
                  placeholder="e.g. NB-1234"
                  value={assignedVehicle}
                  onChange={(e) => setAssignedVehicle(e.target.value)}
                />
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
                  <option value="On Leave">On Leave</option>
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
            onClick={() => navigate("/drivers")}
          >
            Cancel
          </button>

          <button type="submit" className="save-button">
            Update Driver
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditDriver;
