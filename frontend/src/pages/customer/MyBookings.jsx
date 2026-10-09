import React, { useState } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';

const MyBookings = () => {
  const [filter, setFilter] = useState('All');
  const [bookings] = useState([
    { id: 1, route: 'Colombo ➔ Kandy', date: '2024-10-20 | 07:00 AM', seat: '10', status: 'Upcoming', price: 'Rs. 1,200', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=200' },
    { id: 2, route: 'Colombo ➔ Galle', date: '2024-09-15 | 08:30 AM', seat: '5', status: 'Completed', price: 'Rs. 1,000', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=200' },
    { id: 3, route: 'Colombo ➔ Matara', date: '2024-08-10 | 06:00 AM', seat: '12', status: 'Cancelled', price: 'Rs. 900', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=200' },
  ]);

  const filteredBookings = filter === 'All' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <CustomerNavbar />
      
      <div style={{ maxWidth: '900px', margin: '32px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px' }}>My Bookings</h2>

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
                <img src={b.img} alt="bus" style={{ width: '100px', height: '65px', borderRadius: '8px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{b.route}</div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{b.date}</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>Seat : {b.seat}</div>
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
                  {b.status}
                </span>
                <span style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>{b.price}</span>
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
      </div>
    </div>
  );
};

export default MyBookings;