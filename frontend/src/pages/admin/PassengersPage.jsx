import ActionButtons from '../../components/ActionButtons.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import RecordsTable from '../../components/RecordsTable.jsx';
import SearchFilters from '../../components/SearchFilters.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import useRecordList from '../../hooks/useRecordList.js';

const statuses = ['Active', 'Inactive', 'Blocked'];

export default function PassengersPage({ passengers, onAdd, onOpen }) {
  const list = useRecordList(passengers);
  const columns = [
    { key: 'number', label: '#' , render: (_record, index) => (list.page - 1) * 5 + index + 1 },
    { key: 'name', label: 'Name', className: 'strong' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Contact' },
    { key: 'gender', label: 'Gender' },
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
        emptyMessage="No passenger records."
      />
    </section>
  );
}
