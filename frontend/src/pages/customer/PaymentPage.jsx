import React, { useState } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Landmark, Wallet, Banknote } from 'lucide-react';
import { api } from '../../api/client.js';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { trip, tripId, from, to, date, seatNumbers = [] } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [pendingBooking, setPendingBooking] = useState(null);

  const paymentOptions = [
    { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={18} color="#0066ff" /> },
    { id: 'bank', label: 'Bank Transfer', icon: <Landmark size={18} color="#0066ff" /> },
    { id: 'ewallet', label: 'eWallet (eZ Cash / mCash)', icon: <Wallet size={18} color="#0066ff" /> },
    { id: 'cash', label: 'Cash on Service', icon: <Banknote size={18} color="#0066ff" /> },
  ];
  const total = Number(trip?.fare || 0) * seatNumbers.length;

  if (!tripId || !trip || !seatNumbers.length) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <CustomerNavbar />
        <div style={{ maxWidth: '700px', margin: '48px auto', padding: '24px', background: 'white', borderRadius: '12px' }}>
          <h2>Booking details are missing</h2>
          <p style={{ color: '#64748b' }}>Choose a scheduled trip and seats before continuing to payment.</p>
          <button onClick={() => navigate('/search')}>Search vehicles</button>
        </div>
      </div>
    );
  }

  const handlePayment = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const booking = pendingBooking || await api.post('/api/bookings', { tripId, seatNumbers });
      if (!pendingBooking) setPendingBooking(booking);
      const payment = await api.post('/api/payments/process', {
        bookingId: booking.id,
        amount: booking.totalAmount,
        paymentMethod,
      });
      const confirmedBooking = await api.get(`/api/bookings/${booking.id}`);
      navigate('/booking-success', { replace: true, state: { booking: confirmedBooking, payment } });
    } catch (requestError) {
      setError(requestError.message || 'Unable to process your booking payment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <CustomerNavbar />
      <div style={{ maxWidth: '850px', margin: '32px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>Payment</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px' }}>Booking Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Route</span><strong style={{ color: '#0f172a' }}>: {from} → {to}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Date</span><strong>: {date || trip.date}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Departure</span><strong>: {trip.departure}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Vehicle</span><strong>: {trip.vehicle}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Seat</span><strong>: {seatNumbers.join(', ')}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '8px' }}><span>Total</span><strong style={{ color: '#0f172a', fontSize: '15px' }}>: Rs. {total.toFixed(2)}</strong></div>
            </div>
          </div>

          <form onSubmit={handlePayment} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>Select Payment Method</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {paymentOptions.map((option) => (
                <label key={option.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: paymentMethod === option.id ? '2px solid #0066ff' : '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', backgroundColor: paymentMethod === option.id ? '#eff6ff' : 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="radio" name="paymentMethod" checked={paymentMethod === option.id} onChange={() => setPaymentMethod(option.id)} />
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>{option.label}</span>
                  </div>
                  {option.icon}
                </label>
              ))}
            </div>
            {error && <p role="alert" style={{ color: '#b91c1c', fontSize: '13px' }}>{error}</p>}
            <button type="submit" disabled={isSubmitting} style={{ width: '100%', backgroundColor: '#0066ff', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '700', cursor: isSubmitting ? 'wait' : 'pointer' }}>
              {isSubmitting ? 'Processing…' : `Pay Rs. ${total.toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
