import ActionButtons from '../../components/ActionButtons.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import RecordsTable from '../../components/RecordsTable.jsx';
import SearchFilters from '../../components/SearchFilters.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import useRecordList from '../../hooks/useRecordList.js';
import { formatDateTime } from '../../utils/formatters.js';
import { formatRecordId } from '../../utils/recordIds.js';

export default function PassengersPage({ passengers = [], onAdd, onOpen }) {
  const list = useRecordList(passengers);
  const statuses = [...new Set(passengers.map((record) => record.status).filter(Boolean))];
  const columns = [
    { key: 'id', label: 'Passenger ID', className: 'strong', render: (record) => formatRecordId('passenger', record.id) },
    { key: 'name', label: 'Name', className: 'strong' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Contact' },
    { key: 'nic', label: 'NIC' },
    { key: 'gender', label: 'Gender' },
    { key: 'registeredAt', label: 'Registered', render: (record) => formatDateTime(record.registeredAt) },
    { key: 'status', label: 'Status', render: (record) => <StatusBadge>{record.status}</StatusBadge> },
    {
      key: 'actions',
      label: 'Actions',
      render: (record) => (
        <ActionButtons
          onView={() => onOpen('passenger', 'view', record)}
          onEdit={() => onOpen('passenger', 'edit', record)}
          onDelete={() => onOpen('passenger', 'delete', record)}
        />
      ),
    },
  ];

  return (
    <section className="page">
      <PageHeader
        title="Passenger Management"
        subtitle="Manage passenger information"
        actionLabel="Add Passenger"
        onAction={onAdd}
      />
      <SearchFilters
        search={list.search}
        onSearchChange={list.setSearch}
        searchPlaceholder="Search passenger..."
        status={list.status}
        onStatusChange={list.setStatus}
        statuses={statuses}
        showDate={false}
      />
      <RecordsTable
        columns={columns}
        rows={list.visibleRecords}
        list={list}
        wide
        emptyMessage="No passenger records."
      />
    </section>
  );
}
