import Icon from './Icon.jsx';

export default function ActionButtons({ onView, onEdit, onDelete, onRefund }) {
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
          aria-label="Edit"
          title="Edit"
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
      {onRefund && (
        <button
          className="action-btn refund"
          type="button"
          aria-label="Refund payment"
          title="Refund payment"
          onClick={onRefund}
        >
          <Icon name="refund" size={15} />
        </button>
      )}
    </div>
  );
}
