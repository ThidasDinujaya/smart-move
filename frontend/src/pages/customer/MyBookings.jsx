import React, { useState } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { Bus } from 'lucide-react';

const MyBookings = () => {
  const [filter, setFilter] = useState('All');
  
  // Dynamic state initialized empty, ready for API/Backend fetching
  const [bookings, setBookings] = useState([]);

  const filteredBookings = filter === 'All' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <CustomerNavbar />
      
      <div style={{ maxWidth: '900px', margin: '32px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px' }}>My Bookings</h2>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          {['All', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setFilter(tab)}
              style={{ 
                backgroundColor: filter === tab ? '#0066ff' : 'white', 
                color: filter === tab ? 'white' : '#64748b', 
                border: filter === tab ? 'none' : '1px solid #e2e8f0', 
                padding: '8px 24px', 
                borderRadius: '8px', 
                fontWeight: '600',
                cursor: 'pointer'
              }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Bookings List or Empty State */}
        {filteredBookings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredBookings.map((b) => (
              <div key={b.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f1f5f9'
              }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  {b.img && <img src={b.img} alt="bus" style={{ width: '100px', height: '65px', borderRadius: '8px', objectFit: 'cover' }} />}
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{b.route || 'N/A'}</div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{b.date || 'N/A'}</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>Seat : {b.seat || 'N/A'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <span style={{
                    backgroundColor: b.status === 'Upcoming' ? '#dcfce7' : b.status === 'Completed' ? '#e2e8f0' : '#fee2e2',
                    color: b.status === 'Upcoming' ? '#16a34a' : b.status === 'Completed' ? '#475569' : '#dc2626',
                    padding: '4px 14px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '700'
                  }}>
                    {b.status || 'Unknown'}
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{b.price || 'Rs. 0'}</span>
                  <button style={{
                    border: '1px solid #0066ff',
                    backgroundColor: 'white',
                    color: '#0066ff',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State View */
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '48px 20px',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ backgroundColor: '#f1f5f9', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <Bus size={28} color="#64748b" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>No Bookings Found</h3>
            <p style={{ fontSize: '13px', color: '#64748b' }}>You don't have any {filter !== 'All' ? filter.toLowerCase() : ''} bookings at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;