import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BusFront,
  UserRound,
  Route,
  Users,
  CalendarDays,
  Ticket,
  CreditCard,
  Wrench,
  MessageSquareText,
  FileBarChart,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-bus">
          <BusFront size={29} strokeWidth={2.2} />
        </div>

        <div className="logo-details">
          <h2>SmartMove</h2>
          <p>Transport Solutions</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-menu">

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <LayoutDashboard size={17} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/vehicles"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <BusFront size={17} />
          <span>Vehicles</span>
        </NavLink>

        <NavLink
          to="/drivers"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <UserRound size={17} />
          <span>Drivers</span>
        </NavLink>

        <NavLink
          to="/routes"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <Route size={17} />
          <span>Routes</span>
        </NavLink>

        {/* Other group member pages */}
        <div className="sidebar-link disabled-link">
          <Users size={17} />
          <span>Passengers</span>
        </div>

        <div className="sidebar-link disabled-link">
          <CalendarDays size={17} />
          <span>Trips</span>
        </div>

        <div className="sidebar-link disabled-link">
          <Ticket size={17} />
          <span>Bookings</span>
        </div>

        <div className="sidebar-link disabled-link">
          <CreditCard size={17} />
          <span>Payments</span>
        </div>

        <div className="sidebar-link disabled-link">
          <Wrench size={17} />
          <span>Maintenance</span>
        </div>

        <div className="sidebar-link disabled-link">
          <MessageSquareText size={17} />
          <span>Feedback</span>
        </div>

        <div className="sidebar-link disabled-link">
          <FileBarChart size={17} />
          <span>Reports</span>
        </div>

      </nav>

    </aside>
  );
}

export default Sidebar;