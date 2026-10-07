import Icon from './Icon.jsx';

export default function Pagination({ itemCount, page, pageSize, onPageChange }) {
  const pageCount = Math.ceil(itemCount / pageSize);
  const firstItem = itemCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, itemCount);
  const firstPage = Math.floor((page - 1) / 5) * 5 + 1;
  const visiblePageCount = Math.min(5, pageCount - firstPage + 1);
  const pages = Array.from({ length: visiblePageCount }, (_, index) => firstPage + index);

  return (
    <div className="pager">
      <span>
        {itemCount === 0
          ? 'No records'
          : 'Showing ' + firstItem + '–' + lastItem + ' of ' + itemCount}
      </span>
      {pageCount > 1 && (
        <div>
          {pages.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              className={pageNumber === page ? 'selected' : ''}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          <button
            type="button"
            aria-label="Next page"
            disabled={page >= pageCount}
            onClick={() => onPageChange(Math.min(page + 1, pageCount))}
          >
            <Icon name="chevronRight" size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
