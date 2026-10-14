import React from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, AlertCircle } from 'lucide-react';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;
  const seatNumbers = booking?.tickets?.map((ticket) => ticket.seatNumber) || [];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <CustomerNavbar />
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
        {booking ? <>
          <div style={{ backgroundColor: '#16a34a', color: 'white', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Check size={36} strokeWidth={3} /></div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Booking Successful!</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', marginBottom: '28px' }}>Your booking has been saved.</p>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'left', marginBottom: '28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Booking reference</span><strong>{booking.bookingReference}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Route</span><strong>{booking.from} → {booking.to}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Date</span><strong>{booking.date}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Departure</span><strong>{booking.departure}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Seats</span><strong>{seatNumbers.join(', ')}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Status</span><strong>{booking.status}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}><span>Total paid</span><strong>Rs. {booking.totalAmount}</strong></div>
            </div>
          </div>
        </> : <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '28px' }}>
          <div style={{ backgroundColor: '#fef3c7', color: '#d97706', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><AlertCircle size={32} /></div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>No Active Booking Found</h3>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Open this page after completing a booking to view its details.</p>
        </div>}
        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => navigate('/my-bookings')} style={{ flex: 1, backgroundColor: '#0066ff', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>View My Bookings</button>
          <button onClick={() => navigate('/')} style={{ flex: 1, backgroundColor: 'white', color: '#0f172a', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
