export default function StatusBadge({ children }) {
  const statusClass = String(children || '').toLowerCase().replace(/\s+/g, '-');

  return <span className={'badge ' + statusClass}>{children}</span>;
}
