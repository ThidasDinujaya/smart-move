
import { useState } from 'react';
import { Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react';

export default function Vehicles({
  vehicles = [],
  onAdd,
  onView,
  onEdit,
  onDelete,
}) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const vehicleTypes = [...new Set(vehicles.map((vehicle) => vehicle.type).filter(Boolean))];
  const vehicleStatuses = [...new Set(vehicles.map((vehicle) => vehicle.status).filter(Boolean))];

  const filteredVehicles = vehicles.filter((vehicle) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch = [
      vehicle.vehicleNo,
      vehicle.brand,
      vehicle.type,
      vehicle.model,
    ].some((value) => String(value || '').toLowerCase().includes(searchText));

    const matchesType = typeFilter === 'All' || vehicle.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || vehicle.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusClass = (status) =>
    String(status || '').toLowerCase().replace(/\s+/g, '-');

  async function handleDelete(vehicle) {
    if (!window.confirm(`Are you sure you want to delete ${vehicle.vehicleNo}?`)) {
      return;
    }

    try {
      await onDelete?.(vehicle);
    } catch (error) {
      console.error('Delete vehicle error:', error);
      window.alert('Unable to delete vehicle.');
    }
  }

  return (
    <div className="management-page">
      <div className="management-header">
        <div>
          <h1>Vehicle Management</h1>
          <p>Manage your buses, vans, and other vehicles</p>
        </div>

        <button type="button" className="add-button" onClick={onAdd}>
          <Plus size={18} />
          Add Vehicle
        </button>
      </div>

      <div className="management-card">
        <div className="management-filters">
          <div className="management-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="All">All Types</option>
            {vehicleTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="All">All Status</option>
            {vehicleStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

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
                      <span className={`vehicle-status ${getStatusClass(vehicle.status)}`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td>{vehicle.lastService || 'Not specified'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="action-btn view-btn"
                          title="View Vehicle"
                          aria-label={`View ${vehicle.vehicleNo}`}
                          onClick={() => onView?.(vehicle)}
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          className="action-btn edit-btn"
                          title="Edit Vehicle"
                          aria-label={`Edit ${vehicle.vehicleNo}`}
                          onClick={() => onEdit?.(vehicle)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="action-btn delete-btn"
                          title="Delete Vehicle"
                          aria-label={`Delete ${vehicle.vehicleNo}`}
                          onClick={() => handleDelete(vehicle)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '30px' }}>
                    No vehicles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <p>Showing {filteredVehicles.length} of {vehicles.length} vehicles</p>
        </div>
      </div>
    </div>
  );
}
