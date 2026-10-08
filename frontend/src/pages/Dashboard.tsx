import {
  BusFront,
  Users,
  MapPin,
  CalendarDays,
} from "lucide-react";

type Trip = {
  id: number;
  route: string;
  vehicle: string;
  driver: string;
  time: string;
};

function Dashboard() {
  const trips: Trip[] = [
    {
      id: 1,
      route: "Colombo - Kandy",
      vehicle: "NB-1234",
      driver: "Kamal Perera",
      time: "08:00 AM",
    },
    {
      id: 2,
      route: "Colombo - Galle",
      vehicle: "WP-5678",
      driver: "Nuwan Silva",
      time: "09:30 AM",
    },
    {
      id: 3,
      route: "Kandy - Matara",
      vehicle: "CP-9012",
      driver: "Sanath Fernando",
      time: "11:00 AM",
    },
    {
      id: 4,
      route: "Colombo - Jaffna",
      vehicle: "EP-3456",
      driver: "Dilshan Jayasekara",
      time: "02:00 PM",
    },
  ];

  return (
    <div className="dashboard-page">

      {/* Heading */}
      <div className="dashboard-heading">
        <h1>Dashboard</h1>
        <p>Welcome to SmartMove Transport Solutions</p>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-cards">

        <div className="summary-card vehicle-card">
          <div className="summary-icon">
            <BusFront size={34} />
          </div>

          <div>
            <p>Total Vehicles</p>
            <h2>24</h2>
          </div>
        </div>

        <div className="summary-card driver-card">
          <div className="summary-icon">
            <Users size={34} />
          </div>

          <div>
            <p>Total Drivers</p>
            <h2>18</h2>
          </div>
        </div>

        <div className="summary-card route-card">
          <div className="summary-icon">
            <MapPin size={34} />
          </div>

          <div>
            <p>Total Routes</p>
            <h2>12</h2>
          </div>
        </div>

        <div className="summary-card trip-card">
          <div className="summary-icon">
            <CalendarDays size={34} />
          </div>

          <div>
            <p>Active Trips</p>
            <h2>28</h2>
          </div>
        </div>

      </div>

      {/* Bottom Dashboard */}
      <div className="dashboard-bottom">

        {/* Vehicle Status */}
        <section className="dashboard-panel status-panel">

          <h3>Vehicles by Status</h3>

          <div className="vehicle-status-content">

            <div className="donut-chart">
              <div className="donut-middle">
                <strong>24</strong>
                <span>Vehicles</span>
              </div>
            </div>

            <div className="vehicle-status-list">

              <div className="status-row">
                <div className="status-name">
                  <span className="status-color status-green"></span>
                  Active
                </div>

                <strong>18</strong>
              </div>

              <div className="status-row">
                <div className="status-name">
                  <span className="status-color status-blue"></span>
                  In Service
                </div>

                <strong>3</strong>
              </div>

              <div className="status-row">
                <div className="status-name">
                  <span className="status-color status-orange"></span>
                  Under Maintenance
                </div>

                <strong>2</strong>
              </div>

              <div className="status-row">
                <div className="status-name">
                  <span className="status-color status-red"></span>
                  Inactive
                </div>

                <strong>1</strong>
              </div>

            </div>

          </div>

        </section>

        {/* Upcoming Trips */}
        <section className="dashboard-panel trips-panel">

          <div className="dashboard-panel-header">
            <h3>Upcoming Trips (Today)</h3>

            <button type="button">
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

                {trips.map((trip) => (
                  <tr key={trip.id}>
                    <td>{trip.id}</td>
                    <td>{trip.route}</td>
                    <td>{trip.vehicle}</td>
                    <td>{trip.driver}</td>
                    <td>{trip.time}</td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Dashboard;