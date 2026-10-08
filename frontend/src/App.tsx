
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";

import Vehicles from "./pages/Vehicles";
import AddVehicle from "./pages/AddVehicle";
import ViewVehicle from "./pages/ViewVehicle";
import EditVehicle from "./pages/EditVehicle";

import Drivers from "./pages/Drivers";
import AddDriver from "./pages/AddDriver";
import ViewDriver from "./pages/ViewDriver";
import EditDriver from "./pages/EditDriver";

import RouteManagement from "./pages/Routes";
import AddRoute from "./pages/AddRoute";
import ViewRoute from "./pages/ViewRoute";
import EditRoute from "./pages/EditRoute";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />

        <div className="main-area">
          <Topbar />

          <main className="page-content">
            <Routes>
              {/* DASHBOARD */}
              <Route path="/" element={<Dashboard />} />

              {/* VEHICLES */}
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/vehicles/add" element={<AddVehicle />} />
              <Route path="/vehicles/view/:id" element={<ViewVehicle />} />
              <Route path="/vehicles/edit/:id" element={<EditVehicle />} />

              {/* DRIVERS */}
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/drivers/add" element={<AddDriver />} />
              <Route path="/drivers/view/:id" element={<ViewDriver />} />
              <Route path="/drivers/edit/:id" element={<EditDriver />} />

              {/* ROUTES */}
              <Route path="/routes" element={<RouteManagement />} />
              <Route path="/routes/add" element={<AddRoute />} />
              <Route path="/routes/view/:id" element={<ViewRoute />} />
              <Route path="/routes/edit/:id" element={<EditRoute />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
