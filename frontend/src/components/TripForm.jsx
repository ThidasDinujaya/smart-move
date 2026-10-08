import { useState } from 'react';
import Icon from './Icon.jsx';
import PageHeader from './PageHeader.jsx';

const emptyTrip = {
  route: '',
  vehicle: '',
  driver: '',
  date: '',
  departure: '',
  arrival: '',
  seats: '',
  fare: '',
  status: '',
  notes: '',
};

export default function TripForm({ value, onCancel, onSave, options = {} }) {
  const [form, setForm] = useState({ ...emptyTrip, ...(value || {}) });
  const { routes = [], vehicles = [], drivers = [], statuses = [] } = options;

  function update(key, nextValue) {
    setForm((current) => ({ ...current, [key]: nextValue }));
  }

  function submit(event) {
    event.preventDefault();
    onSave({ ...form, seats: Number(form.seats), fare: Number(form.fare) });
  }

  return (
    <>
      <PageHeader
        title={value ? 'Edit Trip' : 'Add New Trip'}
        subtitle="Enter trip details"
      />
      <form className="form-card" onSubmit={submit}>
        <div className="form-grid">
          <label>
            <span>Route <b>*</b></span>
            {routes.length > 0 ? (
              <select required value={form.route} onChange={(event) => update('route', event.target.value)}>
                <option value="">Select Route</option>
                {routes.map((route) => <option key={route} value={route}>{route}</option>)}
              </select>
            ) : (
              <input
                required
                placeholder="Enter route"
                value={form.route}
                onChange={(event) => update('route', event.target.value)}
              />
            )}
          </label>
          <label>
            <span>Arrival Time <b>*</b></span>
            <input
              required
              type="time"
              value={form.arrival}
              onChange={(event) => update('arrival', event.target.value)}
            />
          </label>
          <label>
            <span>Vehicle <b>*</b></span>
            {vehicles.length > 0 ? (
              <select required value={form.vehicle} onChange={(event) => update('vehicle', event.target.value)}>
                <option value="">Select Vehicle</option>
                {vehicles.map((vehicle) => <option key={vehicle} value={vehicle}>{vehicle}</option>)}
              </select>
            ) : (
              <input
                required
                placeholder="Enter vehicle"
                value={form.vehicle}
                onChange={(event) => update('vehicle', event.target.value)}
              />
            )}
          </label>
          <label>
            <span>Available Seats <b>*</b></span>
            <input
              required
              min="1"
              type="number"
              placeholder="Enter number of seats"
              value={form.seats}
              onChange={(event) => update('seats', event.target.value)}
            />
          </label>
          <label>
            <span>Driver <b>*</b></span>
            {drivers.length > 0 ? (
              <select required value={form.driver} onChange={(event) => update('driver', event.target.value)}>
                <option value="">Select Driver</option>
                {drivers.map((driver) => <option key={driver} value={driver}>{driver}</option>)}
              </select>
            ) : (
              <input
                required
                placeholder="Enter driver"
                value={form.driver}
                onChange={(event) => update('driver', event.target.value)}
              />
            )}
          </label>
          <label>
            <span>Fare (Rs.) <b>*</b></span>
            <input
              required
              min="0"
              type="number"
              placeholder="Enter fare amount"
              value={form.fare}
              onChange={(event) => update('fare', event.target.value)}
            />
          </label>
          <label>
            <span>Date <b>*</b></span>
            <input
              required
              type="date"
              value={form.date}
              onChange={(event) => update('date', event.target.value)}
            />
          </label>
          <label>
            <span>Status <b>*</b></span>
            {statuses.length ? (
              <select
                required
                value={form.status}
                onChange={(event) => update('status', event.target.value)}
              >
                <option value="">Select Status</option>
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            ) : (
              <input
                required
                placeholder="Enter status"
                value={form.status}
                onChange={(event) => update('status', event.target.value)}
              />
            )}
          </label>
          <label>
            <span>Departure Time <b>*</b></span>
            <input
              required
              type="time"
              value={form.departure}
              onChange={(event) => update('departure', event.target.value)}
            />
          </label>
          <label className="span-two">
            <span>Notes</span>
            <textarea
              rows="3"
              placeholder="Enter additional notes..."
              value={form.notes}
              onChange={(event) => update('notes', event.target.value)}
            />
          </label>
        </div>
        <div className="dialog-actions">
          <button className="secondary" type="button" onClick={onCancel}>Cancel</button>
          <button className="primary" type="submit">
            <Icon name="check" size={15} /> Save Trip
          </button>
        </div>
      </form>
    </>
  );
}
