import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menu = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'Vehicles', path: '/vehicles', icon: '🚌' },
    { name: 'Drivers', path: '/drivers', icon: '👤' },
    { name: 'Passengers', path: '/passengers', icon: '👥' },
    { name: 'Routes', path: '/routes', icon: '🗺️' },
    { name: 'Trips', path: '/trips', icon: '🎫' },
    { name: 'Bookings', path: '/bookings', icon: '📋' },
    { name: 'Payments', path: '/payments', icon: '💳' },
    { name: 'Maintenance', path: '/maintenance', icon: '🔧' },
    { name: 'Feedback', path: '/feedback', icon: '🔍' },
    { name: 'Reports', path: '/reports', icon: '📑' },
  ];

  return (
    <div className="sidebar">
      <div className="brand">
        <span className="brand-icon">🚌</span>
        <div>
          <div className="brand-title">SmartMove</div>
          <div className="brand-subtitle">Transport Solutions</div>
        </div>
      </div>
      <ul className="menu-list">
        {menu.map((item) => (
          <li key={item.name} className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}>
            <Link to={item.path}>
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;