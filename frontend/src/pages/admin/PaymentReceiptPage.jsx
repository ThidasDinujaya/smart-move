import Icon from '../../components/Icon.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import { formatDate, formatDateTime, formatMoney } from '../../utils/formatters.js';

export default function PaymentReceiptPage({ receipt, booking, onDownload, onBack }) {
  const receiptFields = [
    ['Payment ID', receipt?.id || '—'],
    ['Booking ID', receipt?.booking || '—'],
    ['Passenger', receipt?.passenger || '—'],
    ['Route', booking?.route || '—'],
    ['Travel Date', formatDate(booking?.date)],
    ['Seats', booking?.seats || '—'],
    ['Amount', receipt ? formatMoney(receipt.amount) : '—'],
    ['Payment Method', receipt?.method || '—'],
    ['Payment Date', formatDateTime(receipt?.date)],
  ];

  return (
    <section className="page receipt-page">
      <PageHeader title="Payment Receipt" subtitle="Receipt details" />
      <article className="receipt">
        <div className="receipt-brand">
          <Icon name="bus" size={27} />
          <span><b>SmartMove</b><small>Transport Solutions</small></span>
        </div>
        <div className="success">
          <span><Icon name={receipt?.status === 'Paid' ? 'check' : 'card'} size={23} /></span>
          <b>
            {receipt
              ? receipt.status === 'Paid' ? 'Payment Successful!' : receipt.status
              : 'Receipt Preview'}
          </b>
        </div>
        <hr />
        <dl>
          {receiptFields.map(([label, value]) => (
            <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
          ))}
          <div><dt>Status</dt><dd>{receipt ? <StatusBadge>{receipt.status}</StatusBadge> : '—'}</dd></div>
        </dl>
        <div className="receipt-actions">
          <button className="primary" type="button" onClick={onDownload} disabled={!receipt}>
            <Icon name="download" size={15} /> Download Receipt
          </button>
          <button className="secondary" type="button" onClick={onBack}>Back to Bookings</button>
        </div>
      </article>
    </section>
  );
}
