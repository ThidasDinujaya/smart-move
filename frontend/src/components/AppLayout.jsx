import Icon from './Icon.jsx';

const navigationItems = [
  {
    label: 'Operations',
    items: [
      { id: 'passengers', label: 'Passengers', icon: 'users' },
      { id: 'trips', label: 'Trips', icon: 'bus' },
      { id: 'bookings', label: 'Bookings', icon: 'ticket' },
      { id: 'payments', label: 'Payments', icon: 'card' },
    ],
  },
  {
    label: 'Management',
    items: [
      { id: 'maintenance', label: 'Maintenance', icon: 'wrench' },
      { id: 'feedback', label: 'Feedback', icon: 'message' },
      { id: 'reports', label: 'Reports', icon: 'chart' },
    ],
  },
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
          {navigationItems.map((group) => (
            <div key={group.label}>
              <p>{group.label}</p>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={item.label}
                  aria-current={activePage === item.id ? 'page' : undefined}
                  className={'nav-link ' + (activePage === item.id ? 'active' : '')}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon name={item.icon} size={17} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="mobile-brand">
            <Icon name="bus" size={22} />
            <b>SmartMove</b>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
