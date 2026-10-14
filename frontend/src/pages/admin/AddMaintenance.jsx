import { useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';

const initialForm = {
  vehicleNo: '',
  type: '',
  date: '',
  nextService: '',
  description: '',
  cost: '',
  provider: '',
  status: '',
};

export default function AddMaintenance({ options = {}, onSave, onCancel }) {
  const [form, setForm] = useState(initialForm);
  const vehicles = options.vehicles || [];
  const types = options.types || [];
  const statuses = options.statuses || [];

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    onSave({
      ...form,
      cost: form.cost === '' ? '' : Number(form.cost),
    });
  }

  return (
    <section className="page form-page">
      <PageHeader title="Add Maintenance Record" subtitle="Enter maintenance details for the vehicle" />
      <form className="form-card form-grid" onSubmit={submit}>
        <label>
          Vehicle <b>*</b>
          {vehicles.length ? (
            <select name="vehicleNo" value={form.vehicleNo} onChange={updateField} required>
              <option value="">Select a vehicle</option>
              {vehicles.map((vehicle) => <option key={vehicle} value={vehicle}>{vehicle}</option>)}
            </select>
          ) : (
            <input name="vehicleNo" placeholder="Enter vehicle number" value={form.vehicleNo} onChange={updateField} required />
          )}
        </label>
        <label>
          Maintenance Type <b>*</b>
          {types.length ? (
            <select name="type" value={form.type} onChange={updateField} required>
              <option value="">Select a maintenance type</option>
              {types.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          ) : (
            <input name="type" placeholder="Enter maintenance type" value={form.type} onChange={updateField} required />
          )}
        </label>
        <label>
          Service Date <b>*</b>
          <input name="date" type="date" value={form.date} onChange={updateField} required />
        </label>
        <label>
          Next Service Date <b>*</b>
          <input name="nextService" type="date" value={form.nextService} onChange={updateField} required />
        </label>
        <label>
          Service Cost (Rs.)
          <input name="cost" type="number" min="0" step="0.01" value={form.cost} onChange={updateField} />
        </label>
        <label>
          Service Provider
          <input name="provider" value={form.provider} onChange={updateField} />
        </label>
        <label>
          Status
          {statuses.length ? (
            <select name="status" value={form.status} onChange={updateField} required>
              <option value="">Select a status</option>
              {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          ) : (
            <input name="status" placeholder="Enter status" value={form.status} onChange={updateField} required />
          )}
        </label>
        <label className="span-two">
          Description
          <textarea name="description" rows="3" value={form.description} onChange={updateField} />
        </label>
        <div className="form-actions span-two">
          <button className="primary" type="submit">Save Record</button>
          <button className="secondary" type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </section>
  );
}
