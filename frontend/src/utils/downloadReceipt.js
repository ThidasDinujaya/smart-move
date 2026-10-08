import { formatDateTime } from './formatters.js';

export default function downloadReceipt(payment, booking) {
  if (!payment) {
    return;
  }

  const lines = [
    'SmartMove Transport Solutions',
    'Payment Receipt',
    '',
    'Payment ID: ' + payment.id,
    'Booking ID: ' + payment.booking,
    'Passenger: ' + payment.passenger,
    'Route: ' + (booking?.route || ''),
    'Travel Date: ' + (booking?.date || ''),
    'Seats: ' + (booking?.seats || ''),
    'Amount: Rs. ' + Number(payment.amount || 0).toLocaleString('en-LK'),
    'Method: ' + payment.method,
    'Payment Date: ' + formatDateTime(payment.date),
    'Status: ' + payment.status,
  ].join('\n');
  const url = URL.createObjectURL(new Blob([lines], { type: 'text/plain' }));
  const link = document.createElement('a');

  link.href = url;
  link.download = 'SmartMove-' + payment.id + '-receipt.txt';
  link.click();
  URL.revokeObjectURL(url);
}
