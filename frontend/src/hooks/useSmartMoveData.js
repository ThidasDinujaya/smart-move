import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const empty = {
  vehicles: [], drivers: [], routeRecords: [], passengers: [], trips: [], bookings: [],
  payments: [], maintenance: [], feedback: [],
};
const EMPTY_ROLES = [];
const LEGACY_MIGRATION_KEY = 'smartmove_legacy_records_migrated_v1';

const asArray = (value) => Array.isArray(value) ? value : [];
const vehicleFromApi = (vehicle) => ({
  ...vehicle,
  type: vehicle.vehicleType,
  capacity: vehicle.seatingCapacity,
  brand: vehicle.brand || '',
  year: vehicle.manufactureYear || '',
  lastService: vehicle.lastServiceDate || '',
});
const driverFromApi = (driver) => ({
  ...driver,
  phone: driver.contact,
  email: driver.email || '',
  assignedVehicle: driver.assignedVehicle || '',
});
const passengerFromApi = (passenger) => ({ ...passenger, name: passenger.fullName });
const tripFromApi = (trip) => ({
  ...trip,
  departure: String(trip.departure || '').slice(0, 5),
  arrival: String(trip.arrival || '').slice(0, 5),
});

async function migrateLegacyRecords() {
  if (localStorage.getItem(LEGACY_MIGRATION_KEY) === 'true') return;

  const legacyCollections = [
    {
      storageKey: 'smartmove_vehicles',
      endpoint: '/api/vehicles',
      matches: (existing, record) => existing.some((item) => String(item.vehicleNo).toLowerCase() === String(record.vehicleNo || '').toLowerCase()),
      payload: (record) => ({
        vehicleNo: record.vehicleNo,
        vehicleType: record.vehicleType || record.type,
        brand: record.brand,
        model: record.model,
        manufactureYear: record.year ? Number(record.year) : null,
        seatingCapacity: Number(record.capacity ?? record.seatingCapacity),
        fuelType: record.fuelType || null,
        lastServiceDate: record.lastService || record.serviceDate || null,
        imageData: record.imageData || null,
        status: record.status || 'Active',
      }),
    },
    {
      storageKey: 'smartmove_drivers',
      endpoint: '/api/drivers',
      matches: (existing, record) => existing.some((item) => String(item.nic).toLowerCase() === String(record.nic || '').toLowerCase()
        || String(item.licenseNo).toLowerCase() === String(record.licenseNo || '').toLowerCase()),
      payload: (record) => ({
        name: record.name,
        nic: record.nic,
        licenseNo: record.licenseNo,
        contact: record.contact || record.phone,
        email: record.email || null,
        assignedVehicle: record.assignedVehicle || null,
        address: record.address || null,
        imageData: record.imageData || null,
        status: record.status || 'Active',
      }),
    },
    {
      storageKey: 'smartmove_routes',
      endpoint: '/api/routes',
      matches: (existing, record) => existing.some((item) => String(item.routeNo).toLowerCase() === String(record.routeNo || '').toLowerCase()),
      payload: (record) => ({
        routeNo: record.routeNo,
        routeName: record.routeName,
        startLocation: record.startLocation,
        endLocation: record.endLocation,
        distance: Number(record.distance),
        estimatedTime: record.estimatedTime || null,
        fare: Number(record.fare || 0),
        description: record.description || null,
        status: record.status || 'Active',
      }),
    },
  ];

  for (const collection of legacyCollections) {
    const stored = localStorage.getItem(collection.storageKey);
    if (!stored) continue;
    const legacyRecords = JSON.parse(stored);
    if (!Array.isArray(legacyRecords)) throw new Error(`Legacy ${collection.storageKey} data is invalid; it was left in browser storage.`);
    const existingRecords = asArray(await api.get(collection.endpoint));
    for (const record of legacyRecords) {
      if (!collection.matches(existingRecords, record)) {
        const saved = await api.post(collection.endpoint, collection.payload(record));
        existingRecords.push(saved);
      }
    }
    localStorage.removeItem(collection.storageKey);
  }
  localStorage.setItem(LEGACY_MIGRATION_KEY, 'true');
}

