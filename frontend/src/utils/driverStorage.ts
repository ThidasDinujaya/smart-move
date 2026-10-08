
export type Driver = {
  id: number;
  name: string;
  licenseNo: string;
  contact: string;
  assignedVehicle: string;
  status: string;
};

const STORAGE_KEY = "smartmove_drivers";

const defaultDrivers: Driver[] = [
  {
    id: 1,
    name: "Kamal Perera",
    licenseNo: "B1234567",
    contact: "0771234567",
    assignedVehicle: "NB-1234",
    status: "Active",
  },
  {
    id: 2,
    name: "Nuwan Silva",
    licenseNo: "B7654321",
    contact: "0712345678",
    assignedVehicle: "WP-5678",
    status: "Active",
  },
  {
    id: 3,
    name: "Sanath Fernando",
    licenseNo: "B9876543",
    contact: "0779876543",
    assignedVehicle: "CP-9012",
    status: "On Leave",
  },
  {
    id: 4,
    name: "Dilshan Jayasekara",
    licenseNo: "B4567891",
    contact: "0714567890",
    assignedVehicle: "EP-3456",
    status: "Active",
  },
  {
    id: 5,
    name: "Ramesh Priyantha",
    licenseNo: "B2345678",
    contact: "0762345678",
    assignedVehicle: "NB-7788",
    status: "Inactive",
  },
];

export function getDrivers(): Driver[] {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored !== null) {
    try {
      const parsed: unknown = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        return parsed as Driver[];
      }
    } catch {
      console.error("Failed to load drivers");
    }
  }

  return [...defaultDrivers];
}

export function saveDrivers(drivers: Driver[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drivers));
}

export function getDriverById(id: number): Driver | undefined {
  return getDrivers().find((driver) => driver.id === id);
}

export function addDriver(data: Omit<Driver, "id">): Driver {
  const drivers = getDrivers();

  if (
    drivers.some(
      (driver) =>
        driver.licenseNo.toLowerCase() ===
        data.licenseNo.trim().toLowerCase()
    )
  ) {
    throw new Error("License number already exists!");
  }

  const newDriver: Driver = {
    ...data,
    id: Math.max(0, ...drivers.map((driver) => driver.id)) + 1,
  };

  saveDrivers([...drivers, newDriver]);

  return newDriver;
}

export function updateDriver(updatedDriver: Driver): void {
  const drivers = getDrivers();

  if (!drivers.some((driver) => driver.id === updatedDriver.id)) {
    throw new Error("Driver not found!");
  }

  if (
    drivers.some(
      (driver) =>
        driver.id !== updatedDriver.id &&
        driver.licenseNo.toLowerCase() ===
          updatedDriver.licenseNo.toLowerCase()
    )
  ) {
    throw new Error("License number already exists!");
  }

  saveDrivers(
    drivers.map((driver) =>
      driver.id === updatedDriver.id ? updatedDriver : driver
    )
  );
}

export function deleteDriver(id: number): void {
  const drivers = getDrivers();

  saveDrivers(
    drivers.filter((driver) => driver.id !== id)
  );
}
