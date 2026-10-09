import React, { useState } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { User, Ticket, KeyRound, LogOut } from 'lucide-react';

const CustomerProfile = () => {
  const [profile, setProfile] = useState({
    fullName: 'Dinuni Perera',
    email: 'dinuni@example.com',
    phone: '077 123 4567',
    nic: '200012345678'
  });

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
            <button style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: 'none', backgroundColor: '#e0f2fe', color: '#0284c7', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
              <User size={16} /> Profile
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: 'none', backgroundColor: 'transparent', color: '#64748b', fontWeight: '600', cursor: 'pointer' }}>
              <Ticket size={16} /> My Bookings
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: 'none', backgroundColor: 'transparent', color: '#64748b', fontWeight: '600', cursor: 'pointer' }}>
              <KeyRound size={16} /> Change Password
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: 'none', backgroundColor: 'transparent', color: '#ef4444', fontWeight: '600', cursor: 'pointer' }}>
              <LogOut size={16} /> Logout
            </button>
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
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Email</label>
                <input 
                  type="email" 
                  value={profile.email} 
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Phone</label>
                <input 
                  type="text" 
                  value={profile.phone} 
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>NIC</label>
                <input 
                  type="text" 
                  value={profile.nic} 
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