import React, { useEffect, useState } from 'react';
import CustomerNavbar from '../../components/CustomerNavbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bus } from 'lucide-react';
import { api } from '../../api/client.js';
import { formatRecordId } from '../../utils/recordIds.js';

function tripMediaSource(item) {
  const data = item.mediaData;
  if (typeof data === 'string' && data.startsWith('data:')) {
    return /^data:(application\/pdf|image\/png|image\/jpeg);base64,/i.test(data) ? data : '';
  }
  if (typeof data === 'string' && data && ['application/pdf', 'image/png', 'image/jpeg'].includes(item.contentType)) {
    return `data:${item.contentType};base64,${data}`;
  }
  return '';
}

function tripMediaType(item, source) {
  const contentType = String(item.contentType || '').toLowerCase();
  const fileReference = String(item.fileName || '').toLowerCase();
  if (contentType === 'application/pdf' || source.startsWith('data:application/pdf;') || /\.pdf(?:\?|$)/.test(fileReference)) return 'pdf';
  if (contentType.startsWith('image/') || source.startsWith('data:image/') || /\.(png|jpe?g)(?:\?|$)/.test(fileReference)) return 'image';
  return 'file';
}

const BusDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const trip = location.state?.bus;
  const queryParams = location.state?.queryParams || {};
  const [media, setMedia] = useState([]);

  useEffect(() => {
    if (!trip?.id) return undefined;
    let active = true;
    api.get(`/api/content/trips/${trip.id}/media`)
      .then((items) => { if (active) setMedia(Array.isArray(items) ? items : []); })
      .catch(() => { if (active) setMedia([]); });
    return () => { active = false; };
  }, [trip?.id]);

  if (!trip?.id) {
    return (
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        <CustomerNavbar />
        <div style={{ maxWidth: '700px', margin: '48px auto', padding: '24px', background: 'white', borderRadius: '12px' }}>
          <h2>Vehicle details are unavailable</h2>
          <p style={{ color: '#64748b' }}>Return to search and select a scheduled trip.</p>
          <button onClick={() => navigate('/search')}>Search vehicles</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <CustomerNavbar />
      <div style={{ maxWidth: '900px', margin: '32px auto', padding: '0 20px' }}>
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {trip.imageData
            ? <img src={trip.imageData} alt={trip.vehicle} style={{ width: '100%', minHeight: '240px', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
            : <div style={{ minHeight: '240px', background: '#eff6ff', color: '#0066ff', borderRadius: '12px', display: 'grid', placeItems: 'center' }} aria-label="Vehicle"><Bus size={76} strokeWidth={1.4} /></div>}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>{trip.vehicle}</h2>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {trip.vehicleType && <span style={{ backgroundColor: '#e0f2fe', color: '#0284c7', padding: '2px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>{trip.vehicleType}</span>}
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>{trip.status}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '16px 0', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Route:</span><strong style={{ color: '#0f172a' }}>{trip.from || queryParams.from} → {trip.to || queryParams.to}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Date:</span><strong style={{ color: '#0f172a' }}>{trip.date || queryParams.date}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Departure:</span><strong style={{ color: '#0f172a' }}>{trip.departure}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Arrival:</span><strong style={{ color: '#0f172a' }}>{trip.arrival}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Available seats:</span><strong style={{ color: '#0f172a' }}>{trip.seatsAvailable ?? trip.seats}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Price:</span><strong style={{ color: '#0066ff', fontSize: '16px' }}>Rs. {trip.fare}</strong></div>
              </div>
              {trip.notes && <p style={{ fontSize: '13px', color: '#475569' }}>{trip.notes}</p>}
            </div>
            <button onClick={() => navigate('/seat-selection', { state: location.state })} style={{ width: '100%', backgroundColor: '#0066ff', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', marginTop: '20px' }}>Select Seats</button>
          </div>
        </div>
        {media.length > 0 && (
          <section style={{ marginTop: '20px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
            <h2 style={{ fontSize: '17px', color: '#0f172a' }}>Trip media</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {media.map((item) => {
                const mediaUrl = tripMediaSource(item);
                const mediaType = tripMediaType(item, mediaUrl);
                return (
                  <article key={item.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px' }}>
                    {mediaUrl && mediaType === 'image' && <img src={mediaUrl} alt={item.title || item.fileName || 'Trip media'} style={{ width: '100%', maxHeight: '320px', objectFit: 'contain', borderRadius: '8px' }} />}
                    {mediaUrl && mediaType === 'pdf' && (
                      <>
                        <iframe src={mediaUrl} title={item.fileName || item.title || 'Trip PDF'} style={{ width: '100%', minHeight: '420px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                        <p style={{ margin: '6px 0 0', fontSize: '12px' }}><a href={mediaUrl} target="_blank" rel="noreferrer">Open PDF in a new tab</a></p>
                      </>
                    )}
                    {mediaUrl && mediaType === 'file' && <a href={mediaUrl} target="_blank" rel="noreferrer">Open {item.mediaType || 'trip file'}</a>}
                    <h3 style={{ fontSize: '14px', margin: '10px 0 4px' }}>{item.title || item.mediaType}</h3>
                    <p style={{ fontSize: '11px', color: '#64748b' }}>
                      {item.mediaType} {item.contentType ? `· ${item.contentType}` : ''}
                      {item.uploadedAt ? ` · Uploaded ${new Date(item.uploadedAt).toLocaleString()}` : ''}
                      {item.uploadedByOracleId != null ? ` · Uploaded by ${formatRecordId('passenger', item.uploadedByOracleId)}` : ''}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BusDetails;
