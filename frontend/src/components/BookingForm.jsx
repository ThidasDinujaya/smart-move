import { useState } from 'react';
import Icon from './Icon.jsx';
import PageHeader from './PageHeader.jsx';
import { formatDate, formatMoney } from '../utils/formatters.js';

export default function BookingForm({ trips, passengers, onCancel, onSave }) {
  const [form, setForm] = useState({ trip: '', passenger: '', count: '', seats: '' });
  const trip = trips.find((item) => String(item.id) === form.trip);
  const passenger = passengers.find((item) => String(item.id) === form.passenger);
  const total = (trip?.fare || 0) * Number(form.count);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (trip && passenger) {
      onSave({
        tripId: trip.id,
        passengerId: passenger.id,
        seatCount: Number(form.count),
        seats: form.seats,
      });
    }
  }

  return (
    <>
      <PageHeader title="Book Ticket" subtitle="Fill in passenger and trip details" />
      <form className="booking-form" onSubmit={submit}>
        <div className="booking-grid">
          <div className="field-stack">
            <label>
              <span>Select Trip <b>*</b></span>
              <select required value={form.trip} onChange={(event) => update('trip', event.target.value)}>
                <option value="">Select Trip</option>
                {trips.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.route} · {formatDate(item.date)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Passenger <b>*</b></span>
              <select required value={form.passenger} onChange={(event) => update('passenger', event.target.value)}>
                <option value="">Select Passenger</option>
                {passengers.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Number of Seats <b>*</b></span>
              <input
                required
                type="number"
                min="1"
                max={trip?.seats || undefined}
                value={form.count}
                onChange={(event) => update('count', event.target.value)}
              />
            </label>
            <label>
              <span>Seat Numbers</span>
              <input
                placeholder="Optional — assigned automatically if blank"
                value={form.seats}
                onChange={(event) => update('seats', event.target.value)}
              />
            </label>
          </div>

          <aside className="summary">
            <h3>Booking Summary</h3>
            <dl>
              <div><dt>Route</dt><dd>{trip?.route || '—'}</dd></div>
              <div><dt>Date</dt><dd>{trip ? formatDate(trip.date) : '—'}</dd></div>
              <div><dt>Departure</dt><dd>{trip?.departure || '—'}</dd></div>
              <div><dt>Arrival</dt><dd>{trip?.arrival || '—'}</dd></div>
              <div><dt>Seats</dt><dd>{trip && form.count ? form.count : '—'}</dd></div>
              <div className="total"><dt>Total Amount</dt><dd>{trip && form.count ? formatMoney(total) : '—'}</dd></div>
            </dl>
          </aside>
        </div>
        <div className="dialog-actions">
          <button className="secondary" type="button" onClick={onCancel}>Cancel</button>
          <button className="primary" type="submit" disabled={!trip || !passenger}>
            <Icon name="check" size={15} /> Confirm Booking
          </button>
        </div>
      </form>
    </>
  );
}
