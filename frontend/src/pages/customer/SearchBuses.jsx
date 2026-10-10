import React, { useState } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBuses = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({ from: '', to: '', date: '' });
  const locations = ['Colombo', 'Kandy', 'Galle', 'Matara', 'Jaffna', 'Negombo'];

  const handleSearch = (event) => {
    event.preventDefault();
    navigate('/search-results', { state: searchParams });
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <CustomerNavbar />
      <div style={{
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.45)), url("https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '380px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 60px',
        color: 'white',
        position: 'relative'
      }}>
        <h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: '1.2' }}>
          Travel Smarter<br />with SmartMove
        </h1>
        <p style={{ fontSize: '18px', marginTop: '12px', fontWeight: '500', opacity: 0.9 }}>
          Safe • Comfortable • Reliable
        </p>

        <form onSubmit={handleSearch} style={{
          position: 'absolute',
          bottom: '-40px',
          left: '60px',
          right: '60px',
          backgroundColor: 'white',
          padding: '20px 24px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr auto',
          gap: '16px',
          alignItems: 'end'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>From</label>
            <select
              value={searchParams.from}
              onChange={(event) => setSearchParams({ ...searchParams, from: event.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
              required
            >
              <option value="">Select starting point</option>
              {locations.map((location) => <option key={`from-${location}`} value={location}>{location}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>To</label>
            <select
              value={searchParams.to}
              onChange={(event) => setSearchParams({ ...searchParams, to: event.target.value })}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
              required
            >
              <option value="">Select destination</option>
              {locations.map((location) => <option key={`to-${location}`} value={location}>{location}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Date</label>
            <input
              type="date"
              value={searchParams.date}
              onChange={(event) => setSearchParams({ ...searchParams, date: event.target.value })}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
              required
            />
          </div>
          <button type="submit" style={{
            backgroundColor: '#0066ff',
            color: 'white',
            border: 'none',
            padding: '12px 28px',
            borderRadius: '8px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Search size={18} />
            Search Buses
          </button>
        </form>
      </div>
      <div style={{ height: '90px' }} />
    </div>
  );
};

export default SearchBuses;