export default function useSmartMoveData(enabled = true, roles = EMPTY_ROLES) {
  const [records, setRecords] = useState(empty);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!enabled) {
      setRecords(empty);
      setReports(null);
      return;
    }
    setLoading(true);
    setError('');
    const isAdmin = roles.includes('admin');
    const canOperate = isAdmin || roles.includes('operations');
    const canSeeFinance = isAdmin || roles.includes('finance');
    const canSupport = isAdmin || roles.includes('support');
    if (!canSeeFinance) setReports(null);
    try {
      if (canOperate) await migrateLegacyRecords();
    } catch (migrationError) {
      setError(migrationError.message || 'Unable to move legacy browser records into the database.');
      setLoading(false);
      return;
    }
    const resources = [
      ...(canOperate ? [
        ['vehicles', '/api/vehicles'],
        ['drivers', '/api/drivers'],
        ['routeRecords', '/api/routes'],
        ['maintenance', '/api/maintenance'],
      ] : []),
      ...(canSupport ? [['feedback', '/api/feedback']] : []),
      ...(canOperate ? [['passengers', '/api/passengers'], ['trips', '/api/trips']] : []),
      ...(canOperate || canSeeFinance ? [['bookings', '/api/bookings/admin']] : []),
      ...(canSeeFinance ? [['payments', '/api/payments']] : []),
      ...(canSeeFinance ? [['reports', '/api/reports']] : []),
    ];
    const results = await Promise.allSettled(resources.map(([, path]) => api.get(path)));
    const failed = [];
    const next = { ...empty };
    results.forEach((result, index) => {
      const [key] = resources[index];
      if (key === 'reports') {
        if (result.status === 'fulfilled') setReports(result.value);
        else {
          setReports(null);
          failed.push(result.reason?.message || 'Unable to load reports.');
        }
      } else if (result.status === 'fulfilled') next[key] = asArray(result.value);
      else failed.push(result.reason?.message || `Unable to load ${key}.`);
    });

    const routeById = new Map(next.routeRecords.map((route) => [String(route.id), route]));
    const passengerById = new Map(next.passengers.map((passenger) => [String(passenger.id), passenger]));
    const tripById = new Map(next.trips.map((trip) => [String(trip.id), trip]));
    next.vehicles = next.vehicles.map(vehicleFromApi);
    next.drivers = next.drivers.map(driverFromApi);
    next.passengers = next.passengers.map(passengerFromApi);
    next.trips = next.trips.map(tripFromApi);
    next.bookings = next.bookings.map((booking) => {
      const trip = tripById.get(String(booking.tripId));
      const passenger = passengerById.get(String(booking.passengerId));
      return {
        ...booking,
        id: booking.id,
        passenger: passenger?.fullName || `Passenger #${booking.passengerId}`,
        route: trip?.route || `${booking.from} - ${booking.to}`,
        date: booking.date,
        seats: booking.tickets?.map((ticket) => ticket.seatNumber).join(', ') || booking.seatCount,
        amount: booking.totalAmount,
        status: booking.status,
      };
    });
    next.payments = next.payments.map((payment) => {
      const booking = next.bookings.find((item) => String(item.id) === String(payment.bookingId));
      return {
        ...payment,
        booking: payment.bookingId,
        passenger: passengerById.get(String(booking?.passengerId))?.fullName || `Passenger #${booking?.passengerId ?? '—'}`,
        amount: payment.amount,
        method: payment.paymentMethod,
        status: payment.paymentStatus,
        date: payment.paymentDate,
        route: booking?.route || '',
      };
    });
    next.maintenance = next.maintenance.map((item) => ({
      ...item,
      vehicleNo: next.vehicles.find((vehicle) => String(vehicle.id) === String(item.vehicleId))?.vehicleNo || `Vehicle #${item.vehicleId}`,
      type: item.serviceType,
      date: item.startDate,
      nextService: item.nextServiceDate || '',
    }));
    next.feedback = next.feedback.map((item) => {
      const trip = tripById.get(String(item.tripId));
      return {
        ...item,
        passengerName: passengerById.get(String(item.passengerId))?.fullName || `Passenger #${item.passengerId}`,
        route: routeById.get(String(trip?.routeId))?.routeName || trip?.route || `Trip #${item.tripId}`,
        date: item.createdAt,
      };
    });
    setRecords(next);
    if (failed.length) setError(failed[0]);
    setLoading(false);
  }, [enabled, roles]);

  useEffect(() => { refresh(); }, [refresh]);

  const routes = useMemo(() => records.routeRecords
    .filter((route) => String(route.status || '').toLowerCase() !== 'inactive')
    .map((route) => route.routeName), [records.routeRecords]);
  const tripOptions = useMemo(() => ({
    routes: records.routeRecords.filter((route) => String(route.status || '').toLowerCase() !== 'inactive'),
    vehicles: records.vehicles.filter((vehicle) => String(vehicle.status || '').toLowerCase() === 'active'),
    drivers: records.drivers.filter((driver) => String(driver.status || '').toLowerCase() === 'active'),
    statuses: ['Scheduled', 'Cancelled', 'Completed'],
  }), [records.routeRecords, records.vehicles, records.drivers]);
  const maintenanceOptions = useMemo(() => ({
    vehicles: records.vehicles.map((vehicle) => vehicle.vehicleNo),
    types: [...new Set(records.maintenance.map((item) => item.type).filter(Boolean))],
    statuses: ['Scheduled', 'Pending', 'Due', 'Completed', 'Overdue'],
  }), [records.vehicles, records.maintenance]);

  const saveVehicle = useCallback(async (value) => {
    const payload = {
      vehicleNo: value.vehicleNo,
      vehicleType: value.type || value.vehicleType,
      brand: value.brand,
      model: value.model,
      manufactureYear: value.year ? Number(value.year) : null,
      seatingCapacity: Number(value.capacity ?? value.seatingCapacity),
      fuelType: value.fuelType || null,
      lastServiceDate: value.lastService || null,
      status: value.status,
      imageData: value.imageData || null,
    };
    const saved = value.id
      ? await api.put(`/api/vehicles/${value.id}`, payload)
      : await api.post('/api/vehicles', payload);
    await refresh();
    return saved;
  }, [refresh]);
  const deleteVehicle = useCallback(async (id) => { await api.delete(`/api/vehicles/${id}`); await refresh(); return true; }, [refresh]);
  const updateVehicle = useCallback((value) => saveVehicle(value), [saveVehicle]);

  const saveDriver = useCallback(async (value) => {
    const payload = {
      name: value.name,
      nic: value.nic,
      licenseNo: value.licenseNo,
      contact: value.contact || value.phone,
      email: value.email || null,
      address: value.address || null,
      assignedVehicle: value.assignedVehicle || null,
      status: value.status,
      imageData: value.imageData || null,
    };
    const saved = value.id
      ? await api.put(`/api/drivers/${value.id}`, payload)
      : await api.post('/api/drivers', payload);
    await refresh();
    return saved;
  }, [refresh]);
  const updateDriver = useCallback((value) => saveDriver(value), [saveDriver]);
  const deleteDriver = useCallback(async (id) => { await api.delete(`/api/drivers/${id}`); await refresh(); return true; }, [refresh]);

  const saveRoute = useCallback(async (value) => {
    const payload = {
      routeNo: value.routeNo,
      routeName: value.routeName,
      startLocation: value.startLocation,
      endLocation: value.endLocation,
      distance: Number(value.distance),
      estimatedTime: value.estimatedTime || null,
      fare: value.fare === '' ? 0 : Number(value.fare),
      status: value.status,
      description: value.description || null,
    };
    const saved = value.id
      ? await api.put(`/api/routes/${value.id}`, payload)
      : await api.post('/api/routes', payload);
    await refresh();
    return saved;
  }, [refresh]);
  const updateRoute = useCallback((value) => saveRoute(value), [saveRoute]);
  const deleteRoute = useCallback(async (id) => { await api.delete(`/api/routes/${id}`); await refresh(); return true; }, [refresh]);

  const saveTrip = useCallback(async (value, editingTrip) => {
    const route = records.routeRecords.find((item) => item.routeName === value.route || String(item.id) === String(value.routeId));
    const vehicle = records.vehicles.find((item) => item.vehicleNo === value.vehicle || String(item.id) === String(value.vehicleId));
    const driver = records.drivers.find((item) => item.name === value.driver || String(item.id) === String(value.driverId));
    if (!route || !vehicle || !driver) throw new Error('Select a saved route, vehicle, and driver.');
    const payload = {
      routeId: route.id, vehicleId: vehicle.id, driverId: driver.id,
      date: value.date, departure: value.departure, arrival: value.arrival,
      seats: Number(value.seats), fare: Number(value.fare), status: value.status || 'Scheduled', notes: value.notes || null,
    };
    const id = editingTrip?.id || value.id;
    const saved = id ? await api.put(`/api/trips/${id}`, payload) : await api.post('/api/trips', payload);
    await refresh();
    return saved;
  }, [records.routeRecords, records.vehicles, records.drivers, refresh]);
  const deleteTrip = useCallback(async (id) => { await api.delete(`/api/trips/${id}`); await refresh(); return true; }, [refresh]);

  const savePassenger = useCallback(async (value, item) => {
    const payload = {
      fullName: value.fullName || value.name,
      email: value.email,
      phone: value.phone,
      nic: value.nic || null,
      gender: value.gender || null,
      status: value.status || 'Active',
    };
    const id = item?.id || value.id;
    const saved = id ? await api.put(`/api/passengers/${id}`, payload) : await api.post('/api/passengers', payload);
    await refresh();
    return saved;
  }, [refresh]);

  const deletePassenger = useCallback(async (id) => { await api.delete(`/api/passengers/${id}`); await refresh(); return true; }, [refresh]);
  const deleteBooking = useCallback(async (id) => { await api.delete(`/api/bookings/admin/${id}`); await refresh(); return true; }, [refresh]);
  const createAdminBooking = useCallback(async (value) => {
    const passenger = records.passengers.find((item) => String(item.id) === String(value.passengerId)
      || item.fullName === (value.passenger || value.fullName));
    const trip = records.trips.find((item) => String(item.id) === String(value.tripId)
      || (item.route === value.route && item.date === value.date));
    const seatNumbers = String(value.seats || '').split(',').map((seat) => Number(seat.trim())).filter(Number.isInteger);
    if (!passenger || !trip || !seatNumbers.length) throw new Error('Select a passenger, a scheduled trip, and seat numbers (for example: 1, 2).');
    const saved = await api.post('/api/bookings/admin', { passengerId: passenger.id, tripId: trip.id, seatNumbers });
    await refresh();
    return saved;
  }, [records.passengers, records.trips, refresh]);

  const saveRecord = useCallback(async (config, value) => {
    if (config.type === 'passenger') return savePassenger(value, config.item);
    if (config.type === 'booking' && config.mode === 'add') return createAdminBooking(value);
    if (config.type === 'payment' && config.mode === 'add') {
      const booking = records.bookings.find((item) => String(item.id) === String(value.booking));
      if (!booking) throw new Error('Select an existing booking.');
      const result = await api.post('/api/payments/process', {
        bookingId: booking.id, amount: booking.totalAmount || booking.amount,
        paymentMethod: value.method || value.paymentMethod || 'Card',
      });
      await refresh();
      return result;
    }
    throw new Error(`Saving ${config.type} records is not supported by the backend yet.`);
  }, [savePassenger, createAdminBooking, records.bookings, refresh]);

  const deleteRecord = useCallback(async (type, item) => {
    if (type === 'passenger') return deletePassenger(item.id);
    if (type === 'booking') return deleteBooking(item.id);
    if (type === 'trip') return deleteTrip(item.id);
    throw new Error(`Deleting ${type} records is not supported by the backend.`);
  }, [deletePassenger, deleteBooking, deleteTrip]);

  const saveMaintenance = useCallback(async (value) => {
    const vehicle = records.vehicles.find((item) => item.vehicleNo === value.vehicleNo);
    if (!vehicle) throw new Error('Select a saved vehicle.');
    const saved = await api.post('/api/maintenance', {
      vehicleId: vehicle.id,
      serviceType: value.type,
      description: value.description || null,
      cost: value.cost === '' ? null : Number(value.cost),
      startDate: value.date,
      nextServiceDate: value.nextService,
      provider: value.provider || null,
      status: value.status,
    });
    await refresh();
    return saved;
  }, [records.vehicles, refresh]);

  const updateFeedbackStatus = useCallback(async (id, reviewStatus) => {
    const updated = await api.put(`/api/feedback/${id}/status`, { reviewStatus });
    await refresh();
    return updated;
  }, [refresh]);

  const updateFeedbackResponse = useCallback(async (id, message) => {
    const updated = await api.put(`/api/feedback/${id}/response`, { message });
    await refresh();
    return updated;
  }, [refresh]);

  return {
    ...records,
    loading,
    error,
    refresh,
    reports,
    routes,
    routeRecords: records.routeRecords,
    tripOptions,
    maintenanceOptions,
    saveVehicle, updateVehicle, deleteVehicle,
    saveDriver, updateDriver, deleteDriver,
    saveRoute, updateRoute, deleteRoute,
    saveTrip, deleteTrip, saveRecord, deleteRecord, saveMaintenance, updateFeedbackStatus, updateFeedbackResponse,
  };
}
