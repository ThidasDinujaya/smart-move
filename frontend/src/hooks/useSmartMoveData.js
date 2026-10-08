import { useMemo, useState } from 'react';
import { nextCode, nextNumericId } from '../utils/formatters.js';

export default function useSmartMoveData() {
  const [passengers, setPassengers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);

  const routes = useMemo(() => [...new Set(
    [...trips, ...bookings].map((record) => record.route).filter(Boolean),
  )], [bookings, trips]);

  const tripOptions = useMemo(() => ({
    routes: [...new Set(trips.map((trip) => trip.route).filter(Boolean))],
    vehicles: [...new Set(trips.map((trip) => trip.vehicle).filter(Boolean))],
    drivers: [...new Set(trips.map((trip) => trip.driver).filter(Boolean))],
  }), [trips]);

  function saveRecord(dialog, value) {
    const { type, mode, item } = dialog;

    if (type === 'passenger') {
      setPassengers((current) => mode === 'add'
        ? [...current, { ...value, id: nextNumericId(current) }]
        : current.map((record) => record.id === item.id ? { ...record, ...value } : record));
    }

    if (type === 'booking') {
      setBookings((current) => current.map((record) => (
        record.id === item.id ? { ...record, ...value } : record
      )));
    }

    if (type === 'payment') {
      setPayments((current) => mode === 'add'
        ? [...current, {
          ...value,
          id: nextCode(current, 'PAY'),
          date: new Date().toISOString(),
        }]
        : current.map((record) => record.id === item.id ? { ...record, ...value } : record));
    }
  }

  function deleteRecord(type, item) {
    if (type === 'passenger') {
      setPassengers((current) => current.filter((record) => record.id !== item.id));
    }
    if (type === 'booking') {
      setBookings((current) => current.filter((record) => record.id !== item.id));
    }
    if (type === 'payment') {
      setPayments((current) => current.filter((record) => record.id !== item.id));
    }
    if (type === 'trip') {
      setTrips((current) => current.filter((record) => record.id !== item.id));
    }
  }

  function saveTrip(value, editingTrip) {
    setTrips((current) => editingTrip
      ? current.map((trip) => trip.id === editingTrip.id ? { ...value, id: trip.id } : trip)
      : [...current, { ...value, id: nextNumericId(current) }]);
  }

  function saveBooking({ trip, passenger, count, seats, amount }) {
    setBookings((current) => [...current, {
      id: nextCode(current, 'BK'),
      passenger,
      route: trip.route,
      date: trip.date,
      seats: seats || Array.from({ length: count }, (_value, index) => index + 1).join(', '),
      amount,
      status: 'Confirmed',
    }]);
  }

  return {
    passengers,
    trips,
    bookings,
    payments,
    routes,
    tripOptions,
    saveRecord,
    deleteRecord,
    saveTrip,
    saveBooking,
  };
}
