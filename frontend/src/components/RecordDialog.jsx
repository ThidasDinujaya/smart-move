import { useState } from 'react';
import Icon from './Icon.jsx';
import { formatRecordId, formatRecordReference } from '../utils/recordIds.js';

const fieldsByType = {
  passenger: [
    { key: 'fullName', label: 'Name' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Contact' },
    { key: 'nic', label: 'NIC', required: false },
    { key: 'gender', label: 'Gender', type: 'gender', required: false },
    { key: 'status', label: 'Status' },
  ],
  booking: [
    { key: 'passengerId', label: 'Passenger', type: 'passenger' },
    { key: 'tripId', label: 'Scheduled trip', type: 'trip' },
    { key: 'seats', label: 'Seat numbers (comma separated)' },
  ],
  payment: [
    { key: 'booking', label: 'Booking', type: 'booking' },
    { key: 'method', label: 'Payment method', type: 'method' },
  ],
};

function toTitleCase(value) {
  return value
    .replace(/[A-Z]/g, (letter) => ' ' + letter)
    .replace(/^./, (letter) => letter.toUpperCase());
}

export default function RecordDialog({ data, onClose, onSave, onDelete, passengers = [], trips = [], bookings = [] }) {
  const { type, mode, item } = data;
  const [form, setForm] = useState({ ...item });
  const fields = fieldsByType[type] || [];
  const isTripCancellation = type === 'trip' && mode === 'delete';
  const title = mode === 'add'
    ? 'Add ' + type
    : mode === 'edit'
      ? 'Edit ' + type
      : mode === 'delete'
        ? isTripCancellation ? 'Cancel trip' : 'Delete ' + type
        : type + ' details';

  function updateField(key, value, inputType) {
    setForm((current) => ({
      ...current,
      [key]: inputType === 'number' && value !== '' ? Number(value) : value,
    }));
  }

  function submit(event) {
    event.preventDefault();
    onSave(form);
  }

  return (
    <div
      className="shade"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <header>
          <div>
            <h2 id="dialog-title">{title}</h2>
            <p>{mode === 'delete'
              ? isTripCancellation ? 'This cancels the trip, its bookings, and tickets. Payment records will remain unchanged.' : 'This action cannot be undone.'
              : 'Review or update this record.'}</p>
          </div>
          <button className="close" type="button" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </header>

        {mode === 'view' && (
          <dl className="details">
            <div><dt>{toTitleCase(type)} ID</dt><dd>{formatRecordId(type, item.id)}</dd></div>
            {Object.entries(item)
              .filter(([key]) => key !== 'id')
              .map(([key, value]) => (
                <div key={key}>
                  <dt>{toTitleCase(key)}</dt>
                  <dd>{formatRecordReference(key, value) ?? String(value ?? '—')}</dd>
                </div>
              ))}
          </dl>
        )}

        {mode === 'delete' && (
          <p className="delete-message">{isTripCancellation ? 'Cancel this trip?' : `Delete this ${type} record?`}</p>
        )}

        {(mode === 'add' || mode === 'edit') && (
          <form className="dialog-form" onSubmit={submit}>
            {fields.map((field) => (
              <label key={field.key}>
                {field.label}
                {field.type === 'passenger' || field.type === 'trip' || field.type === 'booking' || field.type === 'method' || field.type === 'gender' ? (
                  <select required={field.required !== false} value={form[field.key] ?? ''} onChange={(event) => updateField(field.key, event.target.value, field.type === 'method' || field.type === 'gender' ? 'text' : 'number')}>
                    <option value="">Select {field.label.toLowerCase()}</option>
                    {(field.type === 'passenger' ? passengers : field.type === 'trip' ? trips : field.type === 'booking' ? bookings : field.type === 'gender' ? [
                      { id: 'Female', label: 'Female' }, { id: 'Male', label: 'Male' }, { id: 'Other', label: 'Other' },
                    ] : [
                      { id: 'Card', label: 'Card' }, { id: 'Bank Transfer', label: 'Bank Transfer' },
                      { id: 'eWallet', label: 'eWallet' }, { id: 'Cash', label: 'Cash' },
                    ]).map((option) => {
                      const value = field.type === 'method' ? option.id : option.id;
                      const label = field.type === 'passenger'
                        ? `${formatRecordId('passenger', option.id)} · ${option.fullName}`
                        : field.type === 'trip'
                          ? `${formatRecordId('trip', option.id)} · ${option.route} · ${option.date} · ${option.departure}`
                          : field.type === 'booking'
                            ? `${formatRecordId('booking', option.id)} · ${option.bookingReference} · ${option.passenger} · Rs. ${option.totalAmount}`
                            : option.label;
                      return <option key={value} value={value}>{label}</option>;
                    })}
                  </select>
                ) : (
                  <input
                    required={field.required !== false}
                    type={field.type || 'text'}
                    value={form[field.key] ?? ''}
                    onChange={(event) => updateField(field.key, event.target.value, field.type)}
                  />
                )}
              </label>
            ))}
            <div className="dialog-actions">
              <button className="secondary" type="button" onClick={onClose}>Cancel</button>
              <button className="primary" type="submit">
                {mode === 'add' ? 'Save' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {mode === 'delete' && (
          <div className="dialog-actions">
            <button className="secondary" type="button" onClick={onClose}>Cancel</button>
            <button className="danger" type="button" onClick={() => onDelete(item)}>{isTripCancellation ? 'Cancel trip' : 'Delete'}</button>
          </div>
        )}

        {mode === 'view' && (
          <div className="dialog-actions">
            <button className="primary" type="button" onClick={onClose}>Done</button>
          </div>
        )}
      </section>
    </div>
  );
}
