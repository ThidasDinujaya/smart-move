const ID_PREFIXES = {
  booking: 'B',
  driver: 'D',
  feedback: 'F',
  maintenance: 'M',
  passenger: 'PAS',
  payment: 'PAY',
  route: 'R',
  ticket: 'TI',
  trip: 'T',
  user: 'U',
  vehicle: 'V',
};

const REFERENCE_ID_TYPES = {
  bookingid: 'booking',
  driverid: 'driver',
  feedbackid: 'feedback',
  maintenanceid: 'maintenance',
  passengerid: 'passenger',
  recipientoracleid: 'passenger',
  uploadedbyoracleid: 'passenger',
  paymentid: 'payment',
  routeid: 'route',
  routeoracleid: 'route',
  routeoracleids: 'route',
  ticketid: 'ticket',
  tripid: 'trip',
  triporacleid: 'trip',
  relatedtriporacleid: 'trip',
  vehicleid: 'vehicle',
  vehicleoracleid: 'vehicle',
  userid: 'user',
};

export function formatRecordId(type, id) {
  if (id == null || id === '') return '—';
  const prefix = ID_PREFIXES[type] || String(type || '').slice(0, 1).toUpperCase();
  return `${prefix}${id}`;
}

export function formatRecordReference(fieldName, value) {
  const type = REFERENCE_ID_TYPES[String(fieldName || '').toLowerCase().replace(/[^a-z0-9]/g, '')];
  if (!type || value == null || value === '') return null;
  if (Array.isArray(value)) return value.map((id) => formatRecordId(type, id)).join(', ');
  return formatRecordId(type, value);
}
