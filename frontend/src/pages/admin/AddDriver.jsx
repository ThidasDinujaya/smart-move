
import { useState } from 'react';
import { formatRecordId } from '../../utils/recordIds.js';

function AddDriver({
  vehicles = [],
  drivers = [],
  onSave,
  onCancel,
}) {
  const [fullName, setFullName] = useState('');
  const [nic, setNic] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [assignedVehicle, setAssignedVehicle] = useState('');
  const [status, setStatus] = useState('Active');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const duplicateNIC = drivers.some(
      (driver) =>
        String(driver.nic || '').toLowerCase() ===
        nic.trim().toLowerCase()
    );

    const duplicateLicense = drivers.some(
      (driver) =>
        String(driver.licenseNo || '').toLowerCase() ===
        licenseNo.trim().toLowerCase()
    );

    if (duplicateNIC) {
      window.alert('This NIC is already registered.');
      return;
    }

    if (duplicateLicense) {
      window.alert('This license number is already registered.');
      return;
    }

    const newDriver = {
      name: fullName.trim(),
      nic: nic.trim(),
      licenseNo: licenseNo.trim(),
      contact: phone.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      assignedVehicle,
      status,
    };

    if (!newDriver.name || !newDriver.nic ||
        !newDriver.licenseNo || !newDriver.contact) {
      window.alert('Please fill all required fields.');
      return;
    }

    if (typeof onSave !== 'function') {
      window.alert('Driver save functionality is not connected yet.');
      return;
    }

    try {
      setSaving(true);

      const result = await onSave(newDriver);

      if (result !== false) {
        window.alert('Driver saved successfully!');
      }
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Unable to save driver.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="form-page add-driver-page">
      <div className="form-heading">
        <h1>Add New Driver</h1>
        <p>Enter the driver details</p>
      </div>

      <form
        className="vehicle-form-card"
        onSubmit={handleSubmit}
      >
        <div className="vehicle-form-content">
          {/* LEFT SIDE */}
          <div className="vehicle-fields">
            <div className="form-grid">
              <div className="form-group">
                <label>
                  Full Name <span>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  NIC <span>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter NIC number"
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  License No <span>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter license number"
                  value={licenseNo}
                  onChange={(e) => setLicenseNo(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Phone <span>*</span>
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 0771234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Assigned Vehicle</label>
                <select
                  value={assignedVehicle}
                  onChange={(e) =>
                    setAssignedVehicle(e.target.value)
                  }
                >
                  <option value="">Select Vehicle</option>

                  {vehicles.map((vehicle) => (
                    <option
                      key={vehicle.id}
                      value={vehicle.vehicleNo}
                    >
                      {formatRecordId('vehicle', vehicle.id)} · {vehicle.vehicleNo}
                    </option>
                  ))}
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
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

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
            {saving ? 'Saving...' : 'Save Driver'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddDriver;
