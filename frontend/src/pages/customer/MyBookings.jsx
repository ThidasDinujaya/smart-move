import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerNavbar from '../../components/CustomerNavbar';
import { Bus } from 'lucide-react';
import { api } from '../../api/client.js';

function bookingDisplayStatus(booking) {
  const status = String(booking.status || '').toLowerCase();
  if (status === 'cancelled') return 'Cancelled';
  if (status === 'completed') return 'Completed';
  return 'Upcoming';
}

const MyBookings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [bookings, setBookings] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [reviewOpenId, setReviewOpenId] = useState(null);
  const [reviewsByTrip, setReviewsByTrip] = useState({});
  const [reviewForms, setReviewForms] = useState({});
  const [reviewMessages, setReviewMessages] = useState({});

  const loadBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const results = await api.get('/api/bookings');
      setBookings(Array.isArray(results) ? results : []);
    } catch (requestError) {
      setError(requestError.message || 'Unable to load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
    api.get('/api/feedback/mine')
      .then((items) => {
        const reviews = {};
        (Array.isArray(items) ? items : []).forEach((item) => { reviews[String(item.tripId)] = item; });
        setReviewsByTrip(reviews);
      })
      .catch(() => {});
  }, []);

  const updateReview = (bookingId, field, value) => {
    setReviewForms((current) => ({
      ...current,
      [bookingId]: { rating: 5, driverRating: 5, vehicleRating: 5, comment: '', isComplaint: false, ...current[bookingId], [field]: value },
    }));
  };

  const submitReview = async (booking) => {
    const form = { rating: 5, driverRating: 5, vehicleRating: 5, comment: '', isComplaint: false, ...reviewForms[booking.id] };
    try {
      const saved = await api.post('/api/feedback', {
        tripId: booking.tripId,
        rating: Number(form.rating),
        driverRating: Number(form.driverRating),
        vehicleRating: Number(form.vehicleRating),
        comment: form.comment.trim(),
        isComplaint: form.isComplaint,
      });
      setReviewsByTrip((current) => ({ ...current, [String(booking.tripId)]: saved }));
      setReviewMessages((current) => ({ ...current, [booking.id]: 'Thank you. Your feedback has been saved.' }));
    } catch (requestError) {
      setReviewMessages((current) => ({ ...current, [booking.id]: requestError.message || 'Unable to save feedback.' }));
    }
  };

  const filteredBookings = useMemo(() => bookings.filter((booking) => (
    filter === 'All' || bookingDisplayStatus(booking) === filter
  )), [bookings, filter]);

  const cancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking? Any successful payment will be marked as refunded.')) return;
    try {
      await api.delete(`/api/bookings/${id}`);
      await loadBookings();
    } catch (requestError) {
      setError(requestError.message || 'Unable to cancel this booking.');
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <CustomerNavbar />
      <div style={{ maxWidth: '900px', margin: '32px auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: '#0f172a' }}>My Bookings</h2>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          {['All', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
            <button key={tab} onClick={() => setFilter(tab)} style={{ backgroundColor: filter === tab ? '#0066ff' : 'white', color: filter === tab ? 'white' : '#64748b', border: filter === tab ? 'none' : '1px solid #e2e8f0', padding: '8px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>{tab}</button>
          ))}
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading your bookings…</div>}
        {error && <p role="alert" style={{ color: '#b91c1c', background: 'white', padding: '16px', borderRadius: '10px' }}>{error}</p>}
        {!loading && !error && filteredBookings.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredBookings.map((booking) => {
              const status = bookingDisplayStatus(booking);
              const seatNumbers = (booking.tickets || []).map((ticket) => ticket.seatNumber);
              return (
                <article key={booking.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '76px', height: '60px', borderRadius: '8px', background: '#eff6ff', color: '#0066ff', display: 'grid', placeItems: 'center' }}><Bus size={28} /></div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{booking.from} → {booking.to}</div>
                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{booking.date} · {booking.departure}</div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>Seat{seatNumbers.length === 1 ? '' : 's'}: {seatNumbers.join(', ') || '—'}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <span style={{ backgroundColor: status === 'Upcoming' ? '#dcfce7' : status === 'Completed' ? '#e2e8f0' : '#fee2e2', color: status === 'Upcoming' ? '#16a34a' : status === 'Completed' ? '#475569' : '#dc2626', padding: '4px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>{status}</span>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a' }}>Rs. {booking.totalAmount}</span>
                      <button onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)} style={{ border: '1px solid #0066ff', backgroundColor: 'white', color: '#0066ff', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>{expandedId === booking.id ? 'Hide Details' : 'View Details'}</button>
                      {status === 'Upcoming' && ['Confirmed', 'Pending Payment'].includes(booking.status) && <button onClick={() => cancelBooking(booking.id)} style={{ border: '1px solid #fecaca', backgroundColor: 'white', color: '#dc2626', padding: '8px 14px', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>}
                    </div>
                  </div>
                  {expandedId === booking.id && <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', fontSize: '13px', color: '#475569', display: 'grid', gap: '6px' }}>
                    <span>Booking reference: <strong>{booking.bookingReference}</strong></span>
                    <span>Vehicle: {booking.vehicle}</span>
                    <span>Booking status: {booking.status}</span>
                    {booking.paymentStatus && <span>Payment status: {booking.paymentStatus}</span>}
                    <span>Booking date: {booking.bookingDate ? new Date(booking.bookingDate).toLocaleString() : '—'}</span>
                    {(booking.tickets || []).map((ticket) => <span key={ticket.ticketNumber}>Ticket {ticket.ticketNumber}: seat {ticket.seatNumber}, {ticket.status}{ticket.issuedAt ? ` · issued ${new Date(ticket.issuedAt).toLocaleString()}` : ''}</span>)}
                  </div>}
                  {status === 'Completed' && booking.status === 'Completed' && (
                    <section style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                      {reviewsByTrip[String(booking.tripId)] ? (
                        <div style={{ color: '#475569', fontSize: '13px' }}>
                          Feedback submitted · Overall {reviewsByTrip[String(booking.tripId)].rating}/5 · Driver {reviewsByTrip[String(booking.tripId)].driverRating}/5 · Vehicle {reviewsByTrip[String(booking.tripId)].vehicleRating}/5 · {reviewsByTrip[String(booking.tripId)].reviewStatus}
                        </div>
                      ) : (
                        <>
                          <button type="button" onClick={() => setReviewOpenId(reviewOpenId === booking.id ? null : booking.id)} style={{ border: '1px solid #0066ff', background: 'white', color: '#0066ff', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' }}>
                            {reviewOpenId === booking.id ? 'Close feedback' : 'Leave feedback'}
                          </button>
                          {reviewOpenId === booking.id && <div style={{ display: 'grid', gap: '10px', marginTop: '12px' }}>
                            {[
                              ['rating', 'Overall rating'],
                              ['driverRating', 'Driver rating'],
                              ['vehicleRating', 'Vehicle rating'],
                            ].map(([field, label]) => (
                              <label key={field} style={{ display: 'grid', gap: '4px', maxWidth: '240px', fontSize: '13px', color: '#334155' }}>
                                {label}
                                <select value={reviewForms[booking.id]?.[field] ?? '5'} onChange={(event) => updateReview(booking.id, field, event.target.value)}>
                                  <option value="5">5 - Excellent</option><option value="4">4 - Good</option><option value="3">3 - Average</option><option value="2">2 - Poor</option><option value="1">1 - Very poor</option>
                                </select>
                              </label>
                            ))}
                            <label style={{ display: 'grid', gap: '4px', fontSize: '13px', color: '#334155' }}>
                              Comment
                              <textarea rows="3" maxLength="2000" value={reviewForms[booking.id]?.comment || ''} onChange={(event) => updateReview(booking.id, 'comment', event.target.value)} />
                            </label>
                            <label style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', color: '#334155' }}>
                              <input type="checkbox" checked={Boolean(reviewForms[booking.id]?.isComplaint)} onChange={(event) => updateReview(booking.id, 'isComplaint', event.target.checked)} />
                              This feedback is a complaint
                            </label>
                            {reviewMessages[booking.id] && <p role="status" style={{ margin: 0, color: '#475569', fontSize: '13px' }}>{reviewMessages[booking.id]}</p>}
                            <button type="button" onClick={() => submitReview(booking)} style={{ justifySelf: 'start', background: '#0066ff', color: 'white', border: 0, borderRadius: '8px', padding: '9px 16px', cursor: 'pointer' }}>Submit feedback</button>
                          </div>}
                        </>
                      )}
                    </section>
                  )}
                </article>
              );
            })}
          </div>
        )}
        {!loading && !error && !filteredBookings.length && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '48px 20px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <div style={{ backgroundColor: '#f1f5f9', width: '56px', height: '56px', borderRadius: '50%', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}><Bus size={28} color="#64748b" /></div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>No Bookings Found</h3>
            <p style={{ fontSize: '13px', color: '#64748b' }}>You don't have any {filter !== 'All' ? filter.toLowerCase() : ''} bookings at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
