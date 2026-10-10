
import { useState } from "react";

import AppLayout from "./components/AppLayout.jsx";
import Login from "./pages/Login.jsx";

// Dashboard
import Dashboard from "./pages/admin/Dashboard.jsx";

// Vehicle Management
import Vehicles from "./pages/admin/Vehicles.jsx";
import AddVehicle from "./pages/admin/AddVehicle.jsx";
import ViewVehicle from "./pages/admin/ViewVehicle.jsx";
import EditVehicle from "./pages/admin/EditVehicle.jsx";

// Driver Management
import Drivers from "./pages/admin/Drivers.jsx";
import AddDriver from "./pages/admin/AddDriver.jsx";
import ViewDriver from "./pages/admin/ViewDriver.jsx";
import EditDriver from "./pages/admin/EditDriver.jsx";

// Route Management
import Routes from "./pages/admin/Routes.jsx";
import AddRoute from "./pages/admin/AddRoute.jsx";
import ViewRoute from "./pages/admin/ViewRoute.jsx";
import EditRoute from "./pages/admin/EditRoute.jsx";

// Operations
import PassengersPage from "./pages/admin/PassengersPage.jsx";
import TripsPage from "./pages/admin/TripsPage.jsx";
import BookingsPage from "./pages/admin/BookingsPage.jsx";
import PaymentsPage from "./pages/admin/PaymentsPage.jsx";
import PaymentReceiptPage from "./pages/admin/PaymentReceiptPage.jsx";

// Management
import MaintenanceManagement from "./pages/admin/MaintenanceManagement.jsx";
import AddMaintenance from "./pages/admin/AddMaintenance.jsx";
import FeedbackReviews from "./pages/admin/FeedbackReviews.jsx";
import ReportsDashboard from "./pages/admin/ReportsDashboard.jsx";

// Data Hook
import useSmartMoveData from "./hooks/useSmartMoveData.js";

function App() {
  // ==========================================
  // LOGIN STATE
  // ==========================================

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return (
      sessionStorage.getItem("smartmove_admin_demo") === "true" ||
      localStorage.getItem("smartmove_admin_demo") === "true"
    );
  });

  const [page, setPage] = useState("dashboard");
  const [selectedRecord, setSelectedRecord] = useState(null);

  // ==========================================
  // SMARTMOVE DATA
  // ==========================================

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

  // ==========================================
  // LOGIN / LOGOUT
  // ==========================================

  function handleLogin({ rememberMe = false } = {}) {
    sessionStorage.removeItem("smartmove_admin_demo");
    localStorage.removeItem("smartmove_admin_demo");

    if (rememberMe) {
      localStorage.setItem("smartmove_admin_demo", "true");
    } else {
      sessionStorage.setItem("smartmove_admin_demo", "true");
    }

    setIsAuthenticated(true);
    setSelectedRecord(null);
    setPage("dashboard");
  }

  function handleLogout() {
    sessionStorage.removeItem("smartmove_admin_demo");
    localStorage.removeItem("smartmove_admin_demo");

    setIsAuthenticated(false);
    setSelectedRecord(null);
    setPage("dashboard");
  }

  // ==========================================
  // NAVIGATION
  // ==========================================

  function navigate(nextPage) {
    setSelectedRecord(null);
    setPage(nextPage);
  }

  function openRecord(nextPage, record) {
    setSelectedRecord(record);
    setPage(nextPage);
  }

  // ==========================================
  // VEHICLE CRUD
  // ==========================================

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

  // ==========================================
  // DRIVER CRUD
  // ==========================================

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

  // ==========================================
  // ROUTE CRUD
  // ==========================================

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

  // ==========================================
  // TEAMMATE DATA FUNCTIONS
  // ==========================================

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

  // ==========================================
  // PAGE RENDERING
  // ==========================================

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

      // ======================================
      // VEHICLES
      // ======================================

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

      // ======================================
      // DRIVERS
      // ======================================

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

      // ======================================
      // ROUTES
      // ======================================

      case "routes":
        return (
          <Routes
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

      // ======================================
      // PASSENGERS
      // ======================================

      case "passengers":
        return (
          <PassengersPage
            passengers={passengers}
            onSaveRecord={handleSaveRecord}
            onDeleteRecord={handleDeleteRecord}
            data={data}
          />
        );

      // ======================================
      // TRIPS
      // ======================================

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

      // ======================================
      // BOOKINGS
      // ======================================

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

      // ======================================
      // PAYMENTS
      // ======================================

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

      // ======================================
      // MAINTENANCE
      // ======================================

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

      // ======================================
      // FEEDBACK
      // ======================================

      case "feedback":
        return (
          <FeedbackReviews
            feedback={feedback}
            data={data}
          />
        );

      // ======================================
      // REPORTS
      // ======================================

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

  // ==========================================
  // LOGIN PAGE
  // ==========================================

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // ==========================================
  // SIDEBAR ACTIVE PAGE
  // ==========================================

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

  // ==========================================
  // ADMIN LAYOUT
  // ==========================================

  return (
    <AppLayout
      activePage={sidebarPage}
      onNavigate={navigate}
      onLogout={handleLogout}
    >
      {renderPage()}
    </AppLayout>
  );
}

export default App;
