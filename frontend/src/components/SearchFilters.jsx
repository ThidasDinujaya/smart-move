import Icon from './Icon.jsx';

export default function SearchFilters({
  search,
  onSearchChange,
  searchPlaceholder,
  status,
  onStatusChange,
  statuses = [],
  route,
  onRouteChange,
  routes = [],
  showDate = true,
  date,
  onDateChange,
}) {
  return (
    <div className="filters">
      <label className="search-box">
        <Icon name="search" size={16} />
        <input
          type="search"
          aria-label={searchPlaceholder}
          placeholder={searchPlaceholder}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      {onRouteChange && (
        <select value={route} onChange={(event) => onRouteChange(event.target.value)}>
          <option value="">All Routes</option>
          {routes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      )}

      <select value={status} onChange={(event) => onStatusChange(event.target.value)}>
        <option value="">All Status</option>
        {statuses.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      {showDate && (
        <input
          className="date-filter"
          type="date"
          aria-label="Filter by date"
          value={date}
          onChange={(event) => onDateChange(event.target.value)}
        />
      )}
    </div>
  );
}
