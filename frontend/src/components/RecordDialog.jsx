import { useState } from 'react';
import Icon from './Icon.jsx';

const fieldsByType = {
  passenger: [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Contact' },
    { key: 'gender', label: 'Gender' },
    { key: 'status', label: 'Status' },
  ],
  booking: [
    { key: 'passenger', label: 'Passenger' },
    { key: 'route', label: 'Route' },
    { key: 'date', label: 'Trip Date', type: 'date' },
    { key: 'seats', label: 'Seats' },
    { key: 'amount', label: 'Total Amount', type: 'number' },
    { key: 'status', label: 'Status' },
  ],
  payment: [
    { key: 'booking', label: 'Booking ID' },
    { key: 'passenger', label: 'Passenger' },
    { key: 'amount', label: 'Amount', type: 'number' },
    { key: 'method', label: 'Method' },
    { key: 'status', label: 'Status' },
  ],
};

function toTitleCase(value) {
  return value
    .replace(/[A-Z]/g, (letter) => ' ' + letter)
    .replace(/^./, (letter) => letter.toUpperCase());
}

export default function RecordDialog({ data, onClose, onSave, onDelete }) {
  const { type, mode, item } = data;
  const [form, setForm] = useState({ ...item });
  const fields = fieldsByType[type] || [];
  const title = mode === 'add'
    ? 'Add ' + type
    : mode === 'edit'
      ? 'Edit ' + type
      : mode === 'delete'
        ? 'Delete ' + type
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
            <p>{mode === 'delete' ? 'This action cannot be undone.' : 'Review or update this record.'}</p>
          </div>
          <button className="close" type="button" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </header>

        {mode === 'view' && (
          <dl className="details">
            {Object.entries(item)
              .filter(([key]) => key !== 'id')
              .map(([key, value]) => (
                <div key={key}>
                  <dt>{toTitleCase(key)}</dt>
                  <dd>{String(value ?? '—')}</dd>
                </div>
              ))}
          </dl>
        )}

        {mode === 'delete' && (
          <p className="delete-message">Delete this {type} record?</p>
        )}

        {(mode === 'add' || mode === 'edit') && (
          <form className="dialog-form" onSubmit={submit}>
            {fields.map((field) => (
              <label key={field.key}>
                {field.label}
                <input
                  required
                  type={field.type || 'text'}
                  value={form[field.key] ?? ''}
                  onChange={(event) => updateField(field.key, event.target.value, field.type)}
                />
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
            <button className="danger" type="button" onClick={() => onDelete(item)}>Delete</button>
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
