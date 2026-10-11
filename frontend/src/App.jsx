import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes as RouterRoutes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import AppLayout from "./components/AppLayout.jsx";
import Login from "./pages/Login.jsx";

// Admin dashboard
import Dashboard from "./pages/admin/Dashboard.jsx";

// Vehicle management
import Vehicles from "./pages/admin/Vehicles.jsx";
import AddVehicle from "./pages/admin/AddVehicle.jsx";
import ViewVehicle from "./pages/admin/ViewVehicle.jsx";
import EditVehicle from "./pages/admin/EditVehicle.jsx";

// Driver management
import Drivers from "./pages/admin/Drivers.jsx";
import AddDriver from "./pages/admin/AddDriver.jsx";
import ViewDriver from "./pages/admin/ViewDriver.jsx";
import EditDriver from "./pages/admin/EditDriver.jsx";

// Route management (alias avoids conflict with React Router's Routes)
import RoutesPage from "./pages/admin/Routes.jsx";
import AddRoute from "./pages/admin/AddRoute.jsx";
import ViewRoute from "./pages/admin/ViewRoute.jsx";
import EditRoute from "./pages/admin/EditRoute.jsx";

// Operations and management
import PassengersPage from "./pages/admin/PassengersPage.jsx";
import TripsPage from "./pages/admin/TripsPage.jsx";
import BookingsPage from "./pages/admin/BookingsPage.jsx";
import PaymentsPage from "./pages/admin/PaymentsPage.jsx";
import PaymentReceiptPage from "./pages/admin/PaymentReceiptPage.jsx";
import MaintenanceManagement from "./pages/admin/MaintenanceManagement.jsx";
import AddMaintenance from "./pages/admin/AddMaintenance.jsx";
import FeedbackReviews from "./pages/admin/FeedbackReviews.jsx";
import ReportsDashboard from "./pages/admin/ReportsDashboard.jsx";

// Customer portal
import CustomerHome from "./pages/customer/CustomerHome.jsx";
import CustomerLogin from "./pages/customer/CustomerLogin.jsx";
import CustomerRegister from "./pages/customer/CustomerRegister.jsx";
import SearchBuses from "./pages/customer/SearchBuses.jsx";
import SearchResults from "./pages/customer/SearchResults.jsx";
import BusDetails from "./pages/customer/BusDetails.jsx";
import SeatSelection from "./pages/customer/SeatSelection.jsx";
import MyBookings from "./pages/customer/MyBookings.jsx";
import CustomerProfile from "./pages/customer/CustomerProfile.jsx";
import PaymentPage from "./pages/customer/PaymentPage.jsx";
import BookingSuccess from "./pages/customer/BookingSuccess.jsx";

// Shared data hook
import useSmartMoveData from "./hooks/useSmartMoveData.js";
import { getCurrentCustomer } from "./utils/customerAuth.js";
import { getCurrentAdminDemoUser, hasPermission, hasRole, PERMISSIONS, ROLES } from "./utils/roleAccess.js";

