import React, { useState } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, SlidersHorizontal } from 'lucide-react';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = location.state || { from: 'Colombo', to: 'Kandy', date: '2026-10-20' };

  const [filterAC, setFilterAC] = useState(true);
  const [filterNonAC, setFilterNonAC] = useState(true);

  const [buses] = useState([
    { id: 1, name: 'SmartMove Express', type: 'AC', category: 'Luxury', departure: '07:00 AM', arrival: '10:00 AM', duration: '3h 0m', seatsAvailable: 42, price: 1200, image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=500&q=80' },
    { id: 2, name: 'City Travels', type: 'Non-AC', category: 'Standard', departure: '08:30 AM', arrival: '11:45 AM', duration: '3h 15m', seatsAvailable: 30, price: 900, image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=500&q=80' }
  ]);

  const filteredBuses = buses.filter((bus) => {
    if (bus.type === 'AC' && !filterAC) return false;
    if (bus.type === 'Non-AC' && !filterNonAC) return false;
    return true;
  });

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <CustomerNavbar />
      <div style={{ maxWidth: '1000px', margin: '32px auto', padding: '0 20px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px 24px', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>Available Buses</h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{queryParams.from || 'Colombo'} → {queryParams.to || 'Kandy'} | {queryParams.date || '2026-10-20'}</p>
          </div>
          <span style={{ fontSize: '13px', fontWeight: '700', backgroundColor: '#e0f2fe', color: '#0284c7', padding: '6px 14px', borderRadius: '20px' }}>
            {filteredBuses.length} buses found
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={16} /> Filters
            </h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', marginBottom: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={filterAC} onChange={(e) => setFilterAC(e.target.checked)} /> AC
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
              <input type="checkbox" checked={filterNonAC} onChange={(e) => setFilterNonAC(e.target.checked)} /> Non-AC
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredBuses.map((bus) => (
              <div key={bus.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <img src={bus.image} alt={bus.name} style={{ width: '110px', height: '75px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{bus.name}</h3>
                      <span style={{ fontSize: '11px', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', fontWeight: '600' }}>{bus.type}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} /> {bus.departure} → {bus.arrival} ({bus.duration})
                    </p>
                    <p style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600', marginTop: '4px' }}>{bus.seatsAvailable} seats available</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Rs. {bus.price}</div>
                  <button 
                    onClick={() => navigate('/seat-selection', { state: { bus, queryParams } })} 
                    style={{ marginTop: '8px', backgroundColor: '#0066ff', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Select Seats
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;