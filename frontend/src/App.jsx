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
import RecordDialog from "./components/RecordDialog.jsx";
import AdminRecordForm from "./components/AdminRecordForm.jsx";
import AdminBookingForm from "./components/AdminBookingForm.jsx";
import TripForm from "./components/TripForm.jsx";

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
import AdminRecordDetailsPage from "./pages/admin/AdminRecordDetailsPage.jsx";
import MaintenanceManagement from "./pages/admin/MaintenanceManagement.jsx";
import AddMaintenance from "./pages/admin/AddMaintenance.jsx";
import FeedbackReviews from "./pages/admin/FeedbackReviews.jsx";
import ReportsDashboard from "./pages/admin/ReportsDashboard.jsx";
import ContentManagement from "./pages/admin/ContentManagement.jsx";

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
import { getCurrentCustomer, getCurrentStaffUser, loginStaff, logoutCustomer } from "./utils/customerAuth.js";
import { hasPermission, hasRole, PERMISSIONS, ROLES } from "./utils/roleAccess.js";

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
  const [adminUser, setAdminUser] = useState(getCurrentStaffUser);
  const isAuthenticated = Boolean(adminUser && adminUser.roles?.some((role) => (
    [ROLES.ADMIN, ROLES.OPERATIONS, ROLES.FINANCE, ROLES.SUPPORT].includes(role)
  )));

  const [page, setPage] = useState(() => adminUser?.roles?.includes(ROLES.SUPPORT) ? "feedback" : "dashboard");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dialogData, setDialogData] = useState(null);

  const data = useSmartMoveData(isAuthenticated, adminUser?.roles || []);

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

  async function handleLogin({ email, password, rememberMe = false } = {}) {
    const user = await loginStaff({ email, password }, rememberMe);
    setAdminUser(user);
    setSelectedRecord(null);
    setPage(user.roles.includes(ROLES.SUPPORT) ? "feedback" : "dashboard");
    routerNavigate("/admin", { replace: true });
  }

  async function handleLogout() {
    try {
      await logoutCustomer();
    } catch {
      // Local credentials are cleared even when the API session is unreachable.
    } finally {
      setAdminUser(null);
      setSelectedRecord(null);
      setDialogData(null);
      setPage("dashboard");
      routerNavigate("/admin/login", { replace: true });
    }
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
    if (nextPage === "passengers" || nextPage.includes("passenger")) return PERMISSIONS.OPERATIONS_PASSENGERS_READ;
    if (nextPage.includes("trip")) return PERMISSIONS.OPERATIONS_TRIPS_MANAGE;
    if (nextPage === "bookings" || nextPage.includes("booking")) return PERMISSIONS.OPERATIONS_BOOKINGS_MANAGE;
    if (nextPage === "payments" || nextPage.includes("payment")) return PERMISSIONS.FINANCE_PAYMENTS_MANAGE;
    if (nextPage === "feedback") return PERMISSIONS.SUPPORT_FEEDBACK_MANAGE;
    if (nextPage === "content") return PERMISSIONS.CONTENT_MANAGE;
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

  function showDialog(type, mode, item = {}) {
    setDialogData({ type, mode, item });
  }

  async function saveDialogRecord(value) {
    try {
      await data.saveRecord(dialogData, value);
      setDialogData(null);
    } catch (error) {
      window.alert(error.message || "Unable to save this record.");
    }
  }

  async function deleteDialogRecord(item) {
    try {
      await data.deleteRecord(dialogData.type, item);
      setDialogData(null);
    } catch (error) {
      window.alert(error.message || "Unable to remove this record.");
    }
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

  async function handleSaveTrip(value, editingTrip) {
    return data.saveTrip(value, editingTrip);
  }

  async function handleSaveMaintenance(value) {
    const result = await data.saveMaintenance(value);

    if (result !== false) {
      navigate("maintenance");
    }

    return result;
  }

  async function handleSaveAdminRecord(type, mode, value) {
    const result = await data.saveRecord({ type, mode, item: selectedRecord }, value);
    navigate(type === "passenger" ? "passengers" : type === "booking" ? "bookings" : "payments");
    return result;
  }

  async function handleRefundPayment(payment) {
    if (!window.confirm(`Refund payment ${payment.id}?`)) return false;
    try {
      await data.refundPayment(payment.id);
      return true;
    } catch (error) {
      window.alert(error.message || "Unable to refund payment.");
      return false;
    }
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
            onAdd={() => navigate("add-passenger")}
            onOpen={(type, mode, item) => mode === "edit"
              ? openRecord("edit-passenger", item)
              : mode === "view"
                ? openRecord("view-passenger", item)
                : showDialog(type, mode, item)}
          />
        );

      case "view-passenger":
        return (
          <AdminRecordDetailsPage
            type="passenger"
            record={selectedRecord}
            onBack={() => navigate("passengers")}
            onEdit={() => openRecord("edit-passenger", selectedRecord)}
          />
        );

      case "add-passenger":
      case "edit-passenger":
        return (
          <AdminRecordForm
            key={`${page}-${selectedRecord?.id ?? "new"}`}
            type="passenger"
            mode={page === "edit-passenger" ? "edit" : "add"}
            item={selectedRecord}
            onSave={(value) => handleSaveAdminRecord("passenger", page === "edit-passenger" ? "edit" : "add", value)}
            onCancel={() => navigate("passengers")}
          />
        );

      // ===
      // TRIPS
      // ===

      case "trips":
        return (
          <TripsPage
            trips={trips}
            routes={routes}
            statuses={tripOptions.statuses}
            onAdd={() => navigate("add-trip")}
            onOpen={(type, mode, item) => showDialog(type, mode, item)}
            onEdit={(trip) => openRecord("edit-trip", trip)}
          />
        );

      case "add-trip":
      case "edit-trip":
        return (
          <TripForm
            value={page === "edit-trip" ? selectedRecord : null}
            options={tripOptions}
            onCancel={() => navigate("trips")}
            onSave={async (value) => {
              try {
                await handleSaveTrip(value, page === "edit-trip" ? selectedRecord : null);
                navigate("trips");
              } catch (error) {
                window.alert(error.message || "Unable to save trip.");
              }
            }}
          />
        );

      // ===
      // BOOKINGS
      // ===

      case "bookings":
        return (
          <BookingsPage
            bookings={bookings}
            routes={routes}
            onAdd={() => navigate("add-booking")}
            onOpen={(type, mode, item) => mode === "view"
              ? openRecord("view-booking", item)
              : showDialog(type, mode, item)}
          />
        );

      case "view-booking":
        return (
          <AdminRecordDetailsPage
            type="booking"
            record={selectedRecord}
            onBack={() => navigate("bookings")}
          />
        );

      case "add-booking":
        return (
          <AdminBookingForm
            passengers={passengers}
            trips={trips}
            onSave={(value) => handleSaveAdminRecord("booking", "add", value)}
            onCancel={() => navigate("bookings")}
          />
        );

      // ===
      // PAYMENTS
      // ===

      case "payments":
        return (
          <PaymentsPage
            payments={payments}
            onAdd={() => navigate("add-payment")}
            onView={(payment) => openRecord("view-payment", payment)}
            onRefund={handleRefundPayment}
          />
        );

      case "view-payment":
      case "payment-receipt": {
        const relatedBooking = bookings.find((booking) => String(booking.id) === String(selectedRecord?.bookingId));
        return (
          <AdminRecordDetailsPage
            type="payment"
            record={selectedRecord}
            booking={relatedBooking}
            onBack={() => navigate("payments")}
            onDownload={() => import("./utils/downloadReceipt.js").then(({ default: download }) => download(selectedRecord, relatedBooking))}
          />
        );
      }

      case "add-payment":
        return (
          <AdminRecordForm
            key="add-payment"
            type="payment"
            options={{ bookings: bookings.filter((booking) => booking.status === "Pending Payment") }}
            onSave={(value) => handleSaveAdminRecord("payment", "add", value)}
            onCancel={() => navigate("payments")}
          />
        );

      // ===
      // MAINTENANCE
      // ===

      case "maintenance":
        return (
          <MaintenanceManagement
            records={maintenance}
            statuses={maintenanceOptions.statuses}
            onAdd={() => navigate("add-maintenance")}
            onView={(record) => showDialog("maintenance", "view", record)}
            onEdit={(record) => openRecord("edit-maintenance", record)}
            onDelete={(record) => showDialog("maintenance", "delete", record)}
          />
        );

      case "add-maintenance":
        return (
          <AddMaintenance
            key="add-maintenance"
            options={maintenanceOptions}
            onSave={handleSaveMaintenance}
            onCancel={() => navigate("maintenance")}
          />
        );

      case "edit-maintenance":
        return (
          <AddMaintenance
            key={`edit-maintenance-${selectedRecord?.id ?? "missing"}`}
            record={selectedRecord}
            options={maintenanceOptions}
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
            reviews={feedback}
            onStatusChange={(id, status) => data.updateFeedbackStatus(id, status).catch((error) => window.alert(error.message || "Unable to update feedback status."))}
            onResponseChange={(id, message) => data.updateFeedbackResponse(id, message)}
          />
        );

      // ===
      // REPORTS
      // ===

      case "reports":
        return (
          <ReportsDashboard
            report={data.reports}
          />
        );

      case "content":
        return <ContentManagement />;

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
        : page.includes("trip")
          ? "trips"
          : page.includes("passenger")
            ? "passengers"
          : page.includes("booking")
            ? "bookings"
          : page.includes("payment")
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
      {data.error && <p role="alert" style={{ margin: "16px 24px", padding: "12px 16px", color: "#991b1b", background: "#fef2f2", borderRadius: "8px" }}>{data.error}</p>}
      {data.loading && <p role="status" style={{ margin: "16px 24px", color: "#64748b" }}>Loading records from the database…</p>}
      {renderPage()}
      {dialogData && (
        <RecordDialog
          data={dialogData}
          passengers={passengers}
          trips={trips.filter((trip) => String(trip.status).toLowerCase() === "scheduled")}
          bookings={bookings.filter((booking) => booking.status === "Pending Payment")}
          onClose={() => setDialogData(null)}
          onSave={saveDialogRecord}
          onDelete={deleteDialogRecord}
        />
      )}
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
        <Route path="/seat-selection" element={<CustomerAuthRoute permission={PERMISSIONS.CUSTOMER_BOOKING_CREATE}><SeatSelection /></CustomerAuthRoute>} />
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
