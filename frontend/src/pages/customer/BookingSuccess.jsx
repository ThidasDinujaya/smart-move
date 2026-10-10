import React from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, AlertCircle } from 'lucide-react';

const BookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Dynamically extract state passed through React Router navigation
  const details = location.state;

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <CustomerNavbar />

      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
        {details ? (
          <>
            <div style={{ backgroundColor: '#16a34a', color: 'white', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <Check size={36} strokeWidth={3} />
            </div>
            
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>Booking Successful!</h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', marginBottom: '28px' }}>Your seat has been successfully booked.</p>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'left', marginBottom: '28px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Booking ID</span><strong>: {details.bookingId || 'N/A'}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Route</span><strong>: {details.route || 'N/A'}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Date</span><strong>: {details.date || 'N/A'}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Time</span><strong>: {details.time || 'N/A'}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Seat</span><strong>: {details.seat || 'N/A'}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Price</span><strong>: {details.price || 'N/A'}</strong></div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '28px' }}>
            <div style={{ backgroundColor: '#fef3c7', color: '#d97706', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <AlertCircle size={32} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>No Active Booking Found</h3>
            <p style={{ fontSize: '13px', color: '#64748b' }}>It looks like you navigated here directly or your session expired.</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={() => navigate('/my-bookings')}
            style={{ flex: 1, backgroundColor: '#0066ff', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
            View My Bookings
          </button>
          <button 
            onClick={() => navigate('/')}
            style={{ flex: 1, backgroundColor: 'white', color: '#0f172a', border: '1px solid #cbd5e1', padding: '12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;