import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PageHeader from './PageHeader.jsx';
import { api } from '../api/client.js';
import { formatDate, formatMoney } from '../utils/formatters.js';

function localDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function localTimeValue(date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function isScheduledTrip(trip) {
  return String(trip.status || '').toLowerCase() === 'scheduled';
}

function displayTime(value) {
  return String(value || '').slice(0, 5);
}

export default function AdminBookingForm({ passengers = [], trips = [], onSave, onCancel }) {
  const [passengerId, setPassengerId] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [tripId, setTripId] = useState('');
  const [availability, setAvailability] = useState(null);
  const [vehicleSeatAvailability, setVehicleSeatAvailability] = useState({});
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [seatError, setSeatError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const availabilityRequestIds = useRef({});

  const now = new Date();
  const today = localDateValue(now);
  const currentTime = localTimeValue(now);
  const bookableTrips = useMemo(() => trips.filter((trip) => {
    if (!isScheduledTrip(trip)) return false;
    return trip.date > today || (trip.date === today && displayTime(trip.departure) > currentTime);
  }), [trips, today, currentTime]);
  const tripsOnDate = useMemo(
    () => bookableTrips.filter((trip) => trip.date === travelDate),
    [bookableTrips, travelDate],
  );
  const fromOptions = useMemo(
    () => [...new Set(tripsOnDate.map((trip) => trip.from).filter(Boolean))].sort(),
    [tripsOnDate],
  );
  const toOptions = useMemo(
    () => [...new Set(tripsOnDate.filter((trip) => trip.from === from).map((trip) => trip.to).filter(Boolean))].sort(),
    [tripsOnDate, from],
  );
  const matchingRouteTrips = useMemo(
    () => tripsOnDate.filter((trip) => trip.from === from && trip.to === to),
    [tripsOnDate, from, to],
  );
  const timeOptions = useMemo(
    () => [...new Set(matchingRouteTrips.map((trip) => displayTime(trip.departure)).filter(Boolean))].sort(),
    [matchingRouteTrips],
  );
  const vehicleOptions = useMemo(
    () => matchingRouteTrips
      .filter((trip) => displayTime(trip.departure) === departureTime)
      .sort((left, right) => String(left.vehicle || '').localeCompare(String(right.vehicle || ''))),
    [matchingRouteTrips, departureTime],
  );
  const selectedTrip = vehicleOptions.find((trip) => String(trip.id) === tripId);
  const selectedPassenger = passengers.find((passenger) => String(passenger.id) === passengerId);
  const reservedSeats = new Set(availability?.reservedSeats || []);
  const fare = Number(selectedTrip?.fare || 0);
  const canSubmit = Boolean(
    selectedPassenger
    && selectedTrip
    && selectedSeat
    && availability?.bookable
    && !reservedSeats.has(selectedSeat)
    && !loadingSeats
    && !saving,
  );

  const fetchTripAvailability = useCallback(async (id) => {
    const key = String(id);
    const requestId = (availabilityRequestIds.current[key] || 0) + 1;
    availabilityRequestIds.current[key] = requestId;
    setVehicleSeatAvailability((current) => ({ ...current, [key]: { loading: true } }));

    try {
      const result = await api.get(`/api/trips/${key}/seats`);
      if (availabilityRequestIds.current[key] === requestId) {
        setVehicleSeatAvailability((current) => ({ ...current, [key]: { availability: result } }));
      }
      return result;
    } catch (error) {
      if (availabilityRequestIds.current[key] === requestId) {
        setVehicleSeatAvailability((current) => ({ ...current, [key]: { error: error.message } }));
      }
      throw error;
    }
  }, []);

  useEffect(() => {
    vehicleOptions.forEach((trip) => {
      fetchTripAvailability(trip.id).catch(() => {});
    });
  }, [vehicleOptions, fetchTripAvailability]);

  useEffect(() => {
    if (!tripId) {
      setAvailability(null);
      setLoadingSeats(false);
      return undefined;
    }

    let active = true;
    setAvailability(null);
    setSelectedSeat(null);
    setSeatError('');
    setLoadingSeats(true);

    fetchTripAvailability(tripId)
      .then((result) => {
        if (active) setAvailability(result);
      })
      .catch((error) => {
        if (active) setSeatError(error.message || 'Unable to load seat availability.');
      })
      .finally(() => {
        if (active) setLoadingSeats(false);
      });

    return () => {
      active = false;
    };
  }, [tripId, fetchTripAvailability]);

  function clearVehicleSelection() {
    setTripId('');
    setAvailability(null);
    setSelectedSeat(null);
    setSeatError('');
  }

  function updateDate(value) {
    setTravelDate(value);
    setFrom('');
    setTo('');
    setDepartureTime('');
    clearVehicleSelection();
  }

  function updateFrom(value) {
    setFrom(value);
    setTo('');
    setDepartureTime('');
    clearVehicleSelection();
  }

  function updateTo(value) {
    setTo(value);
    setDepartureTime('');
    clearVehicleSelection();
  }

  function updateDepartureTime(value) {
    setDepartureTime(value);
    clearVehicleSelection();
  }

  function selectSeat(seatNumber) {
    if (reservedSeats.has(seatNumber)) return;
    setSelectedSeat((current) => current === seatNumber ? null : seatNumber);
  }

  async function submit(event) {
    event.preventDefault();
    setSaveError('');
    if (!canSubmit) return;

    setSaving(true);
    try {
      await onSave({
        passengerId: Number(selectedPassenger.id),
        tripId: Number(selectedTrip.id),
        seatNumbers: [selectedSeat],
      });
    } catch (error) {
      setSaveError(error.message || 'Unable to create this booking.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="page form-page admin-booking-page">
      <PageHeader title="Add Booking" subtitle="Choose a travel date, route, departure and one seat." />
      <form className="admin-booking-form" onSubmit={submit}>
        <section className="form-card booking-step-card">
          <div className="booking-section-heading">
            <h2>Journey details</h2>
            <p>Choose a date, route and departure time to see the available vehicles.</p>
          </div>
          <div className="booking-search-fields">
            <label>
              <span>Travel date <b>*</b></span>
              <input required type="date" min={today} value={travelDate} onChange={(event) => updateDate(event.target.value)} />
            </label>
            <label>
              <span>From <b>*</b></span>
              <select required disabled={!travelDate || fromOptions.length === 0} value={from} onChange={(event) => updateFrom(event.target.value)}>
                <option value="">{!travelDate ? 'Choose a date first' : 'Select origin'}</option>
                {fromOptions.map((location) => <option key={location} value={location}>{location}</option>)}
              </select>
            </label>
            <label>
              <span>To <b>*</b></span>
              <select required disabled={!from || toOptions.length === 0} value={to} onChange={(event) => updateTo(event.target.value)}>
                <option value="">{!from ? 'Select origin first' : 'Select destination'}</option>
                {toOptions.map((location) => <option key={location} value={location}>{location}</option>)}
              </select>
            </label>
            <label>
              <span>Departure time <b>*</b></span>
              <select required disabled={!to || timeOptions.length === 0} value={departureTime} onChange={(event) => updateDepartureTime(event.target.value)}>
                <option value="">{!to ? 'Select a route first' : 'Select departure time'}</option>
                {timeOptions.map((time) => <option key={time} value={time}>{time}</option>)}
              </select>
            </label>
          </div>
          {travelDate && fromOptions.length === 0 && (
            <p className="booking-inline-note">There are no scheduled trips on this date. Choose another date.</p>
          )}
          {from && to && timeOptions.length === 0 && (
            <p className="booking-inline-note">No scheduled departures match this route and date.</p>
          )}
        </section>

        {departureTime && (
          <section className="form-card booking-step-card">
            <div className="booking-section-heading">
              <h2>Choose a vehicle</h2>
              <p>Vehicles running from {from} to {to} at {departureTime} on {formatDate(travelDate)}.</p>
            </div>
            {vehicleOptions.length ? (
              <div className="booking-vehicle-options">
                {vehicleOptions.map((trip) => {
                  const selected = String(trip.id) === tripId;
                  const seatInfo = vehicleSeatAvailability[String(trip.id)];
                  const seatCounts = seatInfo?.availability;
                  const soldOut = seatCounts && (!seatCounts.bookable || seatCounts.availableSeats < 1);
                  return (
                    <button
                      className={`booking-vehicle-card${selected ? ' selected' : ''}${soldOut ? ' sold-out' : ''}`}
                      type="button"
                      key={trip.id}
                      aria-pressed={selected}
                      disabled={Boolean(soldOut)}
                      onClick={() => {
                        setTripId(String(trip.id));
                        setSelectedSeat(null);
                      }}
                    >
                      <span className="booking-vehicle-title">{trip.vehicle || 'Vehicle'} <span>{trip.vehicleType || 'Transport'}</span></span>
                      <span>{trip.from} → {trip.to}</span>
                      <span>{displayTime(trip.departure)} – {displayTime(trip.arrival)}</span>
                      <dl className="booking-vehicle-seat-count">
                        <div><dt>Seat capacity</dt><dd>{seatCounts?.capacity ?? trip.seats}</dd></div>
                        <div>
                          <dt>Remaining seats</dt>
                          <dd>{seatCounts
                            ? seatCounts.availableSeats
                            : seatInfo?.error
                              ? 'Unavailable'
                              : 'Checking…'}</dd>
                        </div>
                      </dl>
                      <strong>{formatMoney(trip.fare)} per seat</strong>
                    </button>
                  );
                })}
              </div>
            ) : <p className="booking-inline-note">No vehicles are available for this departure.</p>}
          </section>
        )}

        {selectedTrip && (
          <section className="form-card booking-step-card">
            <div className="booking-section-heading">
              <h2>Select one seat</h2>
              <p>Click one available numbered seat. A booking can reserve only one seat.</p>
            </div>
            {loadingSeats ? <p className="booking-inline-note">Loading live seat availability…</p> : null}
            {seatError ? <p className="booking-error" role="alert">{seatError}</p> : null}
            {!loadingSeats && !seatError && availability && !availability.bookable && (
              <p className="booking-error" role="alert">This trip is no longer available for booking.</p>
            )}
            {!loadingSeats && !seatError && availability?.bookable && (
              <div className="booking-seat-layout">
                <div className="booking-seat-panel">
                  <div className="booking-seat-legend" aria-label="Seat status">
                    <span><i className="available" />Available</span>
                    <span><i className="chosen" />Selected</span>
                    <span><i className="reserved" />Booked</span>
                  </div>
                  <div className="booking-seat-map">
                    <div className="booking-driver">Driver</div>
                    <div className="booking-seat-grid" aria-label="Select one seat">
                      {Array.from({ length: Number(availability.capacity) || 0 }, (_value, index) => {
                        const seatNumber = index + 1;
                        const isReserved = reservedSeats.has(seatNumber);
                        const isSelected = selectedSeat === seatNumber;
                        return (
                          <button
                            key={seatNumber}
                            type="button"
                            className={`booking-seat${isReserved ? ' booked' : ''}${isSelected ? ' selected' : ''}`}
                            disabled={isReserved}
                            aria-label={`Seat ${seatNumber}${isReserved ? ', booked' : isSelected ? ', selected' : ', available'}`}
                            aria-pressed={isSelected}
                            onClick={() => selectSeat(seatNumber)}
                          >
                            {seatNumber}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <p className="booking-availability-note">{availability.availableSeats} of {availability.capacity} seats available</p>
                  <label className="booking-passenger-select">
                    <span>Passenger <b>*</b></span>
                    <select required value={passengerId} onChange={(event) => setPassengerId(event.target.value)}>
                      <option value="">Select passenger</option>
                      {passengers.filter((passenger) => String(passenger.status || 'Active').toLowerCase() === 'active')
                        .map((passenger) => <option key={passenger.id} value={passenger.id}>
                          {passenger.fullName || passenger.name}{passenger.email ? ` · ${passenger.email}` : ''}
                        </option>)}
                    </select>
                  </label>
                </div>
                <aside className="booking-summary">
                  <div className="booking-summary-heading">
                    <h2>Booking summary</h2>
                    <p>System-generated details are set when the booking is saved.</p>
                  </div>
                  <dl className="booking-summary-grid">
                    <div><span>Passenger</span><strong>{selectedPassenger?.fullName || selectedPassenger?.name || 'Select a passenger'}</strong></div>
                    <div><span>Route</span><strong>{from} → {to}</strong></div>
                    <div><span>Travel date</span><strong>{formatDate(travelDate)}</strong></div>
                    <div><span>Departure / arrival</span><strong>{displayTime(selectedTrip.departure)} / {displayTime(selectedTrip.arrival)}</strong></div>
                    <div><span>Vehicle</span><strong>{selectedTrip.vehicle || '—'}</strong></div>
                    <div><span>Seat count</span><strong>1</strong></div>
                    <div><span>Seat number</span><strong>{selectedSeat ? `#${selectedSeat}` : 'Choose one seat'}</strong></div>
                    <div><span>Booking reference</span><strong>Generated on save</strong></div>
                    <div><span>Booking date / status</span><strong>Set on save / Pending Payment</strong></div>
                    <div><span>Ticket number / status</span><strong>Generated on save / Reserved</strong></div>
                    <div className="booking-total"><span>Total amount</span><strong>{formatMoney(fare)}</strong></div>
                  </dl>
                  <p className="booking-summary-note">One seat is charged at the trip fare. Payment is recorded separately.</p>
                </aside>
              </div>
            )}
          </section>
        )}

        {saveError && <p className="booking-error" role="alert">{saveError}</p>}
        <div className="form-actions booking-form-actions">
          <button className="primary" type="submit" disabled={!canSubmit}>
            {saving ? 'Saving booking…' : 'Confirm booking'}
          </button>
          <button className="secondary" type="button" onClick={onCancel} disabled={saving}>Cancel</button>
        </div>
      </form>
    </section>
  );
}
