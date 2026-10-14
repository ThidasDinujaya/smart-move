import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Bus, User } from 'lucide-react';
import { getCurrentCustomer, subscribeToAuthChanges } from '../utils/customerAuth.js';
import { hasRole, ROLES } from '../utils/roleAccess.js';
import { api } from '../api/client.js';

const CustomerNavbar = () => {
  const [customer, setCustomer] = useState(getCurrentCustomer);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((notification) => String(notification.status).toUpperCase() !== 'READ').length;

  useEffect(() => {
    const syncCustomer = () => setCustomer(getCurrentCustomer());
    return subscribeToAuthChanges(syncCustomer);
  }, []);

  useEffect(() => {
    if (!customer?.id) {
      setNotifications([]);
      return undefined;
    }
    let active = true;
    api.get(`/api/content/notifications/${customer.id}`)
      .then((items) => { if (active) setNotifications(Array.isArray(items) ? items : []); })
      .catch(() => { if (active) setNotifications([]); });
    return () => { active = false; };
  }, [customer?.id]);

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 48px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Bus size={26} color="#0066ff" />
        <span style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>SmartMove</span>
      </div>

      <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#0066ff', fontWeight: '600', fontSize: '14px' }}>Home</Link>
        <Link to="/search" style={{ textDecoration: 'none', color: '#475569', fontWeight: '500', fontSize: '14px' }}>Search Vehicles</Link>
        <Link to="/my-bookings" style={{ textDecoration: 'none', color: '#475569', fontWeight: '500', fontSize: '14px' }}>My Bookings</Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
        {customer ? (
          <>
            {hasRole(customer, ROLES.ADMIN) && (
              <Link to="/admin" style={{ textDecoration: 'none', color: '#334155', fontWeight: '600', fontSize: '14px' }}>
                Admin portal
              </Link>
            )}
            <Link to="/profile" style={{ textDecoration: 'none', color: '#334155', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={18} />
              Profile
            </Link>
            <button
              type="button"
              onClick={() => setShowNotifications((open) => !open)}
              aria-expanded={showNotifications}
              aria-label={`Notifications (${unreadCount} unread)`}
              style={{ border: '1px solid #e2e8f0', background: 'white', color: '#334155', borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Bell size={17} /> {unreadCount}
            </button>
            {showNotifications && (
              <section style={{ position: 'absolute', zIndex: 20, top: '44px', right: 0, width: '320px', maxHeight: '420px', overflowY: 'auto', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 8px 24px rgba(15,23,42,.12)', padding: '14px' }}>
                <h2 style={{ fontSize: '15px', margin: '0 0 10px', color: '#0f172a' }}>Notifications</h2>
                {notifications.length ? notifications.map((notification) => (
                  <article key={notification.id} style={{ padding: '10px 0', borderTop: '1px solid #f1f5f9' }}>
                    <strong style={{ fontSize: '13px', color: '#0f172a' }}>{notification.title}</strong>
                    <p style={{ fontSize: '12px', color: '#475569', margin: '5px 0' }}>{notification.message}</p>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                      {notification.recipientRole} · {notification.notificationType} · {notification.channel} · {notification.status}
                    </p>
                    {notification.bookingReference && <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0' }}>Booking: {notification.bookingReference}</p>}
                    {notification.relatedTripOracleId != null && <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0' }}>Trip ID: {notification.relatedTripOracleId}</p>}
                    {notification.createdAt && <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0' }}>Created: {new Date(notification.createdAt).toLocaleString()}</p>}
                    {notification.readAt && <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0' }}>Read: {new Date(notification.readAt).toLocaleString()}</p>}
                    {notification.details && <details style={{ fontSize: '11px', color: '#64748b', marginTop: '5px' }}><summary>Details</summary><pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(notification.details, null, 2)}</pre></details>}
                    {String(notification.status).toUpperCase() !== 'READ' && <button type="button" onClick={async () => {
                      try {
                        const updated = await api.put(`/api/content/notifications/${notification.id}/read`, {});
                        setNotifications((current) => current.map((item) => item.id === updated.id ? updated : item));
                      } catch {
                        window.alert('Unable to mark this notification as read.');
                      }
                    }} style={{ marginTop: '8px', border: '1px solid #cbd5e1', background: 'white', borderRadius: '6px', padding: '5px 9px', cursor: 'pointer', fontSize: '11px' }}>Mark as read</button>}
                  </article>
                )) : <p style={{ fontSize: '12px', color: '#64748b' }}>No notifications.</p>}
              </section>
            )}
          </>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: 'none', color: '#334155', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={18} />
              Login
            </Link>
            <Link to="/register" style={{
              backgroundColor: '#0066ff',
              color: 'white',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              textDecoration: 'none'
            }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default CustomerNavbar;
