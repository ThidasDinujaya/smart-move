
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  getVehicles,
  deleteVehicle,
} from "../utils/vehicleStorage";

import type { Vehicle } from "../utils/vehicleStorage";

export type { Vehicle } from "../utils/vehicleStorage";

function Vehicles() {
  const navigate = useNavigate();

  // SEARCH AND FILTER STATES
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // LOAD VEHICLES FROM LOCAL STORAGE
  const [vehicles, setVehicles] = useState<Vehicle[]>(getVehicles);

  // SEARCH AND FILTER LOGIC
  const filteredVehicles = vehicles.filter((vehicle) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      vehicle.vehicleNo.toLowerCase().includes(searchText) ||
      vehicle.brand.toLowerCase().includes(searchText) ||
      vehicle.type.toLowerCase().includes(searchText) ||
      (vehicle.model ?? "").toLowerCase().includes(searchText);

    const matchesType =
      typeFilter === "All" || vehicle.type === typeFilter;

    const matchesStatus =
      statusFilter === "All" || vehicle.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // STATUS CSS CLASS
  const getStatusClass = (status: string) => {
    return status.toLowerCase().replaceAll(" ", "-");
  };

  // VIEW VEHICLE
  const handleView = (vehicle: Vehicle) => {
    console.log("View clicked:", vehicle.id);

    navigate(`/vehicles/view/${vehicle.id}`);
  };

  // EDIT VEHICLE
  const handleEdit = (vehicle: Vehicle) => {
    console.log("Edit clicked:", vehicle.id);

    navigate(`/vehicles/edit/${vehicle.id}`);
  };

  // DELETE VEHICLE
  const handleDelete = (id: number, vehicleNo: string) => {
    console.log("Delete clicked:", id, vehicleNo);

    const confirmed = window.confirm(
      `Are you sure you want to delete ${vehicleNo}?`
    );

    if (!confirmed) return;

    try {
      deleteVehicle(id);

      // REFRESH TABLE
      setVehicles(getVehicles());

      alert("Vehicle deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Unable to delete vehicle.");
    }
  };

  return (
    <div className="management-page">

      {/* HEADER */}
      <div className="management-header">
        <div>
          <h1>Vehicle Management</h1>
          <p>Manage your buses, vans, and other vehicles</p>
        </div>

        <Link to="/vehicles/add" className="add-button">
          <Plus size={18} />
          Add Vehicle
        </Link>
      </div>

      <div className="management-card">

        {/* SEARCH AND FILTERS */}
        <div className="management-filters">

          <div className="management-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search vehicles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Bus">Bus</option>
            <option value="Van">Van</option>
            <option value="Car">Car</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="In Service">In Service</option>
            <option value="Under Maintenance">
              Under Maintenance
            </option>
            <option value="Inactive">Inactive</option>
          </select>

        </div>

        {/* VEHICLE TABLE */}
        <div className="management-table-wrapper">

          <table className="management-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Vehicle No</th>
                <th>Type</th>
                <th>Brand</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Last Service</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle, index) => (

                  <tr key={vehicle.id}>

                    <td>{index + 1}</td>

                    <td>{vehicle.vehicleNo}</td>

                    <td>{vehicle.type}</td>

                    <td>{vehicle.brand}</td>

                    <td>{vehicle.capacity}</td>

                    <td>
                      <span
                        className={`vehicle-status ${getStatusClass(
                          vehicle.status
                        )}`}
                      >
                        {vehicle.status}
                      </span>
                    </td>

                    <td>
                      {vehicle.lastService || "Not specified"}
                    </td>

                    <td>
                      <div className="action-buttons">

                        {/* VIEW BUTTON */}
                        <button
                          type="button"
                          className="action-btn view-btn"
                          title="View Vehicle"
                          onClick={() => handleView(vehicle)}
                        >
                          <Eye size={15} />
                        </button>

                        {/* EDIT BUTTON */}
                        <button
                          type="button"
                          className="action-btn edit-btn"
                          title="Edit Vehicle"
                          onClick={() => handleEdit(vehicle)}
                        >
                          <Pencil size={15} />
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                          type="button"
                          className="action-btn delete-btn"
                          title="Delete Vehicle"
                          onClick={() =>
                            handleDelete(
                              vehicle.id,
                              vehicle.vehicleNo
                            )
                          }
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#7b8794",
                    }}
                  >
                    No vehicles found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}
        <div className="table-footer">
          <p>
            Showing {filteredVehicles.length} of{" "}
            {vehicles.length} vehicles
          </p>
        </div>

      </div>

    </div>
  );
}

export default Vehicles;
