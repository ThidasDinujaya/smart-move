import Icon from './Icon.jsx';

export default function ActionButtons({ onView, onEdit, editDisabled = false, onDelete }) {
  return (
    <div className="actions">
      {onView && (
        <button
          className="action-btn"
          type="button"
          aria-label="View"
          title="View"
          onClick={onView}
        >
          <Icon name="eye" size={15} />
        </button>
      )}
      {onEdit && (
        <button
          className="action-btn edit"
          type="button"
          aria-label={editDisabled ? 'Edit unavailable for this booking status' : 'Edit'}
          title={editDisabled ? 'Only pending payment bookings can be edited' : 'Edit'}
          disabled={editDisabled}
          onClick={onEdit}
        >
          <Icon name="edit" size={15} />
        </button>
      )}
      {onDelete && (
        <button
          className="action-btn remove"
          type="button"
          aria-label="Delete"
          title="Delete"
          onClick={onDelete}
        >
          <Icon name="trash" size={15} />
        </button>
      )}
    </div>
  );
}
