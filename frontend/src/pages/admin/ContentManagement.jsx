import { useCallback, useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import Icon from '../../components/Icon.jsx';
import ActionButtons from '../../components/ActionButtons.jsx';
import { api } from '../../api/client.js';
import { formatDateTime } from '../../utils/formatters.js';

const sections = {
  announcements: {
    title: 'Announcements',
    path: '/api/content/admin/announcements',
    fields: [
      ['title', 'Title'], ['message', 'Message', 'textarea'], ['severity', 'Severity'],
      ['routeOracleIds', 'Route IDs (comma separated)'], ['audience', 'Audience (CUSTOMER, DRIVER, or ALL)'],
      ['source', 'Source'], ['language', 'Language'],
      ['publishedAt', 'Publish time', 'datetime-local'], ['startsAt', 'Start time', 'datetime-local'],
      ['endsAt', 'End time', 'datetime-local'], ['active', 'Active', 'checkbox'],
    ],
  },
  notifications: {
    title: 'Notifications',
    path: '/api/content/admin/notifications',
    fields: [
      ['recipientOracleId', 'Passenger ID', 'number'], ['recipientRole', 'Recipient role'],
      ['notificationType', 'Notification type'], ['title', 'Title'], ['message', 'Message', 'textarea'],
      ['relatedTripOracleId', 'Related trip ID', 'number'], ['channel', 'Channel'],
      ['bookingReference', 'Booking reference'],
    ],
  },
  tripMedia: {
    title: 'Trip media',
    path: '/api/content/admin/trip-media',
    fields: [
      ['tripOracleId', 'Trip ID', 'number'], ['mediaType', 'Media type'], ['title', 'Title'],
      ['description', 'Description', 'textarea'], ['contentType', 'Content type'],
      ['storageUrl', 'Storage URL'], ['location', 'Location'], ['note', 'Notes', 'textarea'],
    ],
  },
  vehicleMedia: {
    title: 'Vehicle media',
    path: '/api/content/admin/vehicle-media',
    fields: [
      ['vehicleOracleId', 'Vehicle ID', 'number'], ['mediaType', 'Media type'], ['fileName', 'File name'],
      ['documentNumber', 'Document number'], ['contentType', 'Content type'], ['storageUrl', 'Storage URL'],
      ['expiresAt', 'Expiry time', 'datetime-local'], ['note', 'Notes', 'textarea'], ['view', 'Photo view'],
    ],
  },
};

function emptyForm(section) {
  return Object.fromEntries(section.fields.map(([name, , type]) => [name, type === 'checkbox' ? true : '']));
}

function localDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function formFromRecord(section, record) {
  const values = emptyForm(section);
  for (const [name, , type] of section.fields) {
    const value = record[name];
    if (type === 'checkbox') values[name] = value !== false;
    else if (['publishedAt', 'startsAt', 'endsAt', 'expiresAt'].includes(name)) values[name] = localDateTime(value);
    else if (name === 'routeOracleIds' || name === 'audience') values[name] = Array.isArray(value) ? value.join(', ') : '';
    else if (name === 'source' || name === 'language') values[name] = record.details?.[name] ?? value ?? '';
    else if (name === 'note' || name === 'view') values[name] = record.metadata?.[name] ?? value ?? '';
    else if (name === 'bookingReference') values[name] = value ?? record.details?.bookingReference ?? '';
    else values[name] = value ?? '';
  }
  return values;
}

function mapFromFields(values, existing, managedKeys) {
  const preservedValues = Object.fromEntries(Object.entries(existing || {}).filter(([key]) => !managedKeys.includes(key)));
  const enteredValues = Object.fromEntries(Object.entries(values)
    .filter(([, value]) => value != null && String(value).trim() !== '')
    .map(([key, value]) => [key, String(value).trim()]));
  const result = { ...preservedValues, ...enteredValues };
  return Object.keys(result).length ? result : null;
}

function buildPayload(sectionId, form, existingRecord) {
  const numberOrNull = (value) => value === '' ? null : Number(value);
  const dateOrNull = (value) => value ? new Date(value).toISOString() : null;

  if (sectionId === 'announcements') {
    const { source, language, ...announcement } = form;
    return {
      ...announcement,
      routeOracleIds: form.routeOracleIds.split(',').map((value) => value.trim()).filter(Boolean).map(Number),
      audience: form.audience.split(',').map((value) => value.trim().toUpperCase()).filter(Boolean),
      publishedAt: dateOrNull(form.publishedAt),
      startsAt: dateOrNull(form.startsAt),
      endsAt: dateOrNull(form.endsAt),
      details: mapFromFields({ source, language }, existingRecord?.details, ['source', 'language']),
    };
  }
  if (sectionId === 'notifications') {
    return {
      ...form,
      recipientOracleId: numberOrNull(form.recipientOracleId),
      relatedTripOracleId: numberOrNull(form.relatedTripOracleId),
      details: mapFromFields({ bookingReference: form.bookingReference }, existingRecord?.details, ['bookingReference']),
    };
  }
  if (sectionId === 'tripMedia') {
    const { note, ...tripMedia } = form;
    return {
      ...tripMedia,
      tripOracleId: numberOrNull(form.tripOracleId),
      metadata: mapFromFields({ note }, existingRecord?.metadata, ['note']),
    };
  }
  const { note, view, ...vehicleMedia } = form;
  return {
    ...vehicleMedia,
    vehicleOracleId: numberOrNull(form.vehicleOracleId),
    expiresAt: dateOrNull(form.expiresAt),
    metadata: mapFromFields({ note, view }, existingRecord?.metadata, ['note', 'view']),
  };
}

function recordMeta(sectionId, record) {
  if (sectionId === 'announcements') {
    return [
      record.severity || 'General',
      (record.audience || []).join(', ') || 'All audiences',
      record.details?.source,
      record.details?.language,
      record.publishedAt ? `Published ${formatDateTime(record.publishedAt)}` : 'Publish time not set',
    ].filter(Boolean);
  }
  if (sectionId === 'notifications') {
    return [record.recipientRole || 'CUSTOMER', record.notificationType || 'Notification', record.status || 'UNREAD'];
  }
  if (sectionId === 'tripMedia') {
    return [record.mediaType || 'Trip media', record.contentType, record.location, record.metadata?.view].filter(Boolean);
  }
  return [record.mediaType || 'Vehicle media', record.registrationNo, record.metadata?.view, record.expiresAt ? `Expires ${formatDateTime(record.expiresAt)}` : null].filter(Boolean);
}

function recordDescription(sectionId, record) {
  if (sectionId === 'announcements' || sectionId === 'notifications') return record.message || '';
  return record.description || record.metadata?.note || record.fileName || record.documentNumber || record.storageUrl || '';
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
  const entries = [];
  const addEntry = (key, value) => {
    if (['mediaData', 'imageData'].includes(key) || value == null || value === '') return;
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

  Object.entries(record).forEach(([key, value]) => addEntry(key, value));
  return entries;
}

function mediaPreview(record) {
  const imageData = record.mediaData || record.imageData;
  if (imageData) {
    if (imageData.startsWith('data:')) return imageData;
    if (record.contentType?.startsWith('image/')) return `data:${record.contentType};base64,${imageData}`;
  }
  if (record.contentType?.startsWith('image/') && record.storageUrl) return record.storageUrl;
  return '';
}

export default function ContentManagement() {
  const [sectionId, setSectionId] = useState('announcements');
  const [records, setRecords] = useState({});
  const [form, setForm] = useState(emptyForm(sections.announcements));
  const [editingId, setEditingId] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const section = sections[sectionId];

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
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = buildPayload(sectionId, form, editingRecord);
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
    setSectionId(nextSection);
    setEditingId(null);
    setEditingRecord(null);
    setViewingRecord(null);
    setForm(emptyForm(sections[nextSection]));
    setSearch('');
    setError('');
  };

  const beginEdit = (record) => {
    setViewingRecord(null);
    setEditingId(record.id);
    setEditingRecord(record);
    setForm(formFromRecord(section, record));
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

  const changeAudience = (audience) => {
    const selected = (form.audience || '').split(',').map((value) => value.trim()).filter(Boolean);
    const next = selected.includes(audience)
      ? selected.filter((value) => value !== audience)
      : audience === 'ALL'
        ? ['ALL']
        : [...selected.filter((value) => value !== 'ALL'), audience];
    setForm((current) => ({ ...current, audience: next.join(', ') }));
  };

  const visibleRecords = (records[sectionId] || []).filter((record) => (
    !search || JSON.stringify(record).toLowerCase().includes(search.toLowerCase())
  ));
  const selectedAudience = (form.audience || '').split(',').map((value) => value.trim().toUpperCase()).filter(Boolean);

  return (
    <section className="page">
      <PageHeader title="Announcements & media" subtitle="Create and update MongoDB records used by the customer portal" />
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
              <p>{editingId ? 'Update the details below and save your changes.' : `Add a new ${section.title.toLowerCase()} record to MongoDB.`}</p>
            </div>
            <span className="content-panel-icon"><Icon name={sectionId === 'announcements' ? 'message' : sectionId === 'notifications' ? 'bell' : 'image'} size={20} /></span>
          </div>
          <div className="content-fields">
            {section.fields.map(([name, label, type = 'text']) => name === 'audience' ? (
              <div className="content-field-wide" key={name}>
                <span className="content-field-label">{label}</span>
                <div className="content-choice-group">
                  {['CUSTOMER', 'DRIVER', 'ALL'].map((audience) => (
                    <label key={audience} className={selectedAudience.includes(audience) ? 'selected' : ''}>
                      <input type="checkbox" checked={selectedAudience.includes(audience)} onChange={() => changeAudience(audience)} />
                      {audience === 'ALL' ? 'Everyone' : audience === 'CUSTOMER' ? 'Customers' : 'Drivers'}
                    </label>
                  ))}
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
                      <textarea rows="3" value={form[name]} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} />
                    ) : (
                      <input type={type} value={form[name]} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} />
                    )}
                  </>
                )}
              </label>
            ))}
          </div>
          <div className="content-form-actions">
            <button className="primary" type="submit" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : `Create ${section.title}`}</button>
            {editingId && <button className="secondary" type="button" onClick={resetForm} disabled={saving}>Cancel edit</button>}
          </div>
        </form>
        <section className="content-records content-panel" aria-label={`${section.title} records`}>
          <div className="content-panel-heading content-records-heading">
            <div><span className="content-eyebrow">MONGODB COLLECTION</span><h2>{section.title}</h2><p>{visibleRecords.length} {visibleRecords.length === 1 ? 'record' : 'records'} in this collection</p></div>
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
                <small className="content-record-id">ID {record.id}</small>
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
            {mediaPreview(viewingRecord) && (
              <img className="content-view-media" src={mediaPreview(viewingRecord)} alt={viewingRecord.title || viewingRecord.fileName || 'Media preview'} />
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
