export default function EmptyTableRow({ columns, children = 'No records found.' }) {
  return (
    <tr>
      <td className="empty" colSpan={columns}>
        {children}
      </td>
    </tr>
  );
}