function CustomerAuthRoute({ children, permission }) {
  const location = useLocation();
  const customer = getCurrentCustomer();

  if (!customer) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRole(customer, ROLES.CUSTOMER) || !hasPermission(customer, permission)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AdminApp() {
  const location = useLocation();
  const routerNavigate = useNavigate();
  const [adminUser, setAdminUser] = useState(getCurrentAdminDemoUser);
  const isAuthenticated = hasRole(adminUser, ROLES.ADMIN);

  const [page, setPage] = useState("dashboard");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const data = useSmartMoveData();

  const {
    vehicles = [],
    drivers = [],
    routeRecords = [],
    routes = [],
    passengers = [],
    trips = [],
    bookings = [],
    payments = [],
    maintenance = [],
    feedback = [],
    tripOptions,
    maintenanceOptions,
  } = data;

  // 
  // LOGIN / LOGOUT
  // 

  function handleLogin({ rememberMe = false } = {}) {
    sessionStorage.removeItem("smartmove_admin_demo");
    localStorage.removeItem("smartmove_admin_demo");

    if (rememberMe) {
      localStorage.setItem("smartmove_admin_demo", "true");
    } else {
      sessionStorage.setItem("smartmove_admin_demo", "true");
    }

    setAdminUser(getCurrentAdminDemoUser());
    setSelectedRecord(null);
    setPage("dashboard");
    routerNavigate("/admin", { replace: true });
  }

  function handleLogout() {
    sessionStorage.removeItem("smartmove_admin_demo");
    localStorage.removeItem("smartmove_admin_demo");

    setAdminUser(null);
    setSelectedRecord(null);
    setPage("dashboard");
    routerNavigate("/admin/login", { replace: true });
  }

  // 
  // NAVIGATION
  // 

  function permissionForPage(nextPage) {
    if (nextPage === "dashboard") return PERMISSIONS.ADMIN_DASHBOARD_READ;
    if (nextPage.includes("vehicle")) return PERMISSIONS.FLEET_VEHICLES_MANAGE;
    if (nextPage.includes("driver")) return PERMISSIONS.FLEET_DRIVERS_MANAGE;
    if (nextPage.includes("route")) return PERMISSIONS.FLEET_ROUTES_MANAGE;
    if (nextPage.includes("maintenance")) return PERMISSIONS.FLEET_MAINTENANCE_MANAGE;
    if (nextPage === "passengers") return PERMISSIONS.OPERATIONS_PASSENGERS_READ;
    if (nextPage === "trips") return PERMISSIONS.OPERATIONS_TRIPS_MANAGE;
    if (nextPage === "bookings") return PERMISSIONS.OPERATIONS_BOOKINGS_MANAGE;
    if (nextPage === "payments" || nextPage === "payment-receipt") return PERMISSIONS.FINANCE_PAYMENTS_MANAGE;
    if (nextPage === "feedback") return PERMISSIONS.SUPPORT_FEEDBACK_MANAGE;
    if (nextPage === "reports") return PERMISSIONS.REPORTS_READ;
    return null;
  }

  function navigate(nextPage) {
    const requiredPermission = permissionForPage(nextPage);
    if (!requiredPermission || !hasPermission(adminUser, requiredPermission)) return;

    setSelectedRecord(null);
    setPage(nextPage);
  }

  function openRecord(nextPage, record) {
    const requiredPermission = permissionForPage(nextPage);
    if (!requiredPermission || !hasPermission(adminUser, requiredPermission)) return;

    setSelectedRecord(record);
    setPage(nextPage);
  }

  // 
  // VEHICLE CRUD
  // 

  async function handleAddVehicle(vehicle) {
    try {
      const result = await data.saveVehicle(vehicle);

      if (result !== false) {
        navigate("vehicles");
      }

      return result;
    } catch (error) {
      window.alert(error.message || "Unable to save vehicle.");
      return false;
    }
  }

  async function handleUpdateVehicle(vehicle) {
    try {
      const result = await data.updateVehicle(vehicle);

      if (result !== false) {
        navigate("vehicles");
      }

      return result;
    } catch (error) {
      window.alert(error.message || "Unable to update vehicle.");
      return false;
    }
  }

  async function handleDeleteVehicle(vehicle) {
    try {
      return await data.deleteVehicle(vehicle?.id ?? vehicle);
    } catch (error) {
      window.alert(error.message || "Unable to delete vehicle.");
      return false;
    }
  }

  // 
  // DRIVER CRUD
  // 

  async function handleAddDriver(driver) {
    try {
      const result = await data.saveDriver(driver);

      if (result !== false) {
        navigate("drivers");
      }

      return result;
    } catch (error) {
      window.alert(error.message || "Unable to save driver.");
      return false;
    }
  }

  async function handleUpdateDriver(driver) {
    try {
      const result = await data.updateDriver(driver);

      if (result !== false) {
        navigate("drivers");
      }

      return result;
    } catch (error) {
      window.alert(error.message || "Unable to update driver.");
      return false;
    }
  }

  async function handleDeleteDriver(driver) {
    try {
      return await data.deleteDriver(driver?.id ?? driver);
    } catch (error) {
      window.alert(error.message || "Unable to delete driver.");
      return false;
    }
  }

  // 
  // ROUTE CRUD
  // 

  async function handleAddRoute(route) {
    try {
      const result = await data.saveRoute(route);

      if (result !== false) {
        navigate("routes");
      }

      return result;
    } catch (error) {
      window.alert(error.message || "Unable to save route.");
      return false;
    }
  }

  async function handleUpdateRoute(route) {
    try {
      const result = await data.updateRoute(route);

      if (result !== false) {
        navigate("routes");
      }

      return result;
    } catch (error) {
      window.alert(error.message || "Unable to update route.");
      return false;
    }
  }

  async function handleDeleteRoute(route) {
    try {
      return await data.deleteRoute(route?.id ?? route);
    } catch (error) {
      window.alert(error.message || "Unable to delete route.");
      return false;
    }
  }

  // 
  // TEAMMATE DATA FUNCTIONS
  // 

  async function handleSaveRecord(config, value) {
    return data.saveRecord(config, value);
  }

  async function handleDeleteRecord(type, item) {
    return data.deleteRecord(type, item);
  }

  async function handleSaveTrip(value, editingTrip) {
    return data.saveTrip(value, editingTrip);
  }

  async function handleSaveBooking(value) {
    return data.saveBooking(value);
  }

  async function handleSaveMaintenance(value) {
    const result = await data.saveMaintenance(value);

    if (result !== false) {
      navigate("maintenance");
    }

    return result;
  }

  // 
  // PAGE RENDERING
  // 

  function renderPage() {
    switch (page) {
      // DASHBOARD
      case "dashboard":
        return (
          <Dashboard
            vehicles={vehicles}
            drivers={drivers}
            routes={routes}
            passengers={passengers}
            trips={trips}
            bookings={bookings}
            payments={payments}
            maintenance={maintenance}
            onNavigate={navigate}
          />
        );

      // ===
      // VEHICLES
      // ===

      case "vehicles":
        return (
          <Vehicles
            vehicles={vehicles}
            onAdd={() => navigate("add-vehicle")}
            onView={(vehicle) =>
              openRecord("view-vehicle", vehicle)
            }
            onEdit={(vehicle) =>
              openRecord("edit-vehicle", vehicle)
            }
            onDelete={handleDeleteVehicle}
          />
        );

      case "add-vehicle":
        return (
          <AddVehicle
            vehicles={vehicles}
            onSave={handleAddVehicle}
            onCancel={() => navigate("vehicles")}
          />
        );

      case "view-vehicle":
        return (
          <ViewVehicle
            vehicle={selectedRecord}
            onBack={() => navigate("vehicles")}
            onEdit={() =>
              openRecord("edit-vehicle", selectedRecord)
            }
          />
        );

      case "edit-vehicle":
        return (
          <EditVehicle
            vehicle={selectedRecord}
            vehicles={vehicles}
            onSave={handleUpdateVehicle}
            onCancel={() => navigate("vehicles")}
          />
        );

      // ===
      // DRIVERS
      // ===

      case "drivers":
        return (
          <Drivers
            drivers={drivers}
            vehicles={vehicles}
            onAdd={() => navigate("add-driver")}
            onView={(driver) =>
              openRecord("view-driver", driver)
            }
            onEdit={(driver) =>
              openRecord("edit-driver", driver)
            }
            onDelete={handleDeleteDriver}
          />
        );

      case "add-driver":
        return (
          <AddDriver
            drivers={drivers}
            vehicles={vehicles}
            onSave={handleAddDriver}
            onCancel={() => navigate("drivers")}
          />
        );

      case "view-driver":
        return (
          <ViewDriver
            driver={selectedRecord}
            onBack={() => navigate("drivers")}
            onEdit={() =>
              openRecord("edit-driver", selectedRecord)
            }
          />
        );

      case "edit-driver":
        return (
          <EditDriver
            driver={selectedRecord}
            drivers={drivers}
            vehicles={vehicles}
            onSave={handleUpdateDriver}
            onCancel={() => navigate("drivers")}
          />
        );

      // ===
      // ROUTES
      // ===

      case "routes":
        return (
          <RoutesPage
            routes={routeRecords}
            onAdd={() => navigate("add-route")}
            onView={(route) =>
              openRecord("view-route", route)
            }
            onEdit={(route) =>
              openRecord("edit-route", route)
            }
            onDelete={handleDeleteRoute}
          />
        );

      case "add-route":
        return (
          <AddRoute
            routes={routeRecords}
            onSave={handleAddRoute}
            onCancel={() => navigate("routes")}
          />
        );

      case "view-route":
        return (
          <ViewRoute
            route={selectedRecord}
            onBack={() => navigate("routes")}
            onEdit={() =>
              openRecord("edit-route", selectedRecord)
            }
          />
        );

      case "edit-route":
        return (
          <EditRoute
            route={selectedRecord}
            routes={routeRecords}
            onSave={handleUpdateRoute}
            onCancel={() => navigate("routes")}
          />
        );

      // ===
      // PASSENGERS
      // ===

      case "passengers":
        return (
          <PassengersPage
            passengers={passengers}
            onSaveRecord={handleSaveRecord}
            onDeleteRecord={handleDeleteRecord}
            data={data}
          />
        );

      // ===
      // TRIPS
      // ===

      case "trips":
        return (
          <TripsPage
            trips={trips}
            vehicles={vehicles}
            drivers={drivers}
            routes={routes}
            tripOptions={tripOptions}
            onSaveTrip={handleSaveTrip}
            onDeleteRecord={handleDeleteRecord}
            data={data}
          />
        );

      // ===
      // BOOKINGS
      // ===

      case "bookings":
        return (
          <BookingsPage
            bookings={bookings}
            passengers={passengers}
            trips={trips}
            onSaveBooking={handleSaveBooking}
            onSaveRecord={handleSaveRecord}
            onDeleteRecord={handleDeleteRecord}
            data={data}
          />
        );

      // ===
      // PAYMENTS
      // ===

      case "payments":
        return (
          <PaymentsPage
            payments={payments}
            bookings={bookings}
            onSaveRecord={handleSaveRecord}
            onDeleteRecord={handleDeleteRecord}
            onViewReceipt={(payment) =>
              openRecord("payment-receipt", payment)
            }
            data={data}
          />
        );

      case "payment-receipt":
        return (
          <PaymentReceiptPage
            payment={selectedRecord}
            onBack={() => navigate("payments")}
            data={data}
          />
        );

      // ===
      // MAINTENANCE
      // ===

      case "maintenance":
        return (
          <MaintenanceManagement
            maintenance={maintenance}
            vehicles={vehicles}
            maintenanceOptions={maintenanceOptions}
            onAdd={() => navigate("add-maintenance")}
            data={data}
          />
        );

      case "add-maintenance":
        return (
          <AddMaintenance
            vehicles={vehicles}
            onSave={handleSaveMaintenance}
            onCancel={() => navigate("maintenance")}
          />
        );

      // ===
      // FEEDBACK
      // ===

      case "feedback":
        return (
          <FeedbackReviews
            feedback={feedback}
            data={data}
          />
        );

      // ===
      // REPORTS
      // ===

      case "reports":
        return (
          <ReportsDashboard
            vehicles={vehicles}
            drivers={drivers}
            routes={routes}
            trips={trips}
            bookings={bookings}
            payments={payments}
            data={data}
          />
        );

      default:
        return (
          <Dashboard
            vehicles={vehicles}
            drivers={drivers}
            routes={routes}
            trips={trips}
            bookings={bookings}
            onNavigate={navigate}
          />
        );
    }
  }

  // 
  // LOGIN PAGE
  // 

  if (!isAuthenticated) {
    if (location.pathname !== "/admin/login") {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <Login onLogin={handleLogin} />;
  }

  if (location.pathname === "/admin/login") {
    return <Navigate to="/admin" replace />;
  }

  // 
  // SIDEBAR ACTIVE PAGE
  // 

  const sidebarPage = page.includes("vehicle")
    ? "vehicles"
    : page.includes("driver")
      ? "drivers"
      : page.includes("route")
        ? "routes"
        : page.includes("maintenance")
          ? "maintenance"
          : page === "payment-receipt"
            ? "payments"
            : page;

  // 
  // ADMIN LAYOUT
  // 

  return (
    <AppLayout
      activePage={sidebarPage}
      onNavigate={navigate}
      onLogout={handleLogout}
      user={adminUser}
    >
      {renderPage()}
    </AppLayout>
  );
}

export default function App() {
  return (
    <Router>
      <RouterRoutes>
        {/* Customer portal */}
        <Route path="/" element={<CustomerHome />} />
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/register" element={<CustomerRegister />} />
        <Route path="/search" element={<SearchBuses />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/bus-details" element={<BusDetails />} />
        <Route path="/seat-selection" element={<SeatSelection />} />
        <Route path="/my-bookings" element={<CustomerAuthRoute permission={PERMISSIONS.CUSTOMER_BOOKINGS_READ}><MyBookings /></CustomerAuthRoute>} />
        <Route path="/profile" element={<CustomerAuthRoute permission={PERMISSIONS.CUSTOMER_PROFILE_READ}><CustomerProfile /></CustomerAuthRoute>} />
        <Route path="/payment" element={<CustomerAuthRoute permission={PERMISSIONS.CUSTOMER_BOOKING_CREATE}><PaymentPage /></CustomerAuthRoute>} />
        <Route path="/booking-success" element={<CustomerAuthRoute permission={PERMISSIONS.CUSTOMER_BOOKINGS_READ}><BookingSuccess /></CustomerAuthRoute>} />

        {/* Admin dashboard */}
        <Route path="/admin/login" element={<AdminApp />} />
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Unknown paths return to the customer home page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </RouterRoutes>
    </Router>
  );
}
