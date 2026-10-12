import React, { useEffect, useMemo, useState } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bus, Clock, SlidersHorizontal } from 'lucide-react';
import { api } from '../../api/client.js';

const displayTime = (time) => {
  if (!time) return '—';
  const [hour, minute] = String(time).split(':').map(Number);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  return `${String(hour % 12 || 12).padStart(2, '0')}:${String(minute || 0).padStart(2, '0')} ${suffix}`;
};

const durationBetween = (start, end) => {
  if (!start || !end) return '';
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  let minutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);
  if (minutes < 0) minutes += 24 * 60;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
};

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = location.state;
  const [trips, setTrips] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!queryParams?.from || !queryParams?.to || !queryParams?.date) {
      navigate('/search', { replace: true });
      return;
    }
    let active = true;
    const query = new URLSearchParams(queryParams).toString();
    api.get(`/api/trips/search?${query}`)
      .then(async (items) => {
        const results = await Promise.all((Array.isArray(items) ? items : []).map(async (trip) => {
          const [availabilityResult, vehicleResult] = await Promise.allSettled([
            api.get(`/api/trips/${trip.id}/seats`),
            api.get(`/api/vehicles/${trip.vehicleId}`),
          ]);
          const availability = availabilityResult.status === 'fulfilled' ? availabilityResult.value : null;
          const vehicle = vehicleResult.status === 'fulfilled' ? vehicleResult.value : null;
          return {
            ...trip,
            seatsAvailable: availability?.availableSeats ?? 0,
            vehicleType: trip.vehicleType || vehicle?.vehicleType,
            imageData: vehicle?.imageData || null,
          };
        }));
        if (active) setTrips(results);
      })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [navigate, queryParams?.from, queryParams?.to, queryParams?.date]);

  const types = useMemo(() => [...new Set(trips.map((trip) => trip.vehicleType).filter(Boolean))], [trips]);
  const filteredTrips = trips.filter((trip) => !selectedTypes.length || selectedTypes.includes(trip.vehicleType));
  const toggleType = (type) => setSelectedTypes((current) => (
    current.includes(type) ? current.filter((item) => item !== type) : [...current, type]
  ));

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <CustomerNavbar />
      <div style={{ maxWidth: '1000px', margin: '32px auto', padding: '0 20px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px 24px', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>Available Vehicles</h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{queryParams?.from} → {queryParams?.to} | {queryParams?.date}</p>
          </div>
          {!loading && <span style={{ fontSize: '13px', fontWeight: '700', backgroundColor: '#e0f2fe', color: '#0284c7', padding: '6px 14px', borderRadius: '20px' }}>{filteredTrips.length} vehicles found</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><SlidersHorizontal size={16} /> Vehicle type</h3>
            {types.map((type) => (
              <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', marginBottom: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={selectedTypes.includes(type)} onChange={() => toggleType(type)} /> {type}
              </label>
            ))}
            {!types.length && <p style={{ color: '#64748b', fontSize: '13px' }}>Types will appear when trips are available.</p>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loading ? <p style={{ padding: '30px', color: '#64748b' }}>Searching available vehicles…</p> : null}
            {error ? <p role="alert" style={{ padding: '20px', background: '#fff', color: '#b91c1c', borderRadius: '12px' }}>{error}</p> : null}
            {!loading && !error && filteredTrips.length === 0 ? <p style={{ padding: '30px', background: '#fff', color: '#64748b', borderRadius: '12px' }}>No vehicles are scheduled for this route and date.</p> : null}
            {filteredTrips.map((trip) => (
              <div key={trip.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {trip.imageData
                    ? <img src={trip.imageData} alt={trip.vehicle} style={{ width: '110px', height: '75px', borderRadius: '8px', objectFit: 'cover' }} />
                    : <div aria-hidden="true" style={{ width: '110px', height: '75px', borderRadius: '8px', background: '#eff6ff', color: '#0066ff', display: 'grid', placeItems: 'center' }}><Bus size={34} /></div>}
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{trip.vehicle}</h3>
                      {trip.vehicleType && <span style={{ fontSize: '11px', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', fontWeight: '600' }}>{trip.vehicleType}</span>}
                    </div>
                    <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {displayTime(trip.departure)} → {displayTime(trip.arrival)} ({durationBetween(trip.departure, trip.arrival)})</p>
                    <p style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600', marginTop: '4px' }}>{trip.seatsAvailable} seats available</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Rs. {trip.fare}</div>
                  <button onClick={() => navigate('/seat-selection', { state: { bus: trip, queryParams } })} style={{ marginTop: '8px', backgroundColor: '#0066ff', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Select Seats</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
