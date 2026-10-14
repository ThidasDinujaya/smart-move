import React, { useEffect, useState } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { logoutCustomer, updateCurrentCustomer, fetchCurrentProfile } from '../../utils/customerAuth.js';

const CustomerProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ fullName: '', email: '', phone: '', nic: '', gender: '' });
  const [profileError, setProfileError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });

  useEffect(() => {
    let active = true;
    fetchCurrentProfile()
      .then((customer) => {
        if (active) setProfile({ fullName: customer.fullName || '', email: customer.email || '', phone: customer.phone || '', nic: customer.nic || '', gender: customer.gender || '' });
      })
      .catch((error) => { if (active) setProfileError(error.message || 'Unable to load your profile.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setProfileError('');
    const passwordChangeRequested = Boolean(
      passwordForm.currentPassword || passwordForm.newPassword,
    );
    if (passwordChangeRequested) {
      if (!passwordForm.currentPassword || !passwordForm.newPassword) {
        setProfileError('Enter your current password and a new password to change it.');
        return;
      }
      if (passwordForm.newPassword.length < 8) {
        setProfileError('Your new password must be at least 8 characters long.');
        return;
      }
    }

    setSaving(true);
    try {
      const updated = await updateCurrentCustomer({
        ...profile,
        currentPassword: passwordChangeRequested ? passwordForm.currentPassword : null,
        newPassword: passwordChangeRequested ? passwordForm.newPassword : null,
      });
      setProfile({ ...updated, nic: profile.nic, gender: profile.gender });
      setPasswordForm({ currentPassword: '', newPassword: '' });
      alert(passwordChangeRequested ? 'Profile and password updated successfully!' : 'Profile updated successfully!');
    } catch (error) {
      setProfileError(error.message || 'Unable to update your profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => logoutCustomer().catch(() => {}).finally(() => navigate('/'));

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <CustomerNavbar />

      <div style={{ maxWidth: '900px', margin: '32px auto', padding: '0 20px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '28px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>My Profile</h2>

          {loading ? <p style={{ color: '#64748b' }}>Loading your profile…</p> : <form onSubmit={handleUpdate} style={{ display: 'flex', flexWrap: 'wrap', gap: '28px' }}>
            <div style={{ flex: '0 0 120px', textAlign: 'center' }}>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <User size={40} color="#64748b" />
              </div>
              <button type="button" style={{ marginTop: '12px', border: '1px solid #0066ff', color: '#0066ff', backgroundColor: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                Change Photo
              </button>
            </div>

            <div style={{ flex: '1 1 320px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Gender</label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', fontFamily: 'inherit', fontSize: '14px', color: '#1e334d', backgroundColor: 'white' }}
                >
                  <option value="">Prefer not to say</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ display: 'grid', gap: '13px', marginTop: '4px', paddingTop: '18px', borderTop: '1px solid #e2e8f0' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#1e293b', fontSize: '15px', fontWeight: '750' }}>Password</h3>
                  <p style={{ margin: '5px 0 0', color: '#64748b', fontSize: '12px' }}>Leave these fields blank if you do not want to change your password.</p>
                </div>
                {[
                  { key: 'currentPassword', label: 'Current password', autocomplete: 'current-password' },
                  { key: 'newPassword', label: 'New password', autocomplete: 'new-password' },
                ].map((field) => (
                  <label key={field.key} style={{ display: 'grid', gap: '6px', color: '#475569', fontSize: '12px', fontWeight: '700' }}>
                    {field.label}
                    <input
                      type="password"
                      minLength={field.key === 'currentPassword' ? undefined : 8}
                      autoComplete={field.autocomplete}
                      value={passwordForm[field.key]}
                      onChange={(event) => setPasswordForm((current) => ({ ...current, [field.key]: event.target.value }))}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', font: 'inherit', fontWeight: '400' }}
                    />
                  </label>
                ))}
              </div>

              {profileError && <p role="alert" style={{ margin: 0, color: '#b91c1c', fontSize: '13px' }}>{profileError}</p>}

              <button type="submit" disabled={saving} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '42px', boxSizing: 'border-box', backgroundColor: '#0066ff', color: 'white', border: 'none', padding: '0 12px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' }}>
                {saving ? 'Saving…' : 'Update Profile'}
              </button>
              <button type="button" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', width: '100%', height: '42px', boxSizing: 'border-box', backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '0 12px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' }}>
                <LogOut size={16} />
                Logout
              </button>
              <button type="button" onClick={() => navigate('/my-bookings')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '42px', boxSizing: 'border-box', backgroundColor: '#0066ff', color: 'white', border: 'none', padding: '0 12px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' }}>
                My Bookings
              </button>
            </div>
          </form>}

        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
