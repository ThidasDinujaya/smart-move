import Icon from '../../components/Icon.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import RecordsTable from '../../components/RecordsTable.jsx';
import SearchFilters from '../../components/SearchFilters.jsx';
import useRecordList from '../../hooks/useRecordList.js';
import { formatRecordId } from '../../utils/recordIds.js';

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
  const ratingFilters = [...new Set(ratedRecords.map((review) => review.status))];
  const columns = [
    { key: 'id', label: 'Feedback ID', className: 'strong', render: (record) => formatRecordId('feedback', record.id) },
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
    { key: 'driverRating', label: 'Driver rating' },
    { key: 'vehicleRating', label: 'Vehicle rating' },
    { key: 'driverName', label: 'Driver' },
    { key: 'registrationNo', label: 'Vehicle' },
    { key: 'comment', label: 'Comment' },
    { key: 'date', label: 'Date' },
  ];

  return (
    <section className="page">
      <PageHeader title="Feedback & Reviews" subtitle="Passenger feedback and trip reviews" />

      <SearchFilters
        search={list.search}
        onSearchChange={list.setSearch}
        searchPlaceholder="Search passenger feedback..."
        status={list.status}
        onStatusChange={list.setStatus}
        statuses={ratingFilters}
        statusLabel="Ratings"
        showDate={false}
      />
      <RecordsTable columns={columns} rows={list.visibleRecords} list={list} wide emptyMessage="No reviews found." />
    </section>
  );
}
