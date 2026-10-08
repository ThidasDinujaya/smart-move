import React from 'react';

const Header = () => {
  return (
    <div className="top-header">
      <div className="search-box">
        🔍 <input type="text" placeholder="Search..." />
      </div>
      <div className="header-right">
        <div className="notification-badge">
          🔔 <span className="badge-count">3</span>
        </div>
        <div className="user-profile">
          <div className="avatar">A</div>
          <span>Admin ▾</span>
        </div>
      </div>
    </div>
  );
};

export default Header;