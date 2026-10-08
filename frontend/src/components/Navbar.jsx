import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      backgroundColor: '#1e293b',
      color: 'white'
    }}>
      <h2 style={{ margin: 0, color: '#38bdf8' }}>SmartMove Transport</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Ticket Booking</Link>
        <Link to="/reviews" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Passenger Reviews (MongoDB)</Link>
        <Link to="/vehicles" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Vehicles & Fleet</Link>
      </div>
    </nav>
  );
};

export default Navbar;