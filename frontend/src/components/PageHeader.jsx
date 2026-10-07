import Icon from './Icon.jsx';

export default function PageHeader({ title, subtitle, actionLabel, onAction }) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {actionLabel && (
        <button className="primary" type="button" onClick={onAction}>
          <Icon name="plus" size={16} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
