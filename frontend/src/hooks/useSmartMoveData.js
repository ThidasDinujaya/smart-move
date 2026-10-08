import { useMemo, useState } from 'react';

const collectionKeys = ['passengers', 'trips', 'bookings', 'payments', 'maintenance', 'feedback'];

function createEmptyCollections() {
  return Object.fromEntries(collectionKeys.map((key) => [key, []]));
}

function createLocalId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function uniqueValues(values) {
  return [...new Set(values.map((value) => String(value ?? '').trim()).filter(Boolean))];
}

const collectionByType = {
  passenger: 'passengers',
  trip: 'trips',
  booking: 'bookings',
  payment: 'payments',
};

export default function useSmartMoveData() {
  const [collections, setCollections] = useState(createEmptyCollections);

  const routes = useMemo(() => uniqueValues([
    ...collections.trips.map((trip) => trip.route),
    ...collections.bookings.map((booking) => booking.route),
  ]), [collections.trips, collections.bookings]);

  const tripOptions = useMemo(() => ({
    routes,
    vehicles: uniqueValues(collections.trips.map((trip) => trip.vehicle)),
    drivers: uniqueValues(collections.trips.map((trip) => trip.driver)),
    statuses: uniqueValues(collections.trips.map((trip) => trip.status)),
  }), [collections.trips, routes]);

  const maintenanceOptions = useMemo(() => ({
    vehicles: uniqueValues([
      ...collections.trips.map((trip) => trip.vehicle),
      ...collections.maintenance.map((record) => record.vehicleNo),
    ]),
    types: uniqueValues(collections.maintenance.map((record) => record.type)),
    statuses: uniqueValues(collections.maintenance.map((record) => record.status)),
  }), [collections.trips, collections.maintenance]);

  function saveRecord({ type, mode, item }, value) {
    const collection = collectionByType[type];
    if (!collection) return false;

    setCollections((current) => {
      const records = current[collection];
      const next = mode === 'edit'
        ? records.map((record) => String(record.id) === String(item.id) ? { ...record, ...value } : record)
        : [{ ...value, id: createLocalId() }, ...records];
      return { ...current, [collection]: next };
    });
    return true;
  }

  function deleteRecord(type, item) {
    const collection = collectionByType[type];
    if (!collection) return false;

    setCollections((current) => ({
      ...current,
      [collection]: current[collection].filter((record) => String(record.id) !== String(item.id)),
    }));
    return true;
  }

  function saveTrip(value, editingTrip) {
    setCollections((current) => ({
      ...current,
      trips: editingTrip
        ? current.trips.map((trip) => String(trip.id) === String(editingTrip.id) ? { ...trip, ...value } : trip)
        : [{ ...value, id: createLocalId() }, ...current.trips],
    }));
    return true;
  }

  function saveBooking({ tripId, passengerId, seatCount, seats }) {
    const trip = collections.trips.find((record) => String(record.id) === String(tripId));
    const passenger = collections.passengers.find((record) => String(record.id) === String(passengerId));
    if (!trip || !passenger) return false;

    setCollections((current) => ({
      ...current,
      bookings: [{
        id: createLocalId(),
        passenger: passenger.name,
        route: trip.route,
        date: trip.date,
        seats: seats || String(seatCount),
        amount: Number(trip.fare || 0) * Number(seatCount || 0),
        status: '',
      }, ...current.bookings],
    }));
    return true;
  }

  function saveMaintenance(value) {
    setCollections((current) => ({
      ...current,
      maintenance: [{ ...value, id: createLocalId() }, ...current.maintenance],
    }));
    return true;
  }

  return {
    ...collections,
    reports: null,
    routes,
    tripOptions,
    maintenanceOptions,
    saveRecord,
    deleteRecord,
    saveTrip,
    saveBooking,
    saveMaintenance,
  };
}
