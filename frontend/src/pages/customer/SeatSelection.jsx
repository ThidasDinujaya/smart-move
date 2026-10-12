import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomerNavbar from '../../components/CustomerNavbar';
import { api } from '../../api/client.js';

const SeatSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // location.state athava default dynamic object mathi data melvu
  const passedData = location.state || {};
  const bus = passedData.bus || {};
  const queryParams = passedData.queryParams || {};

  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBusSeats = async () => {
      try {
        if (!bus.id) {
          navigate('/search', { replace: true });
          return;
        }
        const availability = await api.get(`/api/trips/${bus.id}/seats`);
        const reserved = new Set(availability.reservedSeats || []);
        setSeats(Array.from({ length: availability.capacity || 0 }, (_value, index) => {
          const seatNo = index + 1;
          return { id: seatNo, status: reserved.has(seatNo) ? 'booked' : 'available' };
        }));
      } catch (requestError) {
        setError(requestError.message || 'Unable to load seat availability.');
      } finally {
        setLoading(false);
      }
    };

    fetchBusSeats();
  }, [bus.id, queryParams.date, navigate]);

  const handleSeatClick = (id) => {
    const target = seats.find((s) => s.id === id);
    if (!target || target.status === 'booked') return;

    setSeats(
      seats.map((s) => {
        if (s.id === id) {
          return { ...s, status: s.status === 'selected' ? 'available' : 'selected' };
        }
        if (s.status === 'selected') {
          return { ...s, status: 'available' };
        }
        return s;
      })
    );

    setSelectedSeat(target.status === 'selected' ? null : id);
  };

  const handleProceedToPayment = () => {
    if (!selectedSeat) {
      alert('Please select a seat before proceeding');
      return;
    }
    navigate('/payment', {
      state: {
        trip: bus,
        tripId: bus.id,
        from: bus.from || queryParams.from,
        to: bus.to || queryParams.to,
        date: bus.date || queryParams.date,
        seatNumbers: [selectedSeat],
      }
    });
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <CustomerNavbar />
      <main style={{ maxWidth: '1000px', margin: '32px auto', padding: '0 20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>Select Your Seats</h1>

        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '14px', height: '14px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}></span> Available</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '14px', height: '14px', backgroundColor: '#0066ff', borderRadius: '4px' }}></span> Selected</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '14px', height: '14px', backgroundColor: '#fca5a5', borderRadius: '4px' }}></span> Booked</div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading seat layout...</div>
        ) : error ? (
          <div role="alert" style={{ textAlign: 'center', padding: '40px', color: '#b91c1c' }}>{error}</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ border: '2px dashed #cbd5e1', padding: '24px', borderRadius: '16px', display: 'flex', gap: '32px', alignItems: 'center', width: '100%', maxWidth: '400px' }}>
                <div style={{ backgroundColor: '#f1f5f9', width: '70px', height: '160px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#64748b' }}>
                  Driver
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  {seats.map((seat) => {
                    let bg = '#f1f5f9';
                    let color = '#334155';
                    if (seat.status === 'booked') { bg = '#fca5a5'; color = 'white'; }
                    if (seat.status === 'selected') { bg = '#0066ff'; color = 'white'; }

                    return (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat.id)}
                        style={{
                          width: '46px',
                          height: '46px',
                          backgroundColor: bg,
                          color: color,
                          border: 'none',
                          borderRadius: '10px',
                          fontWeight: '700',
                          fontSize: '14px',
                          cursor: seat.status === 'booked' ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {seat.id}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>Booking Summary</h3>
              <div style={{ fontSize: '14px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Route</span> <strong style={{ color: '#0f172a' }}>{bus.from || queryParams.from} → {bus.to || queryParams.to}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Date</span> <strong style={{ color: '#0f172a' }}>{bus.date || queryParams.date}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Time</span> <strong style={{ color: '#0f172a' }}>{bus.departure}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Vehicle</span> <strong style={{ color: '#0f172a' }}>{bus.vehicle}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Selected Seat</span> <strong style={{ color: '#0066ff' }}>{selectedSeat ? `#${selectedSeat}` : 'None'}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '14px', fontSize: '16px' }}><span>Price</span> <strong style={{ color: '#0f172a' }}>Rs. {bus.fare}</strong></div>
              </div>

              <button
                onClick={handleProceedToPayment}
                style={{
                  width: '100%',
                  backgroundColor: '#0066ff',
                  color: 'white',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SeatSelection;
