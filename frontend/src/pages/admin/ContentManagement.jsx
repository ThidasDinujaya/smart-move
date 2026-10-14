import { useCallback, useEffect, useRef, useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import Icon from '../../components/Icon.jsx';
import ActionButtons from '../../components/ActionButtons.jsx';
import { api } from '../../api/client.js';
import { formatDateTime } from '../../utils/formatters.js';
import { formatRecordId, formatRecordReference } from '../../utils/recordIds.js';

const sections = {
  announcements: {
    title: 'Announcements',
    path: '/api/content/admin/announcements',
    fields: [
      ['title', 'Title'], ['message', 'Message', 'textarea'], ['audience', 'Who can see this?', 'audience'],
      ['active', 'Active', 'checkbox'],
    ],
  },
  notifications: {
    title: 'Notifications',
    path: '/api/content/admin/notifications',
    fields: [
      ['recipientOracleId', 'Passenger', 'passenger'], ['title', 'Title'], ['message', 'Message', 'textarea'],
    ],
  },
  tripMedia: {
    title: 'Trip media',
    path: '/api/content/admin/trip-media',
    fields: [
      ['title', 'Title'], ['tripOracleId', 'Trip', 'trip'], ['mediaFile', 'Image or PDF', 'file'],
    ],
  },
  vehicleMedia: {
    title: 'Vehicle media',
    path: '/api/content/admin/vehicle-media',
    fields: [
      ['title', 'Title'], ['vehicleOracleId', 'Vehicle', 'vehicle'], ['mediaFile', 'Image or PDF', 'file'],
    ],
  },
};

function emptyForm(section) {
  return Object.fromEntries(section.fields.map(([name, , type]) => [
    name,
    type === 'checkbox' ? true : type === 'audience' ? 'ALL' : '',
  ]));
}

function formFromRecord(section, record) {
  const values = emptyForm(section);
  for (const [name, , type] of section.fields) {
    const value = record[name];
    if (type === 'file') values[name] = '';
    else if (type === 'checkbox') values[name] = value !== false;
    else if (name === 'audience') values[name] = Array.isArray(value)
      ? value.length === 1 ? String(value[0]).toUpperCase() : value.length ? '__KEEP__' : 'ALL'
      : String(value || 'ALL').toUpperCase();
    else if (['recipientOracleId', 'tripOracleId', 'vehicleOracleId'].includes(name)) values[name] = value == null ? '' : String(value);
    else values[name] = value ?? '';
  }
  return values;
}

function buildPayload(sectionId, form, existingRecord, selectedPassenger) {
  const numberOrNull = (value) => value === '' ? null : Number(value);
  const existing = existingRecord ? { ...existingRecord } : {};

  if (sectionId === 'announcements') {
    return {
      ...existing,
      title: form.title.trim(),
      message: form.message.trim(),
      audience: form.audience === '__KEEP__' ? existingRecord?.audience || [] : [form.audience || 'ALL'],
      active: Boolean(form.active),
    };
  }
  if (sectionId === 'notifications') {
    return {
      ...existing,
      recipientOracleId: numberOrNull(form.recipientOracleId),
      recipientName: selectedPassenger?.fullName || selectedPassenger?.name || existingRecord?.recipientName || null,
      recipientEmail: selectedPassenger?.email || existingRecord?.recipientEmail || null,
      recipientRole: existingRecord?.recipientRole || 'CUSTOMER',
      title: form.title.trim(),
      message: form.message.trim(),
      channel: existingRecord?.channel || 'IN_APP',
    };
  }
  if (sectionId === 'tripMedia') {
    const fileName = form.fileName || existingRecord?.fileName || null;
    return {
      ...existing,
      tripOracleId: numberOrNull(form.tripOracleId),
      title: form.title.trim(),
      mediaType: form.mediaType || existingRecord?.mediaType || (form.contentType === 'application/pdf' ? 'DOCUMENT' : 'PHOTO'),
      fileName,
      contentType: form.contentType || existingRecord?.contentType || null,
      mediaData: form.mediaData || existingRecord?.mediaData || null,
    };
  }
  return {
    ...existing,
    vehicleOracleId: numberOrNull(form.vehicleOracleId),
    title: form.title.trim(),
    mediaType: form.mediaType || existingRecord?.mediaType || (form.contentType === 'application/pdf' ? 'DOCUMENT' : 'PHOTO'),
    fileName: form.fileName || existingRecord?.fileName || null,
    contentType: form.contentType || existingRecord?.contentType || null,
    mediaData: form.mediaData || existingRecord?.mediaData || null,
  };
}

function recordMeta(sectionId, record) {
  if (sectionId === 'announcements') {
    return [
      record.severity || 'General',
      (record.audience || []).join(', ') || 'All audiences',
      record.publishedAt ? `Published ${formatDateTime(record.publishedAt)}` : 'Publish time not set',
    ].filter(Boolean);
  }
  if (sectionId === 'notifications') {
    return [record.recipientName, record.recipientEmail, record.recipientRole || 'CUSTOMER', record.notificationType || 'Notification', record.status || 'UNREAD'].filter(Boolean);
  }
  if (sectionId === 'tripMedia') {
    return [record.mediaType || 'Trip media', record.contentType].filter(Boolean);
  }
  return [record.mediaType || 'Vehicle media', record.registrationNo, record.contentType].filter(Boolean);
}

function recordDescription(sectionId, record) {
  if (sectionId === 'announcements' || sectionId === 'notifications') return record.message || '';
  return record.fileName || '';
}

function detailLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (letter) => letter.toUpperCase());
}

