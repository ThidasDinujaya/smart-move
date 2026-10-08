import ActionButtons from '../../components/ActionButtons.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import RecordsTable from '../../components/RecordsTable.jsx';
import SearchFilters from '../../components/SearchFilters.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import useRecordList from '../../hooks/useRecordList.js';
import { formatDate, formatMoney } from '../../utils/formatters.js';

const statuses = ['Confirmed', 'Pending', 'Cancelled'];

export default function BookingsPage({ bookings, routes, onAdd, onOpen }) {
  const list = useRecordList(bookings, { filterRoute: true });
  const columns = [
    { key: 'number', label: '#', render: (_record, index) => (list.page - 1) * 5 + index + 1 },
    { key: 'id', label: 'Booking ID', className: 'strong' },
    { key: 'passenger', label: 'Passenger' },
    { key: 'route', label: 'Route' },
    { key: 'date', label: 'Trip Date', render: (record) => formatDate(record.date) },
    { key: 'seats', label: 'Seats' },
    { key: 'amount', label: 'Total Amount', render: (record) => formatMoney(record.amount) },
    { key: 'status', label: 'Status', render: (record) => <StatusBadge>{record.status}</StatusBadge> },
    {
      key: 'actions',
      label: 'Actions',
      render: (record) => (
        <ActionButtons
          onView={() => onOpen('booking', 'view', record)}
          onEdit={() => onOpen('booking', 'edit', record)}
          onDelete={() => onOpen('booking', 'delete', record)}
        />
      ),
    },
  ];

  return (
    <section className="page">
      <PageHeader
        title="Ticket Booking"
        subtitle="Create and manage ticket reservations"
        actionLabel="Add Booking"
        onAction={onAdd}
      />
      <SearchFilters
        search={list.search}
        onSearchChange={list.setSearch}
        searchPlaceholder="Search booking..."
        status={list.status}
        onStatusChange={list.setStatus}
        statuses={statuses}
        route={list.route}
        onRouteChange={list.setRoute}
        routes={routes}
        date={list.date}
        onDateChange={list.setDate}
      />
      <RecordsTable columns={columns} rows={list.visibleRecords} list={list} wide emptyMessage="No bookings yet." />
    </section>
  );
}
