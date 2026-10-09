import React, { useState } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { useNavigate } from 'react-router-dom';
import { CreditCard } from 'lucide-react';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [bookingDetails] = useState({
    route: 'Colombo ➔ Kandy',
    date: '2024-10-20',
    time: '07:00 AM',
    bus: 'SmartMove Express',
    seat: '10',
    price: 'Rs. 1,200'
  });

  const handlePayment = (e) => {
    e.preventDefault();
    navigate('/booking-success', { state: bookingDetails });
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <CustomerNavbar />

      <div style={{ maxWidth: '850px', margin: '32px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>Payment</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px' }}>Booking Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Route</span><strong style={{ color: '#0f172a' }}>: {bookingDetails.route}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Date</span><strong>: {bookingDetails.date}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Time</span><strong>: {bookingDetails.time}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Bus</span><strong>: {bookingDetails.bus}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Seat</span><strong>: {bookingDetails.seat}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '8px' }}>
                <span>Price</span><strong style={{ color: '#0f172a', fontSize: '15px' }}>: {bookingDetails.price}</strong>
              </div>
            </div>
          </div>

          <form onSubmit={handlePayment} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>Select Payment Method</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: paymentMethod === 'card' ? '2px solid #0066ff' : '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', backgroundColor: paymentMethod === 'card' ? '#eff6ff' : 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="radio" name="pay" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>Credit / Debit Card</span>
                </div>
                <CreditCard size={18} color="#0066ff" />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', padding: '12px', border: paymentMethod === 'bank' ? '2px solid #0066ff' : '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', backgroundColor: paymentMethod === 'bank' ? '#eff6ff' : 'white' }}>
                <input type="radio" name="pay" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} style={{ marginRight: '10px' }} />
                <span style={{ fontSize: '13px', fontWeight: '600' }}>Bank Transfer</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', padding: '12px', border: paymentMethod === 'ewallet' ? '2px solid #0066ff' : '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', backgroundColor: paymentMethod === 'ewallet' ? '#eff6ff' : 'white' }}>
                <input type="radio" name="pay" checked={paymentMethod === 'ewallet'} onChange={() => setPaymentMethod('ewallet')} style={{ marginRight: '10px' }} />
                <span style={{ fontSize: '13px', fontWeight: '600' }}>eWallet (eZ Cash / mCash)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', padding: '12px', border: paymentMethod === 'cash' ? '2px solid #0066ff' : '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', backgroundColor: paymentMethod === 'cash' ? '#eff6ff' : 'white' }}>
                <input type="radio" name="pay" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} style={{ marginRight: '10px' }} />
                <span style={{ fontSize: '13px', fontWeight: '600' }}>Cash on Service</span>
              </label>
            </div>

            <button type="submit" style={{ width: '100%', backgroundColor: '#0066ff', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
              Pay {bookingDetails.price}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;