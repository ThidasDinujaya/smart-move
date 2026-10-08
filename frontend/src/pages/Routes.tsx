
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
  getRoutes,
  deleteRoute,
} from "../utils/routeStorage";

import type { TransportRoute } from "../utils/routeStorage";

function RouteManagement() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [routes, setRoutes] = useState<TransportRoute[]>(getRoutes);

  const filteredRoutes = routes.filter((route) => {
    const query = search.trim().toLowerCase();

    const matchesSearch = [
      route.routeName,
      route.startLocation,
      route.endLocation,
      route.assignedVehicle,
    ].some((value) => value.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === "All" || route.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = (route: TransportRoute) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${route.routeName}?`
      )
    ) {
      return;
    }

    try {
      deleteRoute(route.id);
      setRoutes(getRoutes());
      alert("Route deleted successfully!");
    } catch {
      alert("Unable to delete route.");
    }
  };

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h1>Route Management</h1>
          <p>Manage transport routes and assignments</p>
        </div>

        <Link to="/routes/add" className="add-button">
          <Plus size={18} />
          Add Route
        </Link>
      </div>

      <div className="management-card">
        <div className="management-filters">
          <div className="management-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search routes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="management-table-wrapper">
          <table className="management-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Route Name</th>
                <th>Start Location</th>
                <th>End Location</th>
                <th>Distance</th>
                <th>Assigned Vehicle</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map((route, index) => (
                  <tr key={route.id}>
                    <td>{index + 1}</td>
                    <td>{route.routeName}</td>
                    <td>{route.startLocation}</td>
                    <td>{route.endLocation}</td>
                    <td>{route.distance} km</td>
                    <td>
                      {route.assignedVehicle || "Not Assigned"}
                    </td>
                    <td>
                      <span
                        className={`driver-status ${route.status.toLowerCase()}`}
                      >
                        {route.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="action-btn view-btn"
                          title="View Route"
                          onClick={() =>
                            navigate(`/routes/view/${route.id}`)
                          }
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          className="action-btn edit-btn"
                          title="Edit Route"
                          onClick={() =>
                            navigate(`/routes/edit/${route.id}`)
                          }
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          className="action-btn delete-btn"
                          title="Delete Route"
                          onClick={() => handleDelete(route)}
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
                    }}
                  >
                    No routes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <p>
            Showing {filteredRoutes.length} of {routes.length} routes
          </p>
        </div>
      </div>
    </div>
  );
}

export default RouteManagement;
