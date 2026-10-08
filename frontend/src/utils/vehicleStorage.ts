
export type Vehicle = {
  id: number;
  vehicleNo: string;
  type: string;
  brand: string;
  capacity: number;
  status: string;
  lastService: string;
  model?: string;
  year?: string;
};

const STORAGE_KEY = "smartmove_vehicles";

const defaultVehicles: Vehicle[] = [
  {
    id: 1,
    vehicleNo: "NB-1234",
    type: "Bus",
    brand: "Toyota",
    capacity: 45,
    status: "Active",
    lastService: "2025-08-10",
    model: "Coaster",
    year: "2021",
  },
  {
    id: 2,
    vehicleNo: "WP-5678",
    type: "Van",
    brand: "Nissan",
    capacity: 15,
    status: "Active",
    lastService: "2025-08-25",
    model: "Caravan",
    year: "2020",
  },
  {
    id: 3,
    vehicleNo: "CP-9012",
    type: "Bus",
    brand: "Ashok Leyland",
    capacity: 50,
    status: "In Service",
    lastService: "2025-07-30",
    model: "Viking",
    year: "2019",
  },
  {
    id: 4,
    vehicleNo: "EP-3456",
    type: "Van",
    brand: "Toyota",
    capacity: 12,
    status: "Under Maintenance",
    lastService: "2025-09-01",
    model: "HiAce",
    year: "2018",
  },
  {
    id: 5,
    vehicleNo: "NB-7788",
    type: "Bus",
    brand: "Tata",
    capacity: 45,
    status: "Active",
    lastService: "2025-08-15",
    model: "Starbus",
    year: "2022",
  },
];

export function getVehicles(): Vehicle[] {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored !== null) {
    try {
      const parsed: unknown = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        return parsed as Vehicle[];
      }
    } catch {
      console.error("Failed to load vehicles");
    }
  }

  return [...defaultVehicles];
}

export function saveVehicles(vehicles: Vehicle[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
}

export function getVehicleById(id: number): Vehicle | undefined {
  return getVehicles().find((vehicle) => vehicle.id === id);
}

export function addVehicle(
  data: Omit<Vehicle, "id">
): Vehicle {
  const vehicles = getVehicles();

  const duplicate = vehicles.some(
    (vehicle) =>
      vehicle.vehicleNo.toLowerCase() ===
      data.vehicleNo.toLowerCase()
  );

  if (duplicate) {
    throw new Error("Vehicle number already exists!");
  }

  const newVehicle: Vehicle = {
    ...data,
    id: Math.max(0, ...vehicles.map((v) => v.id)) + 1,
  };

  saveVehicles([...vehicles, newVehicle]);

  return newVehicle;
}

export function updateVehicle(updatedVehicle: Vehicle): void {
  const vehicles = getVehicles();

  const exists = vehicles.some(
    (vehicle) => vehicle.id === updatedVehicle.id
  );

  if (!exists) {
    throw new Error("Vehicle not found!");
  }

  const duplicate = vehicles.some(
    (vehicle) =>
      vehicle.id !== updatedVehicle.id &&
      vehicle.vehicleNo.toLowerCase() ===
        updatedVehicle.vehicleNo.toLowerCase()
  );

  if (duplicate) {
    throw new Error("Vehicle number already exists!");
  }

  const updated = vehicles.map((vehicle) =>
    vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
  );

  saveVehicles(updated);
}

export function deleteVehicle(id: number): void {
  const vehicles = getVehicles();

  saveVehicles(
    vehicles.filter((vehicle) => vehicle.id !== id)
  );
}
