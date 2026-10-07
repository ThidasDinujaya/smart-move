import { useEffect, useMemo, useState } from 'react';
import { matchesSearch } from '../utils/formatters.js';

const PAGE_SIZE = 5;

export default function useRecordList(records, { filterRoute = false } = {}) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [route, setRoute] = useState('');
  const [date, setDate] = useState('');
  const [page, setPage] = useState(1);

  const filteredRecords = useMemo(() => records.filter((record) => {
    const matchesStatus = !status || record.status === status;
    const matchesRoute = !filterRoute || !route || record.route === route;
    const matchesDate = !date || String(record.date || '').startsWith(date);

    return matchesStatus && matchesRoute && matchesDate && matchesSearch(record, search);
  }), [date, filterRoute, records, route, search, status]);

  const pageCount = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const visibleRecords = filteredRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, pageCount));
  }, [pageCount]);

  function updateFilter(setter, value) {
    setter(value);
    setPage(1);
  }

  function clearFilters() {
    setSearch('');
    setStatus('');
    setRoute('');
    setDate('');
    setPage(1);
  }

  return {
    search,
    status,
    route,
    date,
    page,
    pageCount,
    records: filteredRecords,
    visibleRecords,
    setSearch: (value) => updateFilter(setSearch, value),
    setStatus: (value) => updateFilter(setStatus, value),
    setRoute: (value) => updateFilter(setRoute, value),
    setDate: (value) => updateFilter(setDate, value),
    setPage,
    clearFilters,
  };
}
