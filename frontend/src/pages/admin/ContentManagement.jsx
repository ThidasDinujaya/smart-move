import { useCallback, useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import { api } from '../../api/client.js';

const sections = {
  announcements: {
    title: 'Announcements',
    path: '/api/content/admin/announcements',
    fields: [
      ['title', 'Title'], ['message', 'Message', 'textarea'], ['severity', 'Severity'],
      ['routeOracleIds', 'Route IDs (comma separated)'], ['audience', 'Audience (CUSTOMER, DRIVER, or ALL)'],
      ['publishedAt', 'Publish time', 'datetime-local'], ['startsAt', 'Start time', 'datetime-local'],
      ['endsAt', 'End time', 'datetime-local'], ['active', 'Active', 'checkbox'], ['details', 'Details (JSON)', 'textarea'],
    ],
  },
  notifications: {
    title: 'Notifications',
    path: '/api/content/admin/notifications',
    fields: [
      ['recipientOracleId', 'Passenger ID', 'number'], ['recipientRole', 'Recipient role'],
      ['notificationType', 'Notification type'], ['title', 'Title'], ['message', 'Message', 'textarea'],
      ['relatedTripOracleId', 'Related trip ID', 'number'], ['channel', 'Channel'],
      ['bookingReference', 'Booking reference'], ['details', 'Details (JSON)', 'textarea'],
    ],
  },
  tripMedia: {
    title: 'Trip media',
    path: '/api/content/admin/trip-media',
    fields: [
      ['tripOracleId', 'Trip ID', 'number'], ['mediaType', 'Media type'], ['title', 'Title'],
      ['description', 'Description', 'textarea'], ['contentType', 'Content type'],
      ['storageUrl', 'Storage URL'], ['location', 'Location'], ['metadata', 'Metadata (JSON)', 'textarea'],
    ],
  },
  vehicleMedia: {
    title: 'Vehicle media',
    path: '/api/content/admin/vehicle-media',
    fields: [
      ['vehicleOracleId', 'Vehicle ID', 'number'], ['mediaType', 'Media type'], ['fileName', 'File name'],
      ['documentNumber', 'Document number'], ['contentType', 'Content type'], ['storageUrl', 'Storage URL'],
      ['expiresAt', 'Expiry time', 'datetime-local'], ['metadata', 'Metadata (JSON)', 'textarea'],
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
    else if (name === 'details' || name === 'metadata') values[name] = value ? JSON.stringify(value, null, 2) : '';
    else values[name] = value ?? '';
  }
  return values;
}

function buildPayload(sectionId, form) {
  const parseObject = (value, label) => {
    if (!value.trim()) return null;
    try {
      return JSON.parse(value);
    } catch {
      throw new Error(`${label} must be valid JSON.`);
    }
  };
  const numberOrNull = (value) => value === '' ? null : Number(value);
  const dateOrNull = (value) => value ? new Date(value).toISOString() : null;

  if (sectionId === 'announcements') {
    return {
      ...form,
      routeOracleIds: form.routeOracleIds.split(',').map((value) => value.trim()).filter(Boolean).map(Number),
      audience: form.audience.split(',').map((value) => value.trim().toUpperCase()).filter(Boolean),
      publishedAt: dateOrNull(form.publishedAt),
      startsAt: dateOrNull(form.startsAt),
      endsAt: dateOrNull(form.endsAt),
      details: parseObject(form.details, 'Details'),
    };
  }
  if (sectionId === 'notifications') {
    return {
      ...form,
      recipientOracleId: numberOrNull(form.recipientOracleId),
      relatedTripOracleId: numberOrNull(form.relatedTripOracleId),
      details: parseObject(form.details, 'Details'),
    };
  }
  if (sectionId === 'tripMedia') {
    return {
      ...form,
      tripOracleId: numberOrNull(form.tripOracleId),
      metadata: parseObject(form.metadata, 'Metadata'),
    };
  }
  return {
    ...form,
    vehicleOracleId: numberOrNull(form.vehicleOracleId),
    expiresAt: dateOrNull(form.expiresAt),
    metadata: parseObject(form.metadata, 'Metadata'),
  };
}

export default function ContentManagement() {
  const [sectionId, setSectionId] = useState('announcements');
  const [records, setRecords] = useState({});
  const [form, setForm] = useState(emptyForm(sections.announcements));
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
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
    setForm(emptyForm(section));
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = buildPayload(sectionId, form);
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
    setForm(emptyForm(sections[nextSection]));
    setError('');
  };

  const beginEdit = (record) => {
    setEditingId(record.id);
    setForm(formFromRecord(section, record));
    setError('');
  };

  return (
    <section className="page">
      <PageHeader title="Announcements & media" subtitle="Create and update MongoDB records used by the customer portal" />
      <div className="content-tabs">
        {Object.entries(sections).map(([key, item]) => (
          <button key={key} type="button" onClick={() => selectSection(key)} aria-pressed={sectionId === key}>
            {item.title}
          </button>
        ))}
      </div>
      {error && <p className="content-error" role="alert">{error}</p>}
      <div className="content-management-grid">
        <form className="content-form" onSubmit={save}>
          <h2>{editingId ? `Edit ${section.title}` : `Add ${section.title}`}</h2>
          {section.fields.map(([name, label, type = 'text']) => (
            <label key={name}>
              {type === 'checkbox' ? (
                <span><input type="checkbox" checked={Boolean(form[name])} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.checked }))} /> {label}</span>
              ) : (
                <>
                  {label}
                  {type === 'textarea' ? (
                    <textarea rows="3" value={form[name]} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} />
                  ) : (
                    <input type={type} value={form[name]} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} />
                  )}
                </>
              )}
            </label>
          ))}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Create'}</button>
            {editingId && <button type="button" onClick={resetForm}>Cancel edit</button>}
          </div>
        </form>
        <section className="content-records" aria-label={`${section.title} records`}>
          <h2>{section.title} in MongoDB</h2>
          {(records[sectionId] || []).map((record) => (
            <article className="content-record" key={record.id}>
              <strong>{record.title || record.fileName || record.mediaType || 'Record'}</strong>
              <p>ID: {record.id}</p>
              <button type="button" onClick={() => beginEdit(record)}>Edit</button>
            </article>
          ))}
          {!records[sectionId]?.length && <p className="content-empty">No records in this collection yet.</p>}
        </section>
      </div>
    </section>
  );
}
