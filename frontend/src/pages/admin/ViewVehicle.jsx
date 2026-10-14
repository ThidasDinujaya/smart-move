
import { useEffect, useState } from 'react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { api } from '../../api/client.js';
import { formatRecordId } from '../../utils/recordIds.js';

function safeVehicleMediaUrl(value) {
  if (typeof value !== 'string' || !value) return '';
  if (value.startsWith('/')) return value;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? value : '';
  } catch {
    return '';
  }
}

function vehicleMediaSource(item) {
  const data = item.mediaData || item.imageData;
  if (typeof data === 'string' && data.startsWith('data:')) {
    return /^data:(application\/pdf|image\/png|image\/jpeg);base64,/i.test(data) ? data : '';
  }
  if (typeof data === 'string' && data && ['application/pdf', 'image/png', 'image/jpeg'].includes(item.contentType)) {
    return `data:${item.contentType};base64,${data}`;
  }
  return safeVehicleMediaUrl(data) || safeVehicleMediaUrl(item.storageUrl);
}

function vehicleMediaType(item, source) {
  const contentType = String(item.contentType || '').toLowerCase();
  const fileReference = `${item.fileName || ''} ${item.storageUrl || ''}`.toLowerCase();
  if (contentType === 'application/pdf' || source.startsWith('data:application/pdf;') || /\.pdf(?:\?|$)/.test(fileReference)) return 'pdf';
  if (contentType.startsWith('image/') || source.startsWith('data:image/') || /\.(png|jpe?g)(?:\?|$)/.test(fileReference)) return 'image';
  return 'file';
}

function ViewVehicle({ vehicle, onBack, onEdit }) {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    if (!vehicle?.id) return undefined;
    let active = true;
    api.get(`/api/vehicles/${vehicle.id}/media`)
      .then((items) => { if (active) setMedia(Array.isArray(items) ? items : []); })
      .catch(() => { if (active) setMedia([]); });
    return () => { active = false; };
  }, [vehicle?.id]);

  if (!vehicle) {
    return (
      <div className="form-page view-vehicle-page">
        <div className="form-heading">
          <h1>Vehicle Not Found</h1>
          <p>
            Please return to Vehicle Management and select
            a vehicle.
          </p>
        </div>

        <button
          type="button"
          className="save-button"
          onClick={onBack}
        >
          Back to Vehicles
        </button>
      </div>
    );
  }

  const getStatusClass = (status) =>
    String(status || 'unknown')
      .toLowerCase()
      .replaceAll(' ', '-');

  return (
    <div className="form-page view-vehicle-page">
      <div className="details-page-header">
        <div>
          <h1>Vehicle Details</h1>
          <p>View complete vehicle information</p>
        </div>

        <button
          type="button"
          className="details-edit-button"
          onClick={() => onEdit(vehicle)}
        >
          <Pencil size={17} />
          Edit Vehicle
        </button>
      </div>

      <div className="details-card">
        {vehicle.imageData && (
          <img
            src={vehicle.imageData}
            alt={`${vehicle.vehicleNo} vehicle`}
            style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', borderRadius: '12px', marginBottom: '20px' }}
          />
        )}
        <div className="details-title">
          <div>
            <h2>{vehicle.vehicleNo}</h2>
            <p>
              {vehicle.brand} {vehicle.model || ''}
            </p>
          </div>

          <span
            className={`vehicle-status ${getStatusClass(
              vehicle.status
            )}`}
          >
            {vehicle.status || 'Not specified'}
          </span>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span>Vehicle ID</span>
            <strong>{formatRecordId('vehicle', vehicle.id)}</strong>
          </div>

          <div className="detail-item">
            <span>Vehicle Number</span>
            <strong>{vehicle.vehicleNo}</strong>
          </div>

          <div className="detail-item">
            <span>Vehicle Type</span>
            <strong>
              {vehicle.type || vehicle.vehicleType || 'Not specified'}
            </strong>
          </div>

          <div className="detail-item">
            <span>Brand</span>
            <strong>{vehicle.brand}</strong>
          </div>

          <div className="detail-item">
            <span>Model</span>
            <strong>{vehicle.model || 'Not specified'}</strong>
          </div>

          <div className="detail-item">
            <span>Manufacture Year</span>
            <strong>{vehicle.year || 'Not specified'}</strong>
          </div>

          <div className="detail-item">
            <span>Capacity</span>
            <strong>
              {vehicle.capacity != null && vehicle.capacity !== ''
                ? `${vehicle.capacity} Seats`
                : 'Not specified'}
            </strong>
          </div>

          <div className="detail-item">
            <span>Fuel Type</span>
            <strong>{vehicle.fuelType || 'Not specified'}</strong>
          </div>

          <div className="detail-item">
            <span>Status</span>
            <strong>{vehicle.status || 'Not specified'}</strong>
          </div>

          <div className="detail-item">
            <span>Last Service Date</span>
            <strong>
              {vehicle.lastService ||
                vehicle.serviceDate ||
                'Not specified'}
            </strong>
          </div>
        </div>

        <section style={{ marginTop: '24px' }}>
          <h3>Vehicle documents and media</h3>
          {media.length ? media.map((item) => {
            const source = vehicleMediaSource(item);
            const type = vehicleMediaType(item, source);
            return (
              <article key={item.id} style={{ borderTop: '1px solid #e2e8f0', padding: '12px 0' }}>
                {source && type === 'image' && <img src={source} alt={item.fileName || 'Vehicle media'} style={{ display: 'block', maxWidth: '100%', maxHeight: '320px', objectFit: 'contain', borderRadius: '8px' }} />}
                {source && type === 'pdf' && (
                  <>
                    <iframe src={source} title={item.fileName || 'Vehicle PDF'} style={{ width: '100%', minHeight: '480px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                    <p><a href={source} target="_blank" rel="noreferrer">Open PDF in a new tab</a></p>
                  </>
                )}
                {source && type === 'file' && <p><a href={source} target="_blank" rel="noreferrer">Open attached file</a></p>}
                <strong>{item.mediaType || 'Vehicle file'}{item.fileName ? ` · ${item.fileName}` : ''}</strong>
                <p style={{ margin: '5px 0', color: '#475569', fontSize: '13px' }}>
                  {item.registrationNo || vehicle.vehicleNo}
                  {item.documentNumber ? ` · Document ${item.documentNumber}` : ''}
                  {item.contentType ? ` · ${item.contentType}` : ''}
                  {item.uploadedAt ? ` · Uploaded ${new Date(item.uploadedAt).toLocaleString()}` : ''}
                  {item.expiresAt ? ` · Expires ${new Date(item.expiresAt).toLocaleDateString()}` : ''}
                </p>
                {item.metadata && <details><summary>Metadata</summary><pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(item.metadata, null, 2)}</pre></details>}
              </article>
            );
          }) : <p style={{ color: '#64748b' }}>No vehicle documents or media are recorded.</p>}
        </section>

        <div className="details-actions">
          <button
            type="button"
            className="back-button"
            onClick={onBack}
          >
            <ArrowLeft size={17} />
            Back to Vehicles
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewVehicle;
