import Icon from './Icon.jsx';

const navigationItems = [
  { id: 'passengers', label: 'Passengers', icon: 'users' },
  { id: 'trips', label: 'Trips', icon: 'bus' },
  { id: 'bookings', label: 'Bookings', icon: 'ticket' },
  { id: 'payments', label: 'Payments', icon: 'card' },
];

export default function AppLayout({ activePage, onNavigate, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">
            <Icon name="bus" size={26} />
          </span>
          <span>
            <strong>SmartMove</strong>
            <small>Transport Solutions</small>
          </span>
        </div>

        <nav aria-label="Main navigation">
          <p>Operations</p>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              className={'nav-link ' + (activePage === item.id ? 'active' : '')}
              onClick={() => onNavigate(item.id)}
            >
              <Icon name={item.icon} size={17} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="side-user">
          <span className="user-avatar">
            <Icon name="users" size={14} />
          </span>
          <span>
            <b>Admin</b>
            <small>Administrator</small>
          </span>
          <Icon name="chevronDown" size={14} />
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="mobile-brand">
            <Icon name="bus" size={22} />
            <b>SmartMove</b>
          </div>
          <div className="top-user">
            <span className="user-avatar">
              <Icon name="users" size={14} />
            </span>
            <span>Admin</span>
            <Icon name="chevronDown" size={13} />
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
