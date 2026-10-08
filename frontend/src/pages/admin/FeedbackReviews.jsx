import Icon from '../../components/Icon.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import RecordsTable from '../../components/RecordsTable.jsx';
import SearchFilters from '../../components/SearchFilters.jsx';
import useRecordList from '../../hooks/useRecordList.js';

export default function FeedbackReviews({ reviews = [] }) {
  const records = reviews.map((review) => {
    const rating = Number(review.rating ?? review.score);
    const passengerName = review.passengerName ?? review.passenger?.name ?? review.name ?? '';
    const route = review.route ?? review.trip?.route ?? '';

    return {
      ...review,
      name: passengerName,
      route,
      score: Number.isFinite(rating) ? rating : null,
      status: Number.isFinite(rating) ? `${rating} stars` : '',
    };
  });
  const list = useRecordList(records);
  const ratedRecords = records.filter((review) => review.score !== null);
  const averageRating = ratedRecords.length
    ? (ratedRecords.reduce((total, review) => total + review.score, 0) / ratedRecords.length).toFixed(1)
    : '—';
  const positiveReviews = ratedRecords.filter((review) => review.score >= 4).length;
  const ratingFilters = [...new Set(ratedRecords.map((review) => review.status))];
  const columns = [
    { key: 'number', label: '#', render: (_record, index) => (list.page - 1) * 5 + index + 1 },
    { key: 'name', label: 'Passenger', className: 'strong' },
    { key: 'route', label: 'Route' },
    {
      key: 'rating',
      label: 'Rating',
      render: (record) => {
        const score = record.score || 0;
        return (
          <span className="rating-stars" aria-label={`${score} out of 5 stars`}>
            {Array.from({ length: 5 }, (_value, index) => (
              <Icon key={index} name="star" size={13} filled={index < score} />
            ))}
          </span>
        );
      },
    },
    { key: 'comment', label: 'Comment' },
    { key: 'date', label: 'Date' },
  ];

  return (
    <section className="page">
      <PageHeader title="Feedback & Reviews" subtitle="Passenger feedback and trip reviews" />

      <div className="stats-grid">
        <article className="stat-card pink">
          <Icon name="message" size={22} />
          <div><div className="stat-title">Reviews</div><div className="stat-value">{reviews.length}</div></div>
        </article>
        <article className="stat-card green">
          <Icon name="star" size={22} />
          <div><div className="stat-title">Average Rating</div><div className="stat-value">{averageRating}</div></div>
        </article>
        <article className="stat-card blue">
          <Icon name="thumbsUp" size={22} />
          <div><div className="stat-title">Positive Reviews</div><div className="stat-value">{positiveReviews}</div></div>
        </article>
      </div>

      <SearchFilters
        search={list.search}
        onSearchChange={list.setSearch}
        searchPlaceholder="Search passenger feedback..."
        status={list.status}
        onStatusChange={list.setStatus}
        statuses={ratingFilters}
        showDate={false}
      />
      <RecordsTable columns={columns} rows={list.visibleRecords} list={list} wide emptyMessage="No reviews found." />
    </section>
  );
}
