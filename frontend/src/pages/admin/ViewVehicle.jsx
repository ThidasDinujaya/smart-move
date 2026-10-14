
import { useEffect, useState } from 'react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { api } from '../../api/client.js';

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
          {media.length ? media.map((item) => (
            <article key={item.id} style={{ borderTop: '1px solid #e2e8f0', padding: '12px 0' }}>
              <strong>{item.mediaType || 'Vehicle file'}{item.fileName ? ` · ${item.fileName}` : ''}</strong>
              <p style={{ margin: '5px 0', color: '#475569', fontSize: '13px' }}>
                {item.registrationNo || vehicle.vehicleNo}
                {item.documentNumber ? ` · Document ${item.documentNumber}` : ''}
                {item.contentType ? ` · ${item.contentType}` : ''}
                {item.uploadedAt ? ` · Uploaded ${new Date(item.uploadedAt).toLocaleString()}` : ''}
                {item.expiresAt ? ` · Expires ${new Date(item.expiresAt).toLocaleDateString()}` : ''}
              </p>
              {item.imageData && <img src={item.imageData} alt={item.fileName || 'Vehicle media'} style={{ maxWidth: '260px', maxHeight: '180px', objectFit: 'cover', borderRadius: '8px' }} />}
              {item.storageUrl && <p><a href={item.storageUrl} target="_blank" rel="noreferrer">Open stored file</a></p>}
              {item.metadata && <details><summary>Metadata</summary><pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(item.metadata, null, 2)}</pre></details>}
            </article>
          )) : <p style={{ color: '#64748b' }}>No vehicle documents or media are recorded.</p>}
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
