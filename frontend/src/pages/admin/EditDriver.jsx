
import { useEffect, useState } from 'react';

function EditDriver({
  driver,
  vehicles = [],
  onSave,
  onCancel,
}) {
  const [name, setName] = useState('');
  const [nic, setNic] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [assignedVehicle, setAssignedVehicle] = useState('');
  const [status, setStatus] = useState('Active');
  const [saving, setSaving] = useState(false);

  // Load selected driver details
  useEffect(() => {
    if (!driver) return;

    setName(driver.name || '');
    setNic(driver.nic || '');
    setLicenseNo(driver.licenseNo || '');
    setContact(driver.contact || driver.phone || '');
    setEmail(driver.email || '');
    setAddress(driver.address || '');
    setAssignedVehicle(driver.assignedVehicle || '');
    setStatus(driver.status || 'Active');
  }, [driver]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!driver) return;

    const updatedDriver = {
      ...driver,
      name: name.trim(),
      nic: nic.trim(),
      licenseNo: licenseNo.trim(),
      contact: contact.trim(),
      phone: contact.trim(),
      email: email.trim(),
      address: address.trim(),
      assignedVehicle,
      status,
    };

    if (
      !updatedDriver.name ||
      !updatedDriver.licenseNo ||
      !updatedDriver.contact
    ) {
      window.alert('Please fill all required fields!');
      return;
    }

    if (typeof onSave !== 'function') {
      window.alert('Driver update functionality is not connected yet.');
      return;
    }

    try {
      setSaving(true);

      const result = await onSave(updatedDriver);

      if (result !== false) {
        window.alert('Driver updated successfully!');
      }
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Unable to update driver.'
      );
    } finally {
      setSaving(false);
    }
  }

  if (!driver) {
    return (
      <div className="form-page edit-driver-page">
        <div className="form-heading">
          <h1>Driver Not Found</h1>
          <p>Please return to Driver Management.</p>
        </div>

        <button
          type="button"
          className="save-button"
          onClick={onCancel}
        >
          Back to Drivers
        </button>
      </div>
    );
  }

  return (
    <div className="form-page edit-driver-page">
      {/* HEADING */}
      <div className="form-heading">
        <h1>Edit Driver</h1>
        <p>Update driver information</p>
      </div>

      {/* EDIT FORM */}
      <form
        className="vehicle-form-card"
        onSubmit={handleSubmit}
      >
        <div className="vehicle-form-content">
          <div className="vehicle-fields">
            <div className="form-grid">
              {/* DRIVER NAME */}
              <div className="form-group">
                <label>
                  Driver Name <span>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter driver name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* NIC */}
              <div className="form-group">
                <label>NIC Number</label>
                <input
                  type="text"
                  placeholder="Enter NIC number"
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                />
              </div>

              {/* LICENSE NUMBER */}
              <div className="form-group">
                <label>
                  License Number <span>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter license number"
                  value={licenseNo}
                  onChange={(e) => setLicenseNo(e.target.value)}
                  required
                />
              </div>

              {/* CONTACT NUMBER */}
              <div className="form-group">
                <label>
                  Contact Number <span>*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter contact number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* ASSIGNED VEHICLE */}
              <div className="form-group">
                <label>Assigned Vehicle</label>
                <select
                  value={assignedVehicle}
                  onChange={(e) =>
                    setAssignedVehicle(e.target.value)
                  }
                >
                  <option value="">Not Assigned</option>

                  {assignedVehicle &&
                    !vehicles.some(
                      (vehicle) =>
                        vehicle.vehicleNo === assignedVehicle
                    ) && (
                      <option value={assignedVehicle}>
                        {assignedVehicle}
                      </option>
                    )}

                  {vehicles.map((vehicle) => (
                    <option
                      key={vehicle.id}
                      value={vehicle.vehicleNo}
                    >
                      {vehicle.vehicleNo}
                    </option>
                  ))}
                </select>
              </div>

              {/* STATUS */}
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

              {/* ADDRESS */}
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  placeholder="Enter address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="save-button"
            disabled={saving}
          >
            {saving ? 'Updating...' : 'Update Driver'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditDriver;
