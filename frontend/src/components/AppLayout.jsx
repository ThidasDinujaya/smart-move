
import Icon from "./Icon.jsx";
import { Route, LogOut } from "lucide-react";

const navigationItems = [
  {
    label: "Overview",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "chart",
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
      },
      {
        id: "drivers",
        label: "Drivers",
        icon: "users",
      },
      {
        id: "routes",
        label: "Routes",
        icon: "route",
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
      },
      {
        id: "trips",
        label: "Trips",
        icon: "bus",
      },
      {
        id: "bookings",
        label: "Bookings",
        icon: "ticket",
      },
      {
        id: "payments",
        label: "Payments",
        icon: "card",
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
      },
      {
        id: "feedback",
        label: "Feedback",
        icon: "message",
      },
      {
        id: "reports",
        label: "Reports",
        icon: "chart",
      },
    ],
  },
];

export default function AppLayout({
  activePage,
  onNavigate,
  onLogout,
  children,
}) {
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
          {navigationItems.map((group) => (
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
                A
              </div>

              <div className="admin-info">
                <strong>Admin</strong>
                <small>Administrator</small>
              </div>
            </div>
          </div>

        </header>

        {/* PAGE CONTENT */}
        <main>{children}</main>

      </div>

    </div>
  );
}
