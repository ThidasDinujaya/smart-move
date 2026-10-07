import EmptyTableRow from './EmptyTableRow.jsx';
import Pagination from './Pagination.jsx';

export default function RecordsTable({
  columns,
  rows,
  emptyMessage,
  list,
  wide = false,
}) {
  return (
    <div className="table-card">
      <div className="scroll">
        <table className={wide ? 'wide' : ''}>
          <thead>
            <tr>
              {columns.map((column) => <th key={column.key}>{column.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <EmptyTableRow columns={columns.length}>{emptyMessage}</EmptyTableRow>
            ) : rows.map((record, index) => (
              <tr key={record.id}>
                {columns.map((column) => (
                  <td key={column.key} className={column.className || ''}>
                    {column.render
                      ? column.render(record, index)
                      : record[column.key] || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        itemCount={list.records.length}
        page={list.page}
        pageSize={5}
        onPageChange={list.setPage}
      />
    </div>
  );
}
