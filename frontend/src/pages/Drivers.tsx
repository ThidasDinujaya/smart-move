import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

type Driver = {
  id: number;
  name: string;
  licenseNo: string;
  contact: string;
  assignedVehicle: string;
  status: string;
};

function Drivers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const drivers: Driver[] = [
    {
      id: 1,
      name: "Kamal Perera",
      licenseNo: "B1234567",
      contact: "0771234567",
      assignedVehicle: "NB-1234",
      status: "Active",
    },
    {
      id: 2,
      name: "Nuwan Silva",
      licenseNo: "B7654321",
      contact: "0712345678",
      assignedVehicle: "WP-5678",
      status: "Active",
    },
    {
      id: 3,
      name: "Sanath Fernando",
      licenseNo: "B9876543",
      contact: "0779876543",
      assignedVehicle: "CP-9012",
      status: "On Leave",
    },
    {
      id: 4,
      name: "Dilshan Jayasekara",
      licenseNo: "B4567891",
      contact: "0714567890",
      assignedVehicle: "EP-3456",
      status: "Active",
    },
    {
      id: 5,
      name: "Ramesh Priyantha",
      licenseNo: "B2345678",
      contact: "0762345678",
      assignedVehicle: "NB-7788",
      status: "Inactive",
    },
  ];

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(search.toLowerCase()) ||
      driver.licenseNo.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      driver.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status: string) => {
    return status.toLowerCase().replaceAll(" ", "-");
  };

  const handleDelete = (driverName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${driverName}?`
    );

    if (confirmed) {
      alert(`${driverName} deleted successfully`);
    }
  };

  return (
    <div className="management-page">

      {/* PAGE HEADER */}
      <div className="management-header">

        <div>
          <h1>Driver Management</h1>
          <p>Manage driver information and assignments</p>
        </div>

        <Link
          to="/drivers/add"
          className="add-button"
        >
          <Plus size={18} />
          Add Driver
        </Link>

      </div>

      {/* MAIN CARD */}
      <div className="management-card">

        {/* FILTER AREA */}
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
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>

        </div>

        {/* DRIVER TABLE */}
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

              {filteredDrivers.map((driver) => (
                <tr key={driver.id}>

                  <td>{driver.id}</td>

                  <td>{driver.name}</td>

                  <td>{driver.licenseNo}</td>

                  <td>{driver.contact}</td>

                  <td>{driver.assignedVehicle}</td>

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
                        className="action-btn view-btn"
                        title="View"
                      >
                        <Eye size={15} />
                      </button>

                      <button
                        className="action-btn edit-btn"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        className="action-btn delete-btn"
                        title="Delete"
                        onClick={() =>
                          handleDelete(driver.name)
                        }
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {/* TABLE FOOTER */}
        <div className="table-footer">

          <p>Showing 1 to 5 of 18 drivers</p>

          <div className="pagination">
            <button className="page-active">1</button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Drivers;