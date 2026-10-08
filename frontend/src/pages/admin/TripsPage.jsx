import ActionButtons from '../../components/ActionButtons.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import RecordsTable from '../../components/RecordsTable.jsx';
import SearchFilters from '../../components/SearchFilters.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import useRecordList from '../../hooks/useRecordList.js';
import { formatDate } from '../../utils/formatters.js';

export default function TripsPage({ trips, routes, statuses, onAdd, onOpen, onEdit }) {
  const list = useRecordList(trips, { filterRoute: true });
  const tripStatuses = statuses || [...new Set(trips.map((record) => record.status).filter(Boolean))];
  const columns = [
    { key: 'number', label: '#', render: (_record, index) => (list.page - 1) * 5 + index + 1 },
    { key: 'route', label: 'Route', className: 'strong' },
    { key: 'vehicle', label: 'Vehicle' },
    { key: 'driver', label: 'Driver' },
    { key: 'date', label: 'Date', render: (record) => formatDate(record.date) },
    { key: 'departure', label: 'Departure Time' },
    { key: 'arrival', label: 'Arrival Time' },
    { key: 'seats', label: 'Seats' },
    { key: 'fare', label: 'Fare (Rs.)' },
    { key: 'status', label: 'Status', render: (record) => <StatusBadge>{record.status}</StatusBadge> },
    {
      key: 'actions',
      label: 'Actions',
      render: (record) => (
        <ActionButtons
          onView={() => onOpen('trip', 'view', record)}
          onEdit={() => onEdit(record)}
          onDelete={() => onOpen('trip', 'delete', record)}
        />
      ),
    },
  ];

  return (
    <section className="page">
      <PageHeader
        title="Trip Scheduling"
        subtitle="Manage and schedule trips"
        actionLabel="Add Trip"
        onAction={onAdd}
      />
      <SearchFilters
        search={list.search}
        onSearchChange={list.setSearch}
        searchPlaceholder="Search trips..."
        status={list.status}
        onStatusChange={list.setStatus}
        statuses={tripStatuses}
        route={list.route}
        onRouteChange={list.setRoute}
        routes={routes}
        date={list.date}
        onDateChange={list.setDate}
      />
      <RecordsTable columns={columns} rows={list.visibleRecords} list={list} wide emptyMessage="No trips scheduled." />
    </section>
  );
}
