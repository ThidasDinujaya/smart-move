
export type TransportRoute = {
  id: number;
  routeName: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  estimatedDuration: string;
  assignedVehicle: string;
  status: string;
};

const STORAGE_KEY = "smartmove_routes";

const defaultRoutes: TransportRoute[] = [
  {
    id: 1,
    routeName: "Colombo - Kandy",
    startLocation: "Colombo",
    endLocation: "Kandy",
    distance: 115,
    estimatedDuration: "3 hours",
    assignedVehicle: "NB-1234",
    status: "Active",
  },
  {
    id: 2,
    routeName: "Colombo - Galle",
    startLocation: "Colombo",
    endLocation: "Galle",
    distance: 120,
    estimatedDuration: "2 hours",
    assignedVehicle: "WP-5678",
    status: "Active",
  },
  {
    id: 3,
    routeName: "Kandy - Nuwara Eliya",
    startLocation: "Kandy",
    endLocation: "Nuwara Eliya",
    distance: 75,
    estimatedDuration: "2.5 hours",
    assignedVehicle: "CP-9012",
    status: "Inactive",
  },
];

export function getRoutes(): TransportRoute[] {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved !== null) {
    try {
      const parsed: unknown = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed as TransportRoute[];
      }
    } catch {
      console.error("Failed to load routes");
    }
  }

  return [...defaultRoutes];
}

export function saveRoutes(routes: TransportRoute[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
}

export function getRouteById(
  id: number
): TransportRoute | undefined {
  return getRoutes().find((route) => route.id === id);
}

export function addRoute(
  data: Omit<TransportRoute, "id">
): TransportRoute {
  const routes = getRoutes();

  const newRoute: TransportRoute = {
    ...data,
    id: Math.max(0, ...routes.map((route) => route.id)) + 1,
  };

  saveRoutes([...routes, newRoute]);

  return newRoute;
}

export function updateRoute(
  updatedRoute: TransportRoute
): void {
  const routes = getRoutes();

  if (!routes.some((route) => route.id === updatedRoute.id)) {
    throw new Error("Route not found!");
  }

  saveRoutes(
    routes.map((route) =>
      route.id === updatedRoute.id ? updatedRoute : route
    )
  );
}

export function deleteRoute(id: number): void {
  saveRoutes(getRoutes().filter((route) => route.id !== id));
}
