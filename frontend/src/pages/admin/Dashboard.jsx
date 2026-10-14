
import { BusFront, Users, MapPin, CalendarDays } from 'lucide-react';

export default function Dashboard({
  vehicles = [],
  drivers = [],
  routes = [],
  trips = [],
  onNavigate,
}) {
  const statusLabels = [
    { label: 'Active', className: 'status-green' },
    { label: 'In Service', className: 'status-blue' },
    { label: 'Under Maintenance', className: 'status-orange' },
    { label: 'Inactive', className: 'status-red' },
  ];

  const vehicleStatuses = statusLabels.map((status) => ({
    ...status,
    count: vehicles.filter(
      (vehicle) => String(vehicle.status || '').toLowerCase() === status.label.toLowerCase()
    ).length,
  }));

  const totalVehicles = vehicles.length;
  const activeTrips = trips.filter(
    (trip) => ['active', 'ongoing', 'in progress'].includes(
      String(trip.status || '').toLowerCase()
    )
  ).length;

  const today = new Date().toLocaleDateString('en-CA');

  const upcomingTrips = trips.filter((trip) => {
    const tripDate = trip.date || trip.departureDate;
    return tripDate && String(tripDate).slice(0, 10) === today;
  });

  const summaryCards = [
    { label: 'Total Vehicles', value: totalVehicles, icon: BusFront, className: 'vehicle-card' },
    { label: 'Total Drivers', value: drivers.length, icon: Users, className: 'driver-card' },
    { label: 'Total Routes', value: routes.length, icon: MapPin, className: 'route-card' },
    { label: 'Active Trips', value: activeTrips, icon: CalendarDays, className: 'trip-card' },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-heading">
        <h1>Dashboard</h1>
        <p>Welcome to SmartMove Transport Solutions</p>
      </div>

      <div className="dashboard-cards">
        {summaryCards.map(({ label, value, icon: Icon, className }) => (
          <div className={`summary-card ${className}`} key={label}>
            <div className="summary-icon">
              <Icon size={30} />
            </div>
            <div>
              <p>{label}</p>
              <h2>{value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-bottom">
        <section className="dashboard-panel status-panel">
          <h3>Vehicles by Status</h3>

          <div className="vehicle-status-content">
            <div className="donut-chart">
              <div className="donut-middle">
                <strong>{totalVehicles}</strong>
                <span>Vehicles</span>
              </div>
            </div>

            <div className="vehicle-status-list">
              {vehicleStatuses.map((status) => (
                <div className="status-row" key={status.label}>
                  <div className="status-name">
                    <span className={`status-color ${status.className}`} />
                    {status.label}
                  </div>
                  <strong>{status.count}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="dashboard-panel trips-panel">
          <div className="dashboard-panel-header">
            <h3>Upcoming Trips (Today)</h3>
            <button type="button" onClick={() => onNavigate?.('trips')}>
              View All
            </button>
          </div>

          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Route</th>
                  <th>Vehicle</th>
                  <th>Driver</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {upcomingTrips.length === 0 ? (
                  <tr>
                    <td colSpan={5}>No trips scheduled for today.</td>
                  </tr>
                ) : (
                  upcomingTrips.map((trip, index) => (
                    <tr key={trip.id ?? index}>
                      <td>{index + 1}</td>
                      <td>{trip.route?.name || trip.routeName || trip.route || '—'}</td>
                      <td>{trip.vehicle?.registrationNumber || trip.vehicleNumber || '—'}</td>
                      <td>{trip.driver?.name || trip.driverName || '—'}</td>
                      <td>{trip.departureTime || trip.time || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
