
import { useState } from 'react';
import { Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react';

function Routes({
  routes = [],
  onAdd,
  onView,
  onEdit,
  onDelete,
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const routeRecords = routes.filter(
    (route) => route && typeof route === 'object'
  );

  const filteredRoutes = routeRecords.filter((route) => {
    const query = search.trim().toLowerCase();

    const matchesSearch = [
      route.routeName,
      route.routeNo,
      route.startLocation,
      route.endLocation,
    ].some((value) =>
      String(value || '').toLowerCase().includes(query)
    );

    const matchesStatus =
      statusFilter === 'All' || route.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (route) => {
    if (!window.confirm(
      `Are you sure you want to delete ${route.routeName}?`
    )) return;

    try {
      const result = await onDelete(route);

      if (result !== false) {
        window.alert('Route deleted successfully!');
      }
    } catch (error) {
      window.alert(error.message || 'Unable to delete route.');
    }
  };

  return (
    <div className="management-page routes-page">
      <div className="management-header">
        <div>
          <h1>Route Management</h1>
          <p>Manage transport routes and destinations</p>
        </div>

        <button
          type="button"
          className="add-button"
          onClick={onAdd}
        >
          <Plus size={18} />
          Add Route
        </button>
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
                <th>Route No</th>
                <th>Route Name</th>
                <th>Start Location</th>
                <th>End Location</th>
                <th>Distance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map((route, index) => (
                  <tr key={route.id}>
                    <td>{index + 1}</td>
                    <td>{route.routeNo}</td>
                    <td>{route.routeName}</td>
                    <td>{route.startLocation}</td>
                    <td>{route.endLocation}</td>
                    <td>{route.distance || '-'} km</td>
                    <td>
                      <span className={`route-status ${
                        String(route.status || '')
                          .toLowerCase()
                      }`}>
                        {route.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="action-btn view-btn"
                          title="View Route"
                          onClick={() => onView(route)}
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          className="action-btn edit-btn"
                          title="Edit Route"
                          onClick={() => onEdit(route)}
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
                  <td colSpan={8} className="routes-empty">
                    No routes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <p>
            Showing {filteredRoutes.length} of{' '}
            {routeRecords.length} routes
          </p>
        </div>
      </div>
    </div>
  );
}

export default Routes;
