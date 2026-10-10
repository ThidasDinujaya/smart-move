import React from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { MapPin, ShieldCheck, Bus, Ticket } from 'lucide-react';

const CustomerHome = () => {
  const features = [
    { icon: <MapPin color="#0284c7" size={22} />, title: 'Wide Coverage', subtitle: 'Across Cities' },
    { icon: <ShieldCheck color="#0284c7" size={22} />, title: 'Safe & Secure', subtitle: 'Travel' },
    { icon: <Bus color="#0284c7" size={22} />, title: 'Affordable', subtitle: 'Ticket Prices' },
    { icon: <Ticket color="#0284c7" size={22} />, title: 'Easy Online', subtitle: 'Booking' }
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <CustomerNavbar />
      
      <div style={{
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.45)), url("https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '380px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 60px',
        color: 'white',
        position: 'relative'
      }}>
        <h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: '1.2' }}>
          Travel Smarter<br />with SmartMove
        </h1>
        <p style={{ fontSize: '18px', marginTop: '12px', fontWeight: '500', opacity: 0.9 }}>
          Safe • Comfortable • Reliable
        </p>

      </div>

      <div style={{
        marginTop: '32px',
        padding: '0 60px 40px 60px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px'
      }}>
        {features.map((feature, index) => (
          <div key={index} style={{ backgroundColor: 'white', padding: '16px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ backgroundColor: '#e0f2fe', padding: '10px', borderRadius: '10px', display: 'flex' }}>{feature.icon}</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '14px' }}>{feature.title}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{feature.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerHome;
