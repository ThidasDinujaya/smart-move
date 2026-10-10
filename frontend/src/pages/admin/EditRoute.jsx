
import { useEffect, useState } from 'react';

const emptyRoute = {
  routeNo: '',
  routeName: '',
  startLocation: '',
  endLocation: '',
  distance: '',
  estimatedTime: '',
  fare: '',
  status: 'Active',
  description: '',
};

function EditRoute({ route, onSave, onCancel }) {
  const [form, setForm] = useState(emptyRoute);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (route) {
      setForm({
        ...emptyRoute,
        ...route,
      });
    }
  }, [route]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!route) return;

    if (
      !form.routeNo.trim() ||
      !form.routeName.trim() ||
      !form.startLocation.trim() ||
      !form.endLocation.trim() ||
      Number(form.distance) <= 0
    ) {
      window.alert('Please enter valid route details!');
      return;
    }

    if (form.fare !== '' && Number(form.fare) < 0) {
      window.alert('Fare cannot be negative!');
      return;
    }

    try {
      setSaving(true);

      const result = await onSave({
        ...route,
        ...form,
        routeNo: form.routeNo.trim(),
        routeName: form.routeName.trim(),
        startLocation: form.startLocation.trim(),
        endLocation: form.endLocation.trim(),
        distance: Number(form.distance),
        fare: form.fare === '' ? 0 : Number(form.fare),
      });

      if (result !== false) {
        window.alert('Route updated successfully!');
      }
    } catch (error) {
      window.alert(error.message || 'Unable to update route.');
    } finally {
      setSaving(false);
    }
  }

  if (!route) {
    return (
      <div className="form-page edit-route-page">
        <h1>Route Not Found</h1>
        <button
          type="button"
          className="cancel-button"
          onClick={onCancel}
        >
          Back to Routes
        </button>
      </div>
    );
  }

  return (
    <div className="form-page edit-route-page">
      <div className="form-heading">
        <h1>Edit Route</h1>
        <p>Update route information</p>
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
                  required
                />
              </div>

              <div className="form-group">
                <label>Route Name <span>*</span></label>
                <input
                  name="routeName"
                  value={form.routeName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Start Location <span>*</span></label>
                <input
                  name="startLocation"
                  value={form.startLocation}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Location <span>*</span></label>
                <input
                  name="endLocation"
                  value={form.endLocation}
                  onChange={handleChange}
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
                  required
                />
              </div>

              <div className="form-group">
                <label>Estimated Travel Time</label>
                <input
                  name="estimatedTime"
                  value={form.estimatedTime}
                  onChange={handleChange}
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
                />
              </div>

              <div className="form-group">
                <label>Status <span>*</span></label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
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
            {saving ? 'Updating...' : 'Update Route'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditRoute;