function detailValue(value) {
  if (value == null || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.length ? value.map(detailValue).join(', ') : '—';
  if (typeof value === 'object') {
    return Object.entries(value).map(([key, item]) => `${detailLabel(key)}: ${detailValue(item)}`).join('; ') || '—';
  }
  return String(value);
}

function detailEntries(record) {
  const entries = record.displayId ? [['ID', record.displayId]] : [];
  const addEntry = (key, value) => {
    if (key === 'mediaData' || value == null || value === '') return;
    const reference = formatRecordReference(key, value);
    if (reference != null) {
      entries.push([key, reference]);
      return;
    }
    if (Array.isArray(value)) {
      entries.push([key, detailValue(value)]);
      return;
    }
    if (typeof value === 'object') {
      Object.entries(value).forEach(([childKey, childValue]) => addEntry(childKey, childValue));
      return;
    }
    entries.push([key, detailValue(value)]);
  };

  Object.entries(record).forEach(([key, value]) => {
    if (key !== 'id' && key !== 'displayId') addEntry(key, value);
  });
  return entries;
}

const supportedMediaTypes = ['application/pdf', 'image/png', 'image/jpeg'];

function mediaViewer(record) {
  const data = record.mediaData;
  let source = '';
  if (typeof data === 'string' && data.startsWith('data:')) {
    source = /^data:(application\/pdf|image\/png|image\/jpeg);base64,/i.test(data) ? data : '';
  } else if (typeof data === 'string' && data) {
    if (supportedMediaTypes.includes(record.contentType)) source = `data:${record.contentType};base64,${data}`;
  }

  const contentType = String(record.contentType || '').toLowerCase();
  const fileReference = String(record.fileName || '').toLowerCase();
  const type = contentType === 'application/pdf' || source.startsWith('data:application/pdf;') || /\.pdf(?:\?|$)/.test(fileReference)
    ? 'pdf'
    : contentType.startsWith('image/') || source.startsWith('data:image/') || /\.(png|jpe?g)(?:\?|$)/.test(fileReference)
      ? 'image'
      : 'file';
  return source ? { source, type } : null;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read the selected file.'));
    reader.readAsDataURL(file);
  });
}

