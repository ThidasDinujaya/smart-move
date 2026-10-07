import ActionButtons from '../../components/ActionButtons.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import RecordsTable from '../../components/RecordsTable.jsx';
import SearchFilters from '../../components/SearchFilters.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import useRecordList from '../../hooks/useRecordList.js';
import { formatMoney } from '../../utils/formatters.js';

const statuses = ['Paid', 'Pending', 'Failed'];

export default function PaymentsPage({ payments, onAdd, onOpen, onOpenReceipt }) {
  const list = useRecordList(payments);
  const columns = [
    { key: 'number', label: '#', render: (_record, index) => (list.page - 1) * 5 + index + 1 },
    { key: 'id', label: 'Payment ID', className: 'strong' },
    { key: 'booking', label: 'Booking ID' },
    { key: 'passenger', label: 'Passenger' },
    { key: 'amount', label: 'Amount', render: (record) => formatMoney(record.amount) },
    { key: 'method', label: 'Method' },
    { key: 'status', label: 'Status', render: (record) => <StatusBadge>{record.status}</StatusBadge> },
    {
      key: 'actions',
      label: 'Actions',
      render: (record) => (
        <ActionButtons
          onView={() => onOpenReceipt(record)}
          onEdit={() => onOpen('payment', 'edit', record)}
          onDelete={() => onOpen('payment', 'delete', record)}
        />
      ),
    },
  ];

  const emptyMessage = (
    <>
      No payments yet.{' '}
      <button className="text-button" type="button" onClick={() => onOpenReceipt(null)}>
        Preview receipt
      </button>
    </>
  );

  return (
    <section className="page">
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
      <RecordsTable columns={columns} rows={list.visibleRecords} list={list} emptyMessage={emptyMessage} />
    </section>
  );
}
