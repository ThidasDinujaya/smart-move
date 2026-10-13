
import Icon from "./Icon.jsx";
import { Route, LogOut } from "lucide-react";
import { hasPermission, PERMISSIONS, ROLES } from "../utils/roleAccess.js";

const navigationItems = [
  {
    label: "Overview",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "chart",
        permission: PERMISSIONS.ADMIN_DASHBOARD_READ,
      },
    ],
  },
  {
    label: "Fleet Management",
    items: [
      {
        id: "vehicles",
        label: "Vehicles",
        icon: "bus",
        permission: PERMISSIONS.FLEET_VEHICLES_MANAGE,
      },
      {
        id: "drivers",
        label: "Drivers",
        icon: "users",
        permission: PERMISSIONS.FLEET_DRIVERS_MANAGE,
      },
      {
        id: "routes",
        label: "Routes",
        icon: "route",
        permission: PERMISSIONS.FLEET_ROUTES_MANAGE,
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        id: "passengers",
        label: "Passengers",
        icon: "users",
        permission: PERMISSIONS.OPERATIONS_PASSENGERS_READ,
      },
      {
        id: "trips",
        label: "Trips",
        icon: "bus",
        permission: PERMISSIONS.OPERATIONS_TRIPS_MANAGE,
      },
      {
        id: "bookings",
        label: "Bookings",
        icon: "ticket",
        permission: PERMISSIONS.OPERATIONS_BOOKINGS_MANAGE,
      },
      {
        id: "payments",
        label: "Payments",
        icon: "card",
        permission: PERMISSIONS.FINANCE_PAYMENTS_MANAGE,
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        id: "maintenance",
        label: "Maintenance",
        icon: "wrench",
        permission: PERMISSIONS.FLEET_MAINTENANCE_MANAGE,
      },
      {
        id: "content",
        label: "Announcements & media",
        icon: "message",
        permission: PERMISSIONS.CONTENT_MANAGE,
      },
      {
        id: "feedback",
        label: "Feedback",
        icon: "message",
        permission: PERMISSIONS.SUPPORT_FEEDBACK_MANAGE,
      },
      {
        id: "reports",
        label: "Reports",
        icon: "chart",
        permission: PERMISSIONS.REPORTS_READ,
      },
    ],
  },
];

export default function AppLayout({
  activePage,
  onNavigate,
  onLogout,
  user,
  children,
}) {
  const visibleGroups = navigationItems
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasPermission(user, item.permission)),
    }))
    .filter((group) => group.items.length > 0);
  const isAdmin = user?.roles?.includes(ROLES.ADMIN);
  const displayName = user?.fullName || user?.username || "Staff";
  const roleLabel = isAdmin ? "Administrator" : user?.roles?.[0] || "Staff";

  return (
    <div className="app-shell">

      {/* =========================
          SIDEBAR
      ========================= */}
      <aside className="sidebar">

        {/* BRAND LOGO */}
        <div className="brand">
          <span className="brand-icon">
            <Icon name="bus" size={26} />
          </span>

          <span>
            <strong>SmartMove</strong>
            <small>Transport Solutions</small>
          </span>
        </div>

        {/* NAVIGATION */}
        <nav aria-label="Main navigation">
          {visibleGroups.map((group) => (
            <div key={group.label}>

              <p>{group.label}</p>

              {group.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={item.label}
                  aria-current={
                    activePage === item.id
                      ? "page"
                      : undefined
                  }
                  className={
                    "nav-link " +
                    (activePage === item.id ? "active" : "")
                  }
                  onClick={() => onNavigate(item.id)}
                >
                  {/* ROUTES ICON */}
                  {item.id === "routes" ? (
                    <Route size={17} />
                  ) : (
                    <Icon name={item.icon} size={17} />
                  )}

                  <span>{item.label}</span>
                </button>
              ))}

            </div>
          ))}
        </nav>

        {/* SIDEBAR LOGOUT */}
        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-logout"
            aria-label="Logout"
            onClick={onLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* =========================
          MAIN WORKSPACE
      ========================= */}
      <div className="workspace">

        {/* TOP NAVIGATION */}
        <header className="topbar">

          <div className="mobile-brand">
            <Icon name="bus" size={22} />
            <b>SmartMove</b>
          </div>

          <div className="topbar-right">
            <div className="admin-profile">
              <div className="admin-avatar">
                {displayName.charAt(0).toUpperCase()}
              </div>

              <div className="admin-info">
                <strong>{displayName}</strong>
                <small>{roleLabel}</small>
              </div>
            </div>
          </div>

        </header>

        {/* PAGE CONTENT */}
        <main className="admin-content">{children}</main>

      </div>

    </div>
  );
}