export default function ContentManagement({ passengers = [], trips = [], vehicles = [] }) {
  const [sectionId, setSectionId] = useState('announcements');
  const [records, setRecords] = useState({});
  const [form, setForm] = useState(emptyForm(sections.announcements));
  const [editingId, setEditingId] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [readingFile, setReadingFile] = useState(false);
  const [search, setSearch] = useState('');
  const [tripFrom, setTripFrom] = useState('');
  const [tripTo, setTripTo] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('');
  const [vehicleModelFilter, setVehicleModelFilter] = useState('');
  const mediaFileInput = useRef(null);
  const section = sections[sectionId];
  const selectedPassenger = passengers.find((passenger) => String(passenger.id) === String(form.recipientOracleId));
  const selectedTrip = trips.find((trip) => String(trip.id) === String(form.tripOracleId));
  const selectedVehicle = vehicles.find((vehicle) => String(vehicle.id) === String(form.vehicleOracleId));
  const distinct = (values) => [...new Set(values.filter(Boolean))].sort((left, right) => String(left).localeCompare(String(right)));
  const tripFromOptions = distinct(trips.map((trip) => trip.from));
  const tripsFromOrigin = trips.filter((trip) => !tripFrom || String(trip.from) === String(tripFrom));
  const tripToOptions = distinct(tripsFromOrigin.map((trip) => trip.to));
  const tripsForRoute = tripsFromOrigin.filter((trip) => !tripTo || String(trip.to) === String(tripTo));
  const tripDateOptions = distinct(tripsForRoute.map((trip) => trip.date));
  const availableTrips = tripsForRoute
    .filter((trip) => !tripDate || String(trip.date) === String(tripDate))
    .filter((trip) => String(trip.status || '').toLowerCase() !== 'cancelled' || String(trip.id) === String(form.tripOracleId))
    .sort((left, right) => String(left.departure || '').localeCompare(String(right.departure || '')));
  const vehicleTypeOptions = distinct(vehicles.map((vehicle) => vehicle.vehicleType || vehicle.type));
  const vehiclesOfType = vehicles.filter((vehicle) => !vehicleTypeFilter || String(vehicle.vehicleType || vehicle.type) === vehicleTypeFilter);
  const vehicleModelOptions = [...new Map(vehiclesOfType.map((vehicle) => {
    const key = JSON.stringify([vehicle.brand || '', vehicle.model || '']);
    const label = [vehicle.brand, vehicle.model].filter(Boolean).join(' ') || 'Model not specified';
    return [key, { key, label }];
  })).values()].sort((left, right) => left.label.localeCompare(right.label));
  const availableVehicles = vehiclesOfType
    .filter((vehicle) => !vehicleModelFilter || JSON.stringify([vehicle.brand || '', vehicle.model || '']) === vehicleModelFilter)
    .sort((left, right) => String(left.vehicleNo || '').localeCompare(String(right.vehicleNo || '')));

  const uploadMediaFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const extensionType = /\.pdf$/i.test(file.name)
      ? 'application/pdf'
      : /\.png$/i.test(file.name)
        ? 'image/png'
        : /\.jpe?g$/i.test(file.name)
          ? 'image/jpeg'
          : '';
    const browserType = String(file.type || '').toLowerCase();
    const reportedType = browserType === 'application/x-pdf' ? 'application/pdf' : browserType;
    const contentType = reportedType === 'application/octet-stream' || !reportedType ? extensionType : reportedType;

    if (!extensionType || !supportedMediaTypes.includes(contentType) || contentType !== extensionType) {
      setError('Choose a PDF, PNG, or JPG file.');
      event.target.value = '';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Files must be 10 MB or smaller so they fit safely in MongoDB.');
      event.target.value = '';
      return;
    }

    try {
      setReadingFile(true);
      const dataUrl = await readFileAsDataUrl(file);
      const encodedFile = dataUrl.slice(dataUrl.indexOf(',') + 1);
      setForm((current) => ({
        ...current,
        mediaFile: file.name,
        mediaData: `data:${contentType};base64,${encodedFile}`,
        contentType,
        mediaType: contentType.startsWith('image/') ? 'PHOTO' : 'DOCUMENT',
        fileName: file.name,
      }));
      setError('');
    } catch (requestError) {
      setError(requestError.message || 'Unable to read the selected file.');
      event.target.value = '';
    } finally {
      setReadingFile(false);
    }
  };

  const refresh = useCallback(async () => {
    try {
      const entries = await Promise.all(Object.entries(sections).map(async ([key, item]) => [key, await api.get(item.path)]));
      setRecords(Object.fromEntries(entries));
      setError('');
    } catch (requestError) {
      setError(requestError.message || 'Unable to load MongoDB content.');
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const resetForm = () => {
    setEditingId(null);
    setEditingRecord(null);
    setForm(emptyForm(section));
    setTripFrom('');
    setTripTo('');
    setTripDate('');
    setVehicleTypeFilter('');
    setVehicleModelFilter('');
    if (mediaFileInput.current) mediaFileInput.current.value = '';
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = buildPayload(sectionId, form, editingRecord, selectedPassenger);
      if (editingId) await api.put(`${section.path}/${editingId}`, payload);
      else await api.post(section.path, payload);
      await refresh();
      resetForm();
    } catch (requestError) {
      setError(requestError.message || 'Unable to save this MongoDB record.');
    } finally {
      setSaving(false);
    }
  };

  const selectSection = (nextSection) => {
    if (mediaFileInput.current) mediaFileInput.current.value = '';
    setSectionId(nextSection);
    setEditingId(null);
    setEditingRecord(null);
    setViewingRecord(null);
    setForm(emptyForm(sections[nextSection]));
    setTripFrom('');
    setTripTo('');
    setTripDate('');
    setVehicleTypeFilter('');
    setVehicleModelFilter('');
    setSearch('');
    setError('');
  };

  const beginEdit = (record) => {
    if (mediaFileInput.current) mediaFileInput.current.value = '';
    setViewingRecord(null);
    setEditingId(record.id);
    setEditingRecord(record);
    setForm(formFromRecord(section, record));
    const linkedTrip = trips.find((trip) => String(trip.id) === String(record.tripOracleId));
    setTripFrom(linkedTrip?.from || '');
    setTripTo(linkedTrip?.to || '');
    setTripDate(linkedTrip?.date || '');
    const linkedVehicle = vehicles.find((vehicle) => String(vehicle.id) === String(record.vehicleOracleId));
    setVehicleTypeFilter(linkedVehicle?.vehicleType || linkedVehicle?.type || '');
    setVehicleModelFilter(linkedVehicle ? JSON.stringify([linkedVehicle.brand || '', linkedVehicle.model || '']) : '');
    setError('');
  };

  const deleteRecord = async (record) => {
    const label = record.title || record.fileName || record.mediaType || 'this record';
    if (!window.confirm(`Delete “${label}” from ${section.title}? This cannot be undone.`)) return;

    setError('');
    try {
      await api.delete(`${section.path}/${record.id}`);
      if (editingId === record.id) resetForm();
      setViewingRecord(null);
      await refresh();
    } catch (requestError) {
      setError(requestError.message || `Unable to delete this ${section.title.toLowerCase()} record.`);
    }
  };

  const visibleRecords = (records[sectionId] || []).filter((record) => {
    if (!search) return true;
    const searchableRecord = Object.fromEntries(Object.entries(record).filter(([key]) => key !== 'mediaData'));
    return JSON.stringify(searchableRecord).toLowerCase().includes(search.toLowerCase());
  });
  const viewingMedia = viewingRecord ? mediaViewer(viewingRecord) : null;

  return (
    <section className="page">
      <PageHeader title="Announcements & media" subtitle="Manage announcements, notifications, and media shown in SmartMove" />
      <div className="stats-grid content-overview-grid">
        <article className="stat-card blue"><Icon name="message" size={22} /><div><div className="stat-title">Announcements</div><div className="stat-value">{records.announcements?.length || 0}</div></div></article>
        <article className="stat-card orange"><Icon name="bell" size={22} /><div><div className="stat-title">Notifications</div><div className="stat-value">{records.notifications?.length || 0}</div></div></article>
        <article className="stat-card green"><Icon name="image" size={22} /><div><div className="stat-title">Trip media</div><div className="stat-value">{records.tripMedia?.length || 0}</div></div></article>
        <article className="stat-card pink"><Icon name="bus" size={22} /><div><div className="stat-title">Vehicle media</div><div className="stat-value">{records.vehicleMedia?.length || 0}</div></div></article>
      </div>
      <div className="content-tabs" role="tablist" aria-label="Content sections">
        {Object.entries(sections).map(([key, item]) => (
          <button key={key} type="button" role="tab" onClick={() => selectSection(key)} aria-selected={sectionId === key} aria-pressed={sectionId === key}>
            {item.title}
          </button>
        ))}
      </div>
      {error && <p className="content-error" role="alert">{error}</p>}
      <div className="content-management-grid">
        <form className="content-form content-panel" onSubmit={save}>
          <div className="content-panel-heading">
            <div>
              <span className="content-eyebrow">{editingId ? 'EDIT RECORD' : 'NEW RECORD'}</span>
              <h2>{editingId ? `Edit ${section.title}` : `Create ${section.title}`}</h2>
              <p>{editingId ? 'Update the information below.' : `Add a new ${section.title.toLowerCase()}.`}</p>
            </div>
            <span className="content-panel-icon"><Icon name={sectionId === 'announcements' ? 'message' : sectionId === 'notifications' ? 'bell' : 'image'} size={20} /></span>
          </div>
          <div className="content-fields">
            {section.fields.map(([name, label, type = 'text']) => type === 'audience' ? (
              <label className="content-field-wide" key={name}>
                <span className="content-field-label">{label}</span>
                <select value={form[name]} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))}>
                  {form[name] === '__KEEP__' && <option value="__KEEP__">Keep current audience</option>}
                  <option value="ALL">Everyone</option>
                  <option value="CUSTOMER">Customers</option>
                  <option value="DRIVER">Drivers</option>
                </select>
              </label>
            ) : type === 'file' ? (
              <label className="content-field-wide" key={name}>
                <span>{label}</span>
                <input
                  ref={mediaFileInput}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                  required={!editingId && !editingRecord?.mediaData}
                  onChange={uploadMediaFile}
                />
                <small className="content-upload-help">
                  {form.mediaFile
                    ? `Selected: ${form.mediaFile}`
                    : editingRecord?.mediaData
                      ? `Current file: ${editingRecord.fileName || 'attached file'}. Choose a new file to replace it.`
                      : 'PDF, PNG, or JPG, up to 10 MB. The file name and type are filled in automatically.'}
                </small>
              </label>
            ) : type === 'passenger' ? (
              <div className="content-field-wide content-passenger-fields" key={name}>
                <label>
                  <span>Passenger name</span>
                  <select
                    value={form[name]}
                    required
                    onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))}
                  >
                    <option value="">Select a passenger</option>
                    {passengers.map((passenger) => (
                      <option key={passenger.id} value={passenger.id}>{passenger.fullName || passenger.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Email</span>
                  <input type="email" value={selectedPassenger?.email || ''} placeholder="Filled from passenger" readOnly />
                </label>
                <label>
                  <span>Passenger ID</span>
                  <input type="text" value={selectedPassenger ? formatRecordId('passenger', selectedPassenger.id) : ''} placeholder="Filled from passenger" readOnly />
                </label>
              </div>
            ) : type === 'trip' ? (
              <div className="content-field-wide content-selection-flow" key={name}>
                <div className="content-selection-step">
                  <label>
                    <span>From</span>
                    <select value={tripFrom} required onChange={(event) => {
                      setTripFrom(event.target.value);
                      setTripTo('');
                      setTripDate('');
                      setForm((current) => ({ ...current, tripOracleId: '' }));
                    }}>
                      <option value="">Select origin</option>
                      {tripFromOptions.map((place) => <option key={place} value={place}>{place}</option>)}
                    </select>
                  </label>
                  <label>
                    <span>To</span>
                    <select value={tripTo} required disabled={!tripFrom} onChange={(event) => {
                      setTripTo(event.target.value);
                      setTripDate('');
                      setForm((current) => ({ ...current, tripOracleId: '' }));
                    }}>
                      <option value="">Select destination</option>
                      {tripToOptions.map((place) => <option key={place} value={place}>{place}</option>)}
                    </select>
                  </label>
                  <label>
                    <span>Date</span>
                    <select value={tripDate} required disabled={!tripTo} onChange={(event) => {
                      setTripDate(event.target.value);
                      setForm((current) => ({ ...current, tripOracleId: '' }));
                    }}>
                      <option value="">Select date</option>
                      {tripDateOptions.map((date) => <option key={date} value={date}>{date}</option>)}
                    </select>
                  </label>
                </div>
                <div className="content-available-options">
                  <strong>Available trips</strong>
                  {!tripFrom || !tripTo || !tripDate ? (
                    <p>Select a route and date to see matching trips.</p>
                  ) : !availableTrips.length ? (
                    <p>No trips are available for this route and date.</p>
                  ) : (
                    <div className="content-option-list">
                      {availableTrips.map((trip) => (
                        <label className={`content-option-card ${String(form.tripOracleId) === String(trip.id) ? 'selected' : ''}`} key={trip.id}>
                          <input
                            type="radio"
                            name="tripOracleId"
                            value={trip.id}
                            required
                            checked={String(form.tripOracleId) === String(trip.id)}
                            onChange={() => setForm((current) => ({ ...current, tripOracleId: String(trip.id) }))}
                          />
                          <span className="content-option-card-body">
                            <span className="content-option-row"><span>Trip ID</span><strong>{formatRecordId('trip', trip.id)}</strong></span>
                            <span className="content-option-row"><span>Departure</span><strong>{trip.departure || '—'}</strong></span>
                            <span className="content-option-row"><span>Arrival</span><strong>{trip.arrival || '—'}</strong></span>
                            <span className="content-option-row"><span>Vehicle</span><strong>{trip.vehicle || '—'}</strong></span>
                            <span className="content-option-row"><span>Vehicle type</span><strong>{trip.vehicleType || '—'}</strong></span>
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                  {selectedTrip && !availableTrips.some((trip) => String(trip.id) === String(selectedTrip.id)) && (
                    <p className="content-selection-note">The saved trip is no longer available in the current selection.</p>
                  )}
                </div>
              </div>
            ) : type === 'vehicle' ? (
              <div className="content-field-wide content-selection-flow" key={name}>
                <div className="content-selection-step">
                  <label>
                    <span>Vehicle type</span>
                    <select value={vehicleTypeFilter} required onChange={(event) => {
                      setVehicleTypeFilter(event.target.value);
                      setVehicleModelFilter('');
                      setForm((current) => ({ ...current, vehicleOracleId: '' }));
                    }}>
                      <option value="">Select vehicle type</option>
                      {vehicleTypeOptions.map((vehicleType) => <option key={vehicleType} value={vehicleType}>{vehicleType}</option>)}
                    </select>
                  </label>
                  <label>
                    <span>Make and model</span>
                    <select value={vehicleModelFilter} required disabled={!vehicleTypeFilter} onChange={(event) => {
                      setVehicleModelFilter(event.target.value);
                      setForm((current) => ({ ...current, vehicleOracleId: '' }));
                    }}>
                      <option value="">Select make and model</option>
                      {vehicleModelOptions.map((model) => <option key={model.key} value={model.key}>{model.label}</option>)}
                    </select>
                  </label>
                </div>
                <div className="content-available-options">
                  <strong>Available vehicles</strong>
                  {!vehicleTypeFilter || !vehicleModelFilter ? (
                    <p>Select a vehicle type and make/model to see matching vehicles.</p>
                  ) : !availableVehicles.length ? (
                    <p>No vehicles match those selections.</p>
                  ) : (
                    <div className="content-option-list">
                      {availableVehicles.map((vehicle) => (
                        <label className={`content-option-card ${String(form.vehicleOracleId) === String(vehicle.id) ? 'selected' : ''}`} key={vehicle.id}>
                          <input
                            type="radio"
                            name="vehicleOracleId"
                            value={vehicle.id}
                            required
                            checked={String(form.vehicleOracleId) === String(vehicle.id)}
                            onChange={() => setForm((current) => ({ ...current, vehicleOracleId: String(vehicle.id) }))}
                          />
                          <span className="content-option-card-body">
                            <span className="content-option-row"><span>Vehicle ID</span><strong>{formatRecordId('vehicle', vehicle.id)}</strong></span>
                            <span className="content-option-row"><span>Registration</span><strong>{vehicle.vehicleNo || '—'}</strong></span>
                            <span className="content-option-row"><span>Make and model</span><strong>{[vehicle.brand, vehicle.model].filter(Boolean).join(' ') || '—'}</strong></span>
                            <span className="content-option-row"><span>Seats</span><strong>{vehicle.seatingCapacity || vehicle.capacity || '—'}</strong></span>
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                  {selectedVehicle && !availableVehicles.some((vehicle) => String(vehicle.id) === String(selectedVehicle.id)) && (
                    <p className="content-selection-note">The saved vehicle is no longer available in the current selection.</p>
                  )}
                </div>
              </div>
            ) : (
              <label className={type === 'textarea' ? 'content-field-wide' : ''} key={name}>
                {type === 'checkbox' ? (
                  <span className="content-switch-row">
                    <input type="checkbox" checked={Boolean(form[name])} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.checked }))} />
                    <span><strong>{label}</strong><small>Show this announcement to its selected audience.</small></span>
                  </span>
                ) : (
                  <>
                    <span>{label}</span>
                    {type === 'textarea' ? (
                      <textarea rows="3" required value={form[name]} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} />
                    ) : (
                      <input type={type} required value={form[name]} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} />
                    )}
                  </>
                )}
              </label>
            ))}
          </div>
          <div className="content-form-actions">
            <button className="primary" type="submit" disabled={saving || readingFile}>{readingFile ? 'Reading file…' : saving ? 'Saving…' : editingId ? 'Save changes' : `Create ${section.title}`}</button>
            {editingId && <button className="secondary" type="button" onClick={resetForm} disabled={saving}>Cancel edit</button>}
          </div>
        </form>
        <section className="content-records content-panel" aria-label={`${section.title} records`}>
          <div className="content-panel-heading content-records-heading">
            <div><span className="content-eyebrow">SAVED RECORDS</span><h2>{section.title}</h2><p>{visibleRecords.length} {visibleRecords.length === 1 ? 'record' : 'records'}</p></div>
            <span className="content-record-count">{visibleRecords.length}</span>
          </div>
          <label className="content-search">
            <Icon name="search" size={16} />
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${section.title.toLowerCase()}…`} />
          </label>
          <div className="content-record-list">
          {visibleRecords.map((record) => (
            <article className="content-record" key={record.id}>
              <div className="content-record-main">
                <div className="content-record-title-row">
                  <strong>{record.title || record.fileName || record.mediaType || 'Untitled record'}</strong>
                  <span className={`content-status ${record.active === false || record.status === 'READ' ? 'muted' : 'active'}`}>
                    {sectionId === 'announcements' ? (record.active === false ? 'Inactive' : 'Active') : sectionId === 'notifications' ? (record.status || 'UNREAD') : (record.mediaType || 'Media')}
                  </span>
                </div>
                {recordDescription(sectionId, record) && <p className="content-record-description">{recordDescription(sectionId, record)}</p>}
                <div className="content-record-meta">{recordMeta(sectionId, record).map((value, index) => <span key={`${index}-${value}`}>{value}</span>)}</div>
                <small className="content-record-id">{record.displayId || '—'}</small>
              </div>
              <ActionButtons
                onView={() => setViewingRecord(record)}
                onEdit={() => beginEdit(record)}
                onDelete={() => deleteRecord(record)}
              />
            </article>
          ))}
          {!visibleRecords.length && <p className="content-empty">{search ? 'No matching records found.' : 'No records in this collection yet.'}</p>}
          </div>
        </section>
      </div>
      {viewingRecord && (
        <div className="content-view-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setViewingRecord(null);
        }}>
          <section className="content-view-dialog" role="dialog" aria-modal="true" aria-labelledby="content-view-title">
            <div className="content-view-heading">
              <div>
                <span className="content-eyebrow">{section.title.toUpperCase()} RECORD</span>
                <h2 id="content-view-title">{viewingRecord.title || viewingRecord.fileName || viewingRecord.mediaType || 'Record details'}</h2>
              </div>
              <button className="content-view-close" type="button" aria-label="Close details" onClick={() => setViewingRecord(null)}>×</button>
            </div>
            {viewingMedia?.type === 'image' && (
              <img className="content-view-media" src={viewingMedia.source} alt={viewingRecord.title || viewingRecord.fileName || 'Media preview'} />
            )}
            {viewingMedia?.type === 'pdf' && (
              <>
                <iframe className="content-view-document" src={viewingMedia.source} title={viewingRecord.fileName || viewingRecord.title || 'PDF preview'} />
                <a className="content-view-file-link" href={viewingMedia.source} target="_blank" rel="noreferrer">Open PDF in a new tab</a>
              </>
            )}
            {viewingMedia?.type === 'file' && (
              <a className="content-view-file-link" href={viewingMedia.source} target="_blank" rel="noreferrer">Open attached file</a>
            )}
            <div className="content-view-details">
              {detailEntries(viewingRecord).map(([key, value], index) => (
                <div className="content-view-detail" key={`${index}-${key}`}>
                  <strong>{detailLabel(key)}</strong>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            <div className="content-view-actions">
              <button type="button" className="secondary" onClick={() => setViewingRecord(null)}>Close</button>
              <button type="button" className="primary" onClick={() => beginEdit(viewingRecord)}>Edit record</button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
