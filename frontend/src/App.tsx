import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import AddVehicle from "./pages/AddVehicle";
import Drivers from "./pages/Drivers";
import AddDriver from "./pages/AddDriver";
import RouteManagement from "./pages/Routes";
import AddRoute from "./pages/AddRoute";
import EditVehicle from "./pages/EditVehicle";
import ViewVehicle from "./pages/ViewVehicle";


function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">

        <Sidebar />

        <div className="main-area">

          <Topbar />

          <main className="page-content">
            <Routes>
              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/vehicles"
                element={<Vehicles />}
              />

              <Route
                path="/vehicles/add"
                element={<AddVehicle />}
              />    
            
              <Route
                path="/drivers"
                element={<Drivers />}
              />

              <Route
                path="/drivers/add"
                element={<AddDriver />}
              />
            
              <Route
                path="/routes"
                element={<RouteManagement />}
              />

              <Route
                path="/routes/add"
                element={<AddRoute />}
              />

              <Route
  path="/vehicles/edit/:id"
  element={<EditVehicle />}
/>

<Route
  path="/vehicles/view/:id"
  element={<ViewVehicle />}
/>

            </Routes>
          </main>

        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;