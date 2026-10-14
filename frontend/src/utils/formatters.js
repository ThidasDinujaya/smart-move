export function formatMoney(amount) {
  if (amount === '' || amount === null || amount === undefined) {
    return '—';
  }

  return 'Rs. ' + Number(amount).toLocaleString('en-LK');
}

export function formatDate(value) {
  if (!value) {
    return '—';
  }

  return new Date(value + 'T00:00:00').toLocaleDateString('en-CA');
}

export function formatDateTime(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('en-LK');
}

export function matchesSearch(record, query) {
  if (!query) {
    return true;
  }

  return Object.values(record)
    .join(' ')
    .toLowerCase()
    .includes(query.toLowerCase());
}
