import { useState } from 'react';
import Icon from './Icon.jsx';
import PageHeader from './PageHeader.jsx';

const emptyTrip = {
  routeId: '',
  vehicleId: '',
  driverId: '',
  date: '',
  departure: '',
  arrival: '',
  seats: '',
  fare: '',
  status: 'Scheduled',
  notes: '',
};

export default function TripForm({ value, onCancel, onSave, options = {} }) {
  const [form, setForm] = useState({ ...emptyTrip, ...(value || {}) });
  const { routes = [], vehicles = [], drivers = [], statuses = [] } = options;
  const statusOptions = value?.status
    ? value.status === 'Scheduled'
      ? statuses.filter((status) => status === 'Scheduled' || status === 'Cancelled')
      : [value.status]
    : ['Scheduled'];
  const statusLocked = Boolean(value?.status && value.status !== 'Scheduled');

  function update(key, nextValue) {
    setForm((current) => ({ ...current, [key]: nextValue }));
  }

  function submit(event) {
    event.preventDefault();
    onSave({ ...form, seats: Number(form.seats), fare: Number(form.fare) });
  }

  return (
    <section className="page form-page trip-form-page">
      <PageHeader
        title={value ? 'Edit Trip' : 'Add New Trip'}
        subtitle="Enter trip details"
      />
      <form className="form-card" onSubmit={submit}>
        <div className="form-grid">
          <label>
            <span>Route <b>*</b></span>
            {routes.length > 0 ? (
              <select required value={form.routeId || ''} onChange={(event) => update('routeId', event.target.value)}>
                <option value="">Select Route</option>
                {routes.map((route) => <option key={route.id} value={route.id}>{route.routeName}</option>)}
              </select>
            ) : (
              <select required value="" disabled><option value="">Save a route before scheduling a trip</option></select>
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
              <select required value={form.vehicleId || ''} onChange={(event) => update('vehicleId', event.target.value)}>
                <option value="">Select Vehicle</option>
                {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.vehicleNo}</option>)}
              </select>
            ) : (
              <select required value="" disabled><option value="">Save a vehicle before scheduling a trip</option></select>
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
              <select required value={form.driverId || ''} onChange={(event) => update('driverId', event.target.value)}>
                <option value="">Select Driver</option>
                {drivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.name}</option>)}
              </select>
            ) : (
              <select required value="" disabled><option value="">Save a driver before scheduling a trip</option></select>
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
                disabled={statusLocked}
                onChange={(event) => update('status', event.target.value)}
              >
                {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
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
    </section>
  );
}
