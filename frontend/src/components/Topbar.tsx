import {
  Bell,
  Search,
  UserCircle,
  ChevronDown,
} from "lucide-react";

function Topbar() {
  return (
    <header className="topbar">

      {/* Search Bar */}
      <div className="topbar-search">
        <Search size={16} />

        <input
          type="text"
          placeholder="Search..."
        />
      </div>

      {/* Right Side */}
      <div className="topbar-actions">

        {/* Notification */}
        <div className="notification-box">
          <Bell size={20} />

          <span className="notification-count">
            2
          </span>
        </div>

        {/* Admin */}
        <div className="admin-profile">

          <UserCircle
            size={30}
            className="admin-icon"
          />

          <span>Admin</span>

          <ChevronDown size={14} />

        </div>

      </div>

    </header>
  );
}

export default Topbar;