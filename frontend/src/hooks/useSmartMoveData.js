import { useMemo, useState } from 'react';

const VEHICLES_STORAGE_KEY = 'smartmove_vehicles';
const DRIVERS_STORAGE_KEY = 'smartmove_drivers';
const ROUTES_STORAGE_KEY = 'smartmove_routes';

function createEmptyCollections() {
  return {
    passengers: [], trips: [], bookings: [], payments: [],
    maintenance: [], feedback: [],
  };
}

function uniqueValues(values) {
  return [...new Set(values.map(value => String(value ?? '').trim()).filter(Boolean))];
}

function createLocalId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadFromStorage(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistToStorage(key, records) {
  localStorage.setItem(key, JSON.stringify(records));
}

const collectionByType = {
  passenger: 'passengers',
  trip: 'trips',
  booking: 'bookings',
  payment: 'payments',
};

export default function useSmartMoveData() {
  const [collections, setCollections] = useState(
    createEmptyCollections
  );

  // VEHICLE DATA
  const [vehicles, setVehicles] = useState(() =>
    loadFromStorage(VEHICLES_STORAGE_KEY)
  );

  // DRIVER DATA
  const [drivers, setDrivers] = useState(() =>
    loadFromStorage(DRIVERS_STORAGE_KEY)
  );

  // ROUTE MANAGEMENT RECORDS (objects)
  const [routeRecords, setRouteRecords] = useState(() =>
    loadFromStorage(ROUTES_STORAGE_KEY)
  );

  // ROUTE NAMES FOR EXISTING TRIP/BOOKING COMPONENTS (strings)
  const routes = useMemo(
    () =>
      uniqueValues([
        ...routeRecords.filter(route => route.status !== 'Inactive').map(route => route.routeName),
        ...collections.trips.map((trip) => trip.route),
        ...collections.bookings.map((booking) => booking.route),
      ]),
    [routeRecords, collections.trips, collections.bookings]
  );

  // TRIP OPTIONS
  const tripOptions = useMemo(
    () => ({
      routes,

      vehicles: uniqueValues([
        ...vehicles.map((vehicle) => vehicle.vehicleNo),
        ...collections.trips.map((trip) => trip.vehicle),
      ]),

      drivers: uniqueValues([
        ...drivers.map((driver) => driver.name),
        ...collections.trips.map((trip) => trip.driver),
      ]),

      statuses: uniqueValues(
        collections.trips.map((trip) => trip.status)
      ),
    }),
    [collections.trips, routes, vehicles, drivers]
  );

  // MAINTENANCE OPTIONS
  const maintenanceOptions = useMemo(
    () => ({
      vehicles: uniqueValues([
        ...vehicles.map((vehicle) => vehicle.vehicleNo),
        ...collections.trips.map((trip) => trip.vehicle),
        ...collections.maintenance.map(
          (record) => record.vehicleNo
        ),
      ]),

      types: uniqueValues(
        collections.maintenance.map((record) => record.type)
      ),

      statuses: uniqueValues(
        collections.maintenance.map((record) => record.status)
      ),
    }),
    [collections.trips, collections.maintenance, vehicles]
  );

  // =====================================
  // VEHICLE MANAGEMENT
  // =====================================

  function saveVehicle(value) {
    const vehicleNo = String(value.vehicleNo || '').trim();

    if (!vehicleNo) {
      throw new Error('Vehicle number is required!');
    }

    const duplicate = vehicles.some(
      (vehicle) =>
        String(vehicle.vehicleNo || '').toLowerCase() ===
        vehicleNo.toLowerCase()
    );

    if (duplicate) {
      throw new Error('Vehicle number already exists!');
    }

    const newVehicle = {
      ...value,
      vehicleNo,
      id: createLocalId(),
    };

    const updatedVehicles = [newVehicle, ...vehicles];

    persistToStorage(VEHICLES_STORAGE_KEY, updatedVehicles);
    setVehicles(updatedVehicles);

    return true;
  }

  function deleteVehicle(id) {
    const updatedVehicles = vehicles.filter(
      (vehicle) => String(vehicle.id) !== String(id)
    );

    persistToStorage(VEHICLES_STORAGE_KEY, updatedVehicles);
    setVehicles(updatedVehicles);

    return true;
  }

  function updateVehicle(updatedVehicle) {
    const exists = vehicles.some(
      (vehicle) =>
        String(vehicle.id) === String(updatedVehicle.id)
    );

    if (!exists) {
      throw new Error('Vehicle not found!');
    }

    const duplicate = vehicles.some(
      (vehicle) =>
        String(vehicle.id) !== String(updatedVehicle.id) &&
        String(vehicle.vehicleNo || '').toLowerCase() ===
          String(updatedVehicle.vehicleNo || '').toLowerCase()
    );

    if (duplicate) {
      throw new Error('Vehicle number already exists!');
    }

    const updatedVehicles = vehicles.map((vehicle) =>
      String(vehicle.id) === String(updatedVehicle.id)
        ? { ...vehicle, ...updatedVehicle }
        : vehicle
    );

    persistToStorage(VEHICLES_STORAGE_KEY, updatedVehicles);
    setVehicles(updatedVehicles);

    return true;
  }

  // =====================================
  // DRIVER MANAGEMENT
  // =====================================

  // ADD DRIVER
  function saveDriver(value) {
    const name = String(value.name || '').trim();
    const nic = String(value.nic || '').trim();
    const licenseNo = String(value.licenseNo || '').trim();
    const contact = String(value.contact || value.phone || '').trim();

    if (!name || !nic || !licenseNo || !contact) {
      throw new Error('Please fill all required driver fields!');
    }

    const duplicateNIC = drivers.some(
      (driver) =>
        String(driver.nic || '').toLowerCase() ===
        nic.toLowerCase()
    );

    if (duplicateNIC) {
      throw new Error('This NIC is already registered!');
    }

    const duplicateLicense = drivers.some(
      (driver) =>
        String(driver.licenseNo || '').toLowerCase() ===
        licenseNo.toLowerCase()
    );

    if (duplicateLicense) {
      throw new Error('This license number is already registered!');
    }

    const newDriver = {
      ...value,
      id: createLocalId(),
      name,
      nic,
      licenseNo,
      contact,
      phone: contact,
    };

    const updatedDrivers = [newDriver, ...drivers];

    persistToStorage(DRIVERS_STORAGE_KEY, updatedDrivers);
    setDrivers(updatedDrivers);

    return true;
  }

  // VIEW DRIVER
  function getDriverById(id) {
    return (
      drivers.find(
        (driver) => String(driver.id) === String(id)
      ) || null
    );
  }

  // EDIT DRIVER
  function updateDriver(updatedDriver) {
    const exists = drivers.some(
      (driver) =>
        String(driver.id) === String(updatedDriver.id)
    );

    if (!exists) {
      throw new Error('Driver not found!');
    }

    const name = String(updatedDriver.name || '').trim();
    const licenseNo = String(updatedDriver.licenseNo || '').trim();
    const contact = String(updatedDriver.contact || '').trim();
    const nic = String(updatedDriver.nic || '').trim();

    if (!name || !licenseNo || !contact) {
      throw new Error('Please fill all required driver fields!');
    }

    const duplicateLicense = drivers.some(
      (driver) =>
        String(driver.id) !== String(updatedDriver.id) &&
        String(driver.licenseNo || '').toLowerCase() ===
          licenseNo.toLowerCase()
    );

    if (duplicateLicense) {
      throw new Error('This license number is already registered!');
    }

    const duplicateNIC = nic && drivers.some(
      (driver) =>
        String(driver.id) !== String(updatedDriver.id) &&
        String(driver.nic || '').toLowerCase() ===
          nic.toLowerCase()
    );

    if (duplicateNIC) {
      throw new Error('This NIC is already registered!');
    }

    const updatedDrivers = drivers.map((driver) =>
      String(driver.id) === String(updatedDriver.id)
        ? {
            ...driver,
            ...updatedDriver,
            name,
            nic,
            licenseNo,
            contact,
            phone: contact,
          }
        : driver
    );

    persistToStorage(DRIVERS_STORAGE_KEY, updatedDrivers);
    setDrivers(updatedDrivers);

    return true;
  }

  // DELETE DRIVER
  function deleteDriver(id) {
    const exists = drivers.some(
      (driver) => String(driver.id) === String(id)
    );

    if (!exists) {
      throw new Error('Driver not found!');
    }

    const updatedDrivers = drivers.filter(
      (driver) => String(driver.id) !== String(id)
    );

    persistToStorage(DRIVERS_STORAGE_KEY, updatedDrivers);
    setDrivers(updatedDrivers);

    return true;
  }

  // =====================================
  // ROUTE MANAGEMENT
  // =====================================
  function validateRoute(value, excludedId = null) {
    const routeNo = String(value.routeNo || '').trim();
    const routeName = String(value.routeName || '').trim();
    const startLocation = String(value.startLocation || '').trim();
    const endLocation = String(value.endLocation || '').trim();
    const distance = Number(value.distance);
    const fare = value.fare === '' || value.fare == null ? 0 : Number(value.fare);

    if (!routeNo || !routeName || !startLocation || !endLocation) {
      throw new Error('Please fill all required route fields!');
    }
    if (!Number.isFinite(distance) || distance <= 0) {
      throw new Error('Distance must be greater than zero!');
    }
    if (!Number.isFinite(fare) || fare < 0) {
      throw new Error('Fare must be zero or greater!');
    }
    if (routeRecords.some(route =>
      String(route.id) !== String(excludedId) &&
      String(route.routeNo || '').trim().toLowerCase() === routeNo.toLowerCase()
    )) {
      throw new Error('Route number already exists!');
    }
    return {
      ...value, routeNo, routeName, startLocation, endLocation,
      distance, fare, status: value.status || 'Active',
    };
  }

  function saveRoute(value) {
    const newRoute = { ...validateRoute(value), id: createLocalId() };
    const next = [newRoute, ...routeRecords];
    persistToStorage(ROUTES_STORAGE_KEY, next);
    setRouteRecords(next);
    return true;
  }

  function getRouteById(id) {
    return routeRecords.find(route => String(route.id) === String(id)) || null;
  }

  function updateRoute(value) {
    if (!routeRecords.some(route => String(route.id) === String(value.id))) {
      throw new Error('Route not found!');
    }
    const validated = validateRoute(value, value.id);
    const next = routeRecords.map(route =>
      String(route.id) === String(value.id)
        ? { ...route, ...validated, id: route.id }
        : route
    );
    persistToStorage(ROUTES_STORAGE_KEY, next);
    setRouteRecords(next);
    return true;
  }

  function deleteRoute(id) {
    if (!routeRecords.some(route => String(route.id) === String(id))) {
      throw new Error('Route not found!');
    }
    const next = routeRecords.filter(route => String(route.id) !== String(id));
    persistToStorage(ROUTES_STORAGE_KEY, next);
    setRouteRecords(next);
    return true;
  }

  // =====================================
  // EXISTING TEAMMATE FUNCTIONS
  // =====================================

  function saveRecord({ type, mode, item }, value) {
    const collection = collectionByType[type];

    if (!collection) return false;

    setCollections((current) => {
      const records = current[collection];

      const next =
        mode === 'edit'
          ? records.map((record) =>
              String(record.id) === String(item.id)
                ? { ...record, ...value }
                : record
            )
          : [{ ...value, id: createLocalId() }, ...records];

      return {
        ...current,
        [collection]: next,
      };
    });

    return true;
  }

  function deleteRecord(type, item) {
    const collection = collectionByType[type];

    if (!collection) return false;

    setCollections((current) => ({
      ...current,
      [collection]: current[collection].filter(
        (record) =>
          String(record.id) !== String(item.id)
      ),
    }));

    return true;
  }

  function saveTrip(value, editingTrip) {
    setCollections((current) => ({
      ...current,
      trips: editingTrip
        ? current.trips.map((trip) =>
            String(trip.id) === String(editingTrip.id)
              ? { ...trip, ...value }
              : trip
          )
        : [
            { ...value, id: createLocalId() },
            ...current.trips,
          ],
    }));

    return true;
  }

  function saveBooking({
    tripId,
    passengerId,
    seatCount,
    seats,
  }) {
    const trip = collections.trips.find(
      (record) =>
        String(record.id) === String(tripId)
    );

    const passenger = collections.passengers.find(
      (record) =>
        String(record.id) === String(passengerId)
    );

    if (!trip || !passenger) return false;

    setCollections((current) => ({
      ...current,
      bookings: [
        {
          id: createLocalId(),
          passenger: passenger.name,
          route: trip.route,
          date: trip.date,
          seats: seats || String(seatCount),
          amount:
            Number(trip.fare || 0) *
            Number(seatCount || 0),
          status: '',
        },
        ...current.bookings,
      ],
    }));

    return true;
  }

  function saveMaintenance(value) {
    setCollections((current) => ({
      ...current,
      maintenance: [
        { ...value, id: createLocalId() },
        ...current.maintenance,
      ],
    }));

    return true;
  }

  return {
    ...collections,

    // VEHICLES
    vehicles,
    saveVehicle,
    deleteVehicle,
    updateVehicle,

    // DRIVERS
    drivers,
    saveDriver,
    getDriverById,
    updateDriver,
    deleteDriver,

    // ROUTE MANAGEMENT
    routeRecords,
    saveRoute,
    getRouteById,
    updateRoute,
    deleteRoute,

    // EXISTING DATA
    reports: null,
    routes,
    tripOptions,
    maintenanceOptions,

    // EXISTING FUNCTIONS
    saveRecord,
    deleteRecord,
    saveTrip,
    saveBooking,
    saveMaintenance,
  };
}
