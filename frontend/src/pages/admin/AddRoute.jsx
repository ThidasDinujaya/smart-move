
import { useState } from 'react';

function AddRoute({ routes = [], onSave, onCancel }) {
  const [form, setForm] = useState({
    routeNo: '',
    routeName: '',
    startLocation: '',
    endLocation: '',
    distance: '',
    estimatedTime: '',
    fare: '',
    status: 'Active',
    description: '',
  });

  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const routeNo = form.routeNo.trim();

    if (
      !routeNo ||
      !form.routeName.trim() ||
      !form.startLocation.trim() ||
      !form.endLocation.trim()
    ) {
      window.alert('Please fill all required fields!');
      return;
    }

    const duplicate = routes.some(
      (route) =>
        typeof route === 'object' &&
        String(route.routeNo || '').toLowerCase() ===
          routeNo.toLowerCase()
    );

    if (duplicate) {
      window.alert('Route number already exists!');
      return;
    }

    if (Number(form.distance) <= 0) {
      window.alert('Distance must be greater than zero!');
      return;
    }

    if (form.fare !== '' && Number(form.fare) < 0) {
      window.alert('Fare cannot be negative!');
      return;
    }

    if (typeof onSave !== 'function') {
      window.alert('Route save functionality is not connected.');
      return;
    }

    try {
      setSaving(true);

      const result = await onSave({
        ...form,
        routeNo,
        routeName: form.routeName.trim(),
        startLocation: form.startLocation.trim(),
        endLocation: form.endLocation.trim(),
        distance: Number(form.distance),
        fare: form.fare === '' ? 0 : Number(form.fare),
      });

      if (result !== false) {
        window.alert('Route saved successfully!');
      }
    } catch (error) {
      window.alert(error.message || 'Unable to save route.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="form-page add-route-page">
      <div className="form-heading">
        <h1>Add New Route</h1>
        <p>Enter route details</p>
      </div>

      <form className="vehicle-form-card" onSubmit={handleSubmit}>
        <div className="vehicle-form-content">
          <div className="vehicle-fields">
            <div className="form-grid">
              <div className="form-group">
                <label>Route Number <span>*</span></label>
                <input
                  name="routeNo"
                  value={form.routeNo}
                  onChange={handleChange}
                  placeholder="e.g. RT-001"
                  required
                />
              </div>

              <div className="form-group">
                <label>Route Name <span>*</span></label>
                <input
                  name="routeName"
                  value={form.routeName}
                  onChange={handleChange}
                  placeholder="e.g. Colombo - Kandy"
                  required
                />
              </div>

              <div className="form-group">
                <label>Start Location <span>*</span></label>
                <input
                  name="startLocation"
                  value={form.startLocation}
                  onChange={handleChange}
                  placeholder="Enter starting location"
                  required
                />
              </div>

              <div className="form-group">
                <label>End Location <span>*</span></label>
                <input
                  name="endLocation"
                  value={form.endLocation}
                  onChange={handleChange}
                  placeholder="Enter destination"
                  required
                />
              </div>

              <div className="form-group">
                <label>Distance (km) <span>*</span></label>
                <input
                  type="number"
                  name="distance"
                  value={form.distance}
                  onChange={handleChange}
                  min="0.1"
                  step="0.1"
                  placeholder="e.g. 115"
                  required
                />
              </div>

              <div className="form-group">
                <label>Estimated Travel Time</label>
                <input
                  name="estimatedTime"
                  value={form.estimatedTime}
                  onChange={handleChange}
                  placeholder="e.g. 3 hours"
                />
              </div>

              <div className="form-group">
                <label>Fare (LKR)</label>
                <input
                  type="number"
                  name="fare"
                  value={form.fare}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="e.g. 750"
                />
              </div>

              <div className="form-group">
                <label>Status <span>*</span></label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="form-group route-description-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter route description"
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

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
            {saving ? 'Saving...' : 'Save Route'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddRoute;
