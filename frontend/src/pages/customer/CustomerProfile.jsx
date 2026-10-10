import React, { useState } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { useNavigate } from 'react-router-dom';
import { User, Ticket, KeyRound, LogOut } from 'lucide-react';

const CustomerProfile = () => {
  const navigate = useNavigate();

  // Initialized with structured state ready for API fetch integration
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    nic: ''
  });

  // Dynamic sidebar navigation list ready for routing handlers
  const navItems = [
    { label: 'Profile', icon: <User size={16} />, path: '/profile', active: true },
    { label: 'My Bookings', icon: <Ticket size={16} />, path: '/my-bookings', active: false },
    { label: 'Change Password', icon: <KeyRound size={16} />, path: '/change-password', active: false },
    { label: 'Logout', icon: <LogOut size={16} />, path: '/logout', danger: true, active: false }
  ];

  const handleUpdate = (e) => {
    e.preventDefault();
    alert('Profile Updated Successfully!');
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <CustomerNavbar />

      <div style={{ maxWidth: '900px', margin: '32px auto', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px', padding: '0 20px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', height: 'fit-content', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navItems.map((item, index) => (
              <button 
                key={index}
                onClick={() => {
                  if (!item.danger && item.path !== '/profile') navigate(item.path);
                  if (item.path === '/logout') navigate('/');
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  padding: '10px 14px', 
                  border: 'none', 
                  backgroundColor: item.active ? '#e0f2fe' : 'transparent', 
                  color: item.danger ? '#ef4444' : item.active ? '#0284c7' : '#64748b', 
                  borderRadius: '8px', 
                  fontWeight: item.active ? '700' : '600', 
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '28px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>My Profile</h2>

          <form onSubmit={handleUpdate} style={{ display: 'flex', gap: '28px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <User size={40} color="#64748b" />
              </div>
              <button type="button" style={{ marginTop: '12px', border: '1px solid #0066ff', color: '#0066ff', backgroundColor: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                Change Photo
              </button>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Full Name</label>
                <input 
                  type="text" 
                  value={profile.fullName} 
                  placeholder="Enter full name"
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Email</label>
                <input 
                  type="email" 
                  value={profile.email} 
                  placeholder="Enter email address"
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Phone</label>
                <input 
                  type="text" 
                  value={profile.phone} 
                  placeholder="Enter phone number"
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>NIC</label>
                <input 
                  type="text" 
                  value={profile.nic} 
                  placeholder="Enter NIC number"
                  onChange={(e) => setProfile({ ...profile, nic: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} 
                />
              </div>

              <button type="submit" style={{ backgroundColor: '#0066ff', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' }}>
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;