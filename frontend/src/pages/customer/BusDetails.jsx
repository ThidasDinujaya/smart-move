import React from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { Wind, Armchair, Wifi, Zap } from 'lucide-react';

const BusDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bus, queryParams } = location.state || {
    bus: { name: 'SmartMove Express', type: 'AC', category: 'Luxury', departure: '07:00 AM', arrival: '10:00 AM', duration: '3h 0m', seatsAvailable: 42, price: 1200, image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=500&q=80' },
    queryParams: { from: 'Colombo', to: 'Kandy', date: '2026-10-20' }
  };

  const galleryImages = [
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1557223562-6c77ef1ae870?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=300&q=80'
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <CustomerNavbar />
      <div style={{ maxWidth: '900px', margin: '32px auto', padding: '0 20px' }}>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div>
            <img src={bus.image} alt={bus.name} style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {galleryImages.map((img, idx) => (
                <img key={idx} src={img} alt="interior" style={{ width: '100%', height: '64px', objectFit: 'cover', borderRadius: '8px' }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>{bus.name}</h2>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <span style={{ backgroundColor: '#e0f2fe', color: '#0284c7', padding: '2px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>{bus.type}</span>
                <span style={{ backgroundColor: '#f3e8ff', color: '#9333ea', padding: '2px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>{bus.category}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '16px 0', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'between' }}><span>Route:</span> <strong style={{ color: '#0f172a' }}>{queryParams.from} → {queryParams.to}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'between' }}><span>Departure:</span> <strong style={{ color: '#0f172a' }}>{bus.departure}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'between' }}><span>Price:</span> <strong style={{ color: '#0066ff', fontSize: '16px' }}>Rs. {bus.price}</strong></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Wind size={16} color="#0284c7" /> AC</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Armchair size={16} color="#0284c7" /> Reclining Seats</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Wifi size={16} color="#0284c7" /> WiFi</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Zap size={16} color="#0284c7" /> Charging Points</div>
              </div>
            </div>
            <button onClick={() => navigate('/booking-form', { state: { bus, queryParams } })} style={{ width: '100%', backgroundColor: '#0066ff', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', marginTop: '20px' }}>
              Select Seats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusDetails;