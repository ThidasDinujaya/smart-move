import PageHeader from '../../components/PageHeader.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { formatDate, formatDateTime, formatMoney } from '../../utils/formatters.js';
import { formatRecordId } from '../../utils/recordIds.js';

const detailsByType = {
  passenger: (record) => [
    ['Passenger ID', formatRecordId('passenger', record.id)],
    ['Full Name', record.fullName || record.name],
    ['Email', record.email],
    ['Contact Number', record.phone],
    ['NIC', record.nic],
    ['Gender', record.gender],
    ['Registered On', formatDateTime(record.registeredAt)],
    ['Status', record.status],
  ],
  booking: (record) => [
    ['Booking ID', formatRecordId('booking', record.id)],
    ['Booking Reference', record.bookingReference],
    ['Passenger', record.passenger],
    ['Route', record.route],
    ['Trip Date', formatDate(record.date)],
    ['Seats', record.seats],
    ['Total Amount', formatMoney(record.totalAmount ?? record.amount)],
    ['Status', record.status],
  ],
  payment: (record, booking) => [
    ['Payment ID', formatRecordId('payment', record.id)],
    ['Booking ID', formatRecordId('booking', record.bookingId ?? record.booking)],
    ['Passenger', record.passenger],
    ['Route', booking?.route || record.route],
    ['Travel Date', formatDate(booking?.date)],
    ['Seats', booking?.seats],
    ['Amount', formatMoney(record.amount)],
    ['Payment Method', record.method || record.paymentMethod],
    ['Payment Date', formatDateTime(record.date || record.paymentDate)],
    ['Status', record.status || record.paymentStatus],
  ],
};

const titles = {
  passenger: 'Passenger Details',
  booking: 'Booking Details',
  payment: 'Payment Details',
};
const typeLabels = { passenger: 'Passenger', booking: 'Booking', payment: 'Payment' };

export default function AdminRecordDetailsPage({ type, record, booking, onBack, onEdit, onDownload }) {
  if (!record) {
    return (
      <section className="page form-page admin-record-details-page">
        <PageHeader title={`${titles[type] || 'Record Details'} Unavailable`} subtitle="Return to the list and select a record." />
        <button className="secondary" type="button" onClick={onBack}>Back to List</button>
      </section>
    );
  }

  const details = detailsByType[type]?.(record, booking) || [];
  const summary = type === 'passenger'
    ? record.fullName || record.name
    : type === 'booking'
      ? record.bookingReference || formatRecordId('booking', record.id)
      : formatRecordId('payment', record.id);

  return (
    <section className="page form-page admin-record-details-page">
      <PageHeader
        title={titles[type] || 'Record Details'}
        subtitle={`View complete ${type} information`}
        actionLabel={onEdit ? `Edit ${typeLabels[type] || 'Record'}` : undefined}
        onAction={onEdit}
      />
      <article className="admin-record-details-card">
        <div className="admin-record-details-summary">
          <div>
            <h2>{summary}</h2>
            <p>Record ID: {formatRecordId(type, record.id)}</p>
          </div>
          {(record.status || record.paymentStatus) && (
            <StatusBadge>{record.status || record.paymentStatus}</StatusBadge>
          )}
        </div>
        <dl className="admin-record-details-grid">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value === null || value === undefined || value === '' ? '—' : value}</dd>
            </div>
          ))}
        </dl>
        <div className="admin-record-details-actions">
          <button className="secondary" type="button" onClick={onBack}>Back to List</button>
          {onDownload && (
            <button className="primary" type="button" onClick={onDownload}>Download Receipt</button>
          )}
        </div>
      </article>
    </section>
  );
}
