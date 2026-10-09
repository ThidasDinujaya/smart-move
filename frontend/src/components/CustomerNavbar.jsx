import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, User } from 'lucide-react';

const CustomerNavbar = () => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 48px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Bus size={26} color="#0066ff" />
        <span style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>SmartMove</span>
      </div>

      <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#0066ff', fontWeight: '600', fontSize: '14px' }}>Home</Link>
        <Link to="/search" style={{ textDecoration: 'none', color: '#475569', fontWeight: '500', fontSize: '14px' }}>Search Buses</Link>
        <Link to="/my-bookings" style={{ textDecoration: 'none', color: '#475569', fontWeight: '500', fontSize: '14px' }}>My Bookings</Link>
        <Link to="/about" style={{ textDecoration: 'none', color: '#475569', fontWeight: '500', fontSize: '14px' }}>About</Link>
        <Link to="/contact" style={{ textDecoration: 'none', color: '#475569', fontWeight: '500', fontSize: '14px' }}>Contact</Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/profile" style={{ textDecoration: 'none', color: '#334155', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <User size={18} />
          Login
        </Link>
        <button style={{
          backgroundColor: '#0066ff',
          color: 'white',
          border: 'none',
          padding: '8px 20px',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '14px',
          cursor: 'pointer'
        }}>Register</button>
      </div>
    </nav>
  );
};

export default CustomerNavbar;