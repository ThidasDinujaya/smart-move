
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Eye, Pencil, Trash2 } from "lucide-react";

import {
  getDrivers,
  deleteDriver,
} from "../utils/driverStorage";

import type { Driver } from "../utils/driverStorage";

function Drivers() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [drivers, setDrivers] = useState<Driver[]>(getDrivers);

  const filteredDrivers = drivers.filter((driver) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      driver.name.toLowerCase().includes(query) ||
      driver.licenseNo.toLowerCase().includes(query) ||
      driver.contact.includes(query) ||
      driver.assignedVehicle.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" || driver.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status: string) =>
    status.toLowerCase().replaceAll(" ", "-");

  const handleView = (driver: Driver) => {
    navigate(`/drivers/view/${driver.id}`);
  };

  const handleEdit = (driver: Driver) => {
    navigate(`/drivers/edit/${driver.id}`);
  };

  const handleDelete = (driver: Driver) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${driver.name}?`
    );

    if (!confirmed) return;

    try {
      deleteDriver(driver.id);
      setDrivers(getDrivers());
      alert("Driver deleted successfully!");
    } catch {
      alert("Unable to delete driver.");
    }
  };

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h1>Driver Management</h1>
          <p>Manage driver information and assignments</p>
        </div>

        <Link to="/drivers/add" className="add-button">
          <Plus size={18} />
          Add Driver
        </Link>
      </div>

      <div className="management-card">
        <div className="management-filters">
          <div className="management-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search driver..."
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
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="management-table-wrapper">
          <table className="management-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>License No</th>
                <th>Contact</th>
                <th>Assigned Vehicle</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDrivers.length > 0 ? (
                filteredDrivers.map((driver, index) => (
                  <tr key={driver.id}>
                    <td>{index + 1}</td>
                    <td>{driver.name}</td>
                    <td>{driver.licenseNo}</td>
                    <td>{driver.contact}</td>
                    <td>{driver.assignedVehicle || "Not Assigned"}</td>
                    <td>
                      <span
                        className={`driver-status ${getStatusClass(
                          driver.status
                        )}`}
                      >
                        {driver.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="action-btn view-btn"
                          title="View Driver"
                          onClick={() => handleView(driver)}
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          className="action-btn edit-btn"
                          title="Edit Driver"
                          onClick={() => handleEdit(driver)}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          className="action-btn delete-btn"
                          title="Delete Driver"
                          onClick={() => handleDelete(driver)}
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
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#7b8794",
                    }}
                  >
                    No drivers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <p>
            Showing {filteredDrivers.length} of {drivers.length} drivers
          </p>
        </div>
      </div>
    </div>
  );
}

export default Drivers;
