import ActionButtons from '../../components/ActionButtons.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import RecordsTable from '../../components/RecordsTable.jsx';
import SearchFilters from '../../components/SearchFilters.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import useRecordList from '../../hooks/useRecordList.js';
import { formatDateTime, formatMoney } from '../../utils/formatters.js';

export default function PaymentsPage({ payments = [], onAdd, onView, onRefund }) {
  const list = useRecordList(payments);
  const statuses = [...new Set(payments.map((record) => record.status).filter(Boolean))];
  const columns = [
    { key: 'number', label: '#', render: (_record, index) => (list.page - 1) * 5 + index + 1 },
    { key: 'id', label: 'Payment ID', className: 'strong' },
    { key: 'booking', label: 'Booking ID' },
    { key: 'passenger', label: 'Passenger' },
    { key: 'amount', label: 'Amount', render: (record) => formatMoney(record.amount) },
    { key: 'method', label: 'Method' },
    { key: 'status', label: 'Status', render: (record) => <StatusBadge>{record.status}</StatusBadge> },
    { key: 'refundedAt', label: 'Refunded at', render: (record) => formatDateTime(record.refundedAt) },
    {
      key: 'actions',
      label: 'Actions',
      render: (record) => (
        <ActionButtons
          onView={() => onView?.(record)}
          onRefund={String(record.status || '').toLowerCase() === 'successful' && !record.refundedAt
            ? () => onRefund?.(record)
            : undefined}
        />
      ),
    },
  ];

  return (
    <section className="page payments-page">
      <PageHeader
        title="Payment Processing"
        subtitle="Manage ticket payments"
        actionLabel="Add Payment"
        onAction={onAdd}
      />
      <SearchFilters
        search={list.search}
        onSearchChange={list.setSearch}
        searchPlaceholder="Search payment..."
        status={list.status}
        onStatusChange={list.setStatus}
        statuses={statuses}
        date={list.date}
        onDateChange={list.setDate}
      />
      <RecordsTable columns={columns} rows={list.visibleRecords} list={list} wide emptyMessage="No payment records." />
    </section>
  );
}
