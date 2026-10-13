import PageHeader from '../../components/PageHeader.jsx';
import Icon from '../../components/Icon.jsx';
import RecordsTable from '../../components/RecordsTable.jsx';
import SearchFilters from '../../components/SearchFilters.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import ActionButtons from '../../components/ActionButtons.jsx';
import useRecordList from '../../hooks/useRecordList.js';

export default function MaintenanceManagement({ records = [], statuses: availableStatuses = [], onAdd, onView, onEdit, onDelete }) {
  const list = useRecordList(records);
  const statuses = [...new Set([
    ...availableStatuses,
    ...records.map((record) => record.status).filter(Boolean),
  ])];
  const columns = [
    { key: 'number', label: '#', render: (_record, index) => (list.page - 1) * 5 + index + 1 },
    { key: 'vehicleNo', label: 'Vehicle No', className: 'strong' },
    { key: 'type', label: 'Maintenance Type' },
    { key: 'date', label: 'Date' },
    { key: 'nextService', label: 'Next Service' },
    { key: 'status', label: 'Status', render: (record) => <StatusBadge>{record.status}</StatusBadge> },
    {
      key: 'actions',
      label: 'Actions',
      render: (record) => (
        <ActionButtons
          onView={() => onView?.(record)}
          onEdit={() => onEdit?.(record)}
          onDelete={() => onDelete?.(record)}
        />
      ),
    },
  ];
  const countByStatus = (status) => records.filter((record) => record.status === status).length;
  const dueCount = records.filter((record) => ['pending', 'overdue'].includes(
    String(record.status || '').toLowerCase(),
  )).length;

  return (
    <section className="page maintenance-page">
      <PageHeader
        title="Maintenance Management"
        subtitle="Manage vehicle maintenance records"
        actionLabel="Add Maintenance"
        onAction={onAdd}
      />

      <div className="stats-grid">
        <article className="stat-card blue">
          <Icon name="bus" size={22} />
          <div><div className="stat-title">Total Records</div><div className="stat-value">{records.length}</div></div>
        </article>
        <article className="stat-card orange">
          <Icon name="wrench" size={22} />
          <div><div className="stat-title">Due for Service</div><div className="stat-value">{dueCount}</div></div>
        </article>
        <article className="stat-card green">
          <Icon name="check" size={22} />
          <div><div className="stat-title">Completed</div><div className="stat-value">{countByStatus('Completed')}</div></div>
        </article>
      </div>

      <SearchFilters
        search={list.search}
        onSearchChange={list.setSearch}
        searchPlaceholder="Search maintenance records..."
        status={list.status}
        onStatusChange={list.setStatus}
        statuses={statuses}
        showDate={false}
      />
      <RecordsTable columns={columns} rows={list.visibleRecords} list={list} wide emptyMessage="No maintenance records found." />
    </section>
  );
}
