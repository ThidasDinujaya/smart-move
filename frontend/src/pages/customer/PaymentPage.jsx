import React, { useState } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Landmark, Wallet, Banknote } from 'lucide-react';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [paymentMethod, setPaymentMethod] = useState('card');

  // Dynamically extract search/booking data passed from CustomerHome or previous step
  const passedState = location.state || {};
  
  const bookingDetails = {
    route: passedState.from && passedState.to ? `${passedState.from} ➔ ${passedState.to}` : 'Colombo ➔ Kandy',
    date: passedState.date || 'N/A',
    time: passedState.time || '07:00 AM',
    bus: passedState.bus || 'SmartMove Express',
    seat: passedState.seat || '10',
    price: passedState.price || 'Rs. 1,200',
    bookingId: passedState.bookingId || `SM${Date.now().toString().slice(-8)}`
  };

  const paymentOptions = [
    { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={18} color="#0066ff" /> },
    { id: 'bank', label: 'Bank Transfer', icon: <Landmark size={18} color="#0066ff" /> },
    { id: 'ewallet', label: 'eWallet (eZ Cash / mCash)', icon: <Wallet size={18} color="#0066ff" /> },
    { id: 'cash', label: 'Cash on Service', icon: <Banknote size={18} color="#0066ff" /> }
  ];

  const handlePayment = (e) => {
    e.preventDefault();
    // Pass completed booking state forward to success page
    navigate('/booking-success', { state: { ...bookingDetails, paymentMethod } });
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <CustomerNavbar />

      <div style={{ maxWidth: '850px', margin: '32px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>Payment</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Booking Summary */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
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

          {/* Payment Method Form */}
          <form onSubmit={handlePayment} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>Select Payment Method</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {paymentOptions.map((opt) => (
                <label 
                  key={opt.id}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '12px', 
                    border: paymentMethod === opt.id ? '2px solid #0066ff' : '1px solid #e2e8f0', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    backgroundColor: paymentMethod === opt.id ? '#eff6ff' : 'white' 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      checked={paymentMethod === opt.id} 
                      onChange={() => setPaymentMethod(opt.id)} 
                    />
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>{opt.label}</span>
                  </div>
                  {opt.icon}
                </label>
              ))}
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