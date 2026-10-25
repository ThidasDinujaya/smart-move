import { useState } from 'react';
import PageHeader from './PageHeader.jsx';
import { formatRecordId } from '../utils/recordIds.js';

const fieldsByType = {
  passenger: [
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Contact Number', type: 'tel' },
    { key: 'nic', label: 'NIC', required: false },
    { key: 'gender', label: 'Gender', type: 'gender', required: false },
    { key: 'status', label: 'Status', type: 'passengerStatus' },
  ],
  payment: [
    { key: 'booking', label: 'Booking', type: 'booking' },
    { key: 'method', label: 'Payment Method', type: 'method' },
  ],
};

const paymentMethods = ['Card', 'Bank Transfer', 'eWallet', 'Cash'];
const genders = ['Female', 'Male', 'Other'];
const passengerStatuses = ['Active', 'Inactive'];

function optionsForField(field, options) {
  if (field.type === 'passenger') return options.passengers || [];
  if (field.type === 'booking') return options.bookings || [];
  if (field.type === 'gender') return genders;
  if (field.type === 'method') return paymentMethods;
  if (field.type === 'passengerStatus') return passengerStatuses;
  return [];
}

function optionValue(field, option) {
  if (['gender', 'method', 'passengerStatus'].includes(field.type)) return option;
  return option.id;
}

function optionLabel(field, option) {
  if (field.type === 'passenger') return `${formatRecordId('passenger', option.id)} · ${option.fullName}`;
  if (field.type === 'booking') return `${formatRecordId('booking', option.id)} · ${option.bookingReference} · ${option.passenger} · Rs. ${option.totalAmount}`;
  return option;
}

export default function AdminRecordForm({
  type,
  mode = 'add',
  item,
  options = {},
  canManagePassword = false,
  onSave,
  onCancel,
}) {
  const [form, setForm] = useState(() => ({ ...item }));
  const [saving, setSaving] = useState(false);
  const fields = [...(fieldsByType[type] || [])];
  if (type === 'passenger' && (mode === 'add' || canManagePassword)) {
    fields.push({
      key: 'password',
      label: mode === 'add' ? 'Initial Password' : 'New Password',
      type: 'password',
      required: mode === 'add',
      placeholder: mode === 'edit' ? 'Leave blank to keep the current password' : '',
    });
  }
  const recordName = { passenger: 'Passenger', booking: 'Booking', payment: 'Payment' }[type] || 'Record';
  const title = `${mode === 'edit' ? 'Edit' : 'Add'} ${recordName}`;
  const subtitle = type === 'passenger' ? 'Enter passenger information' : 'Record a payment for a pending booking';

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
    } catch (error) {
      window.alert(error.message || `Unable to save ${type}.`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="page form-page admin-record-form-page">
      <PageHeader title={title} subtitle={subtitle} />
      <form className="form-card form-grid" onSubmit={submit}>
        {fields.map((field) => {
          const fieldOptions = optionsForField(field, options);
          const isSelect = fieldOptions.length > 0 || ['passenger', 'booking', 'gender', 'method', 'passengerStatus'].includes(field.type);
          const emptyLabel = fieldOptions.length
            ? `Select ${field.label.toLowerCase()}`
            : field.type === 'booking'
              ? 'No bookings awaiting payment'
            : field.type === 'passenger'
              ? 'No passengers available'
              : `Select ${field.label.toLowerCase()}`;

          return (
            <label key={field.key}>
              <span>{field.label}{field.required !== false && <> <b>*</b></>}</span>
              {isSelect ? (
                <select
                  name={field.key}
                  value={form[field.key] ?? ''}
                  onChange={updateField}
                  required={field.required !== false}
                  disabled={['passenger', 'booking'].includes(field.type) && fieldOptions.length === 0}
                >
                  <option value="">{emptyLabel}</option>
                  {fieldOptions.map((option) => {
                    const value = optionValue(field, option);
                    return <option key={value} value={value}>{optionLabel(field, option)}</option>;
                  })}
                </select>
              ) : (
                <input
                  name={field.key}
                  type={field.type || 'text'}
                  value={form[field.key] ?? ''}
                  placeholder={field.placeholder || ''}
                  onChange={updateField}
                  required={field.required !== false}
                  minLength={field.key === 'password' ? 8 : undefined}
                  maxLength={field.key === 'password' ? 128 : undefined}
                  autoComplete={field.key === 'password' ? 'new-password' : undefined}
                />
              )}
            </label>
          );
        })}
        <div className="form-actions span-two">
          <button className="primary" type="submit" disabled={saving}>
            {saving ? 'Saving…' : mode === 'edit' ? 'Update Record' : 'Save Record'}
          </button>
          <button className="secondary" type="button" onClick={onCancel} disabled={saving}>Cancel</button>
        </div>
      </form>
    </section>
  );
}
