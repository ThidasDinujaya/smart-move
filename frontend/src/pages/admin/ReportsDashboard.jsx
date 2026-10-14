import { useState } from 'react';
import Icon from '../../components/Icon.jsx';
import PageHeader from '../../components/PageHeader.jsx';
import { api } from '../../api/client.js';
import '../../styles/ReportsDashboard.css';

const reportOptions = [
  { key: 'routeBookings', title: 'Route Bookings', hint: 'Shows each route and the number of tickets booked.' },
  { key: 'revenue', title: 'Revenue', hint: 'Shows total successful payment revenue for the selected date range.' },
  { key: 'passengerTrips', title: 'Passenger Trips', hint: 'Shows trip dates, routes, booking statuses, seat counts, and fares for each passenger booking.' },
  { key: 'maintenanceDue', title: 'Maintenance Due', hint: 'Lists vehicles with service due in the selected period, including service type, due date, and status.' },
  { key: 'feedbackSummary', title: 'Feedback Summary', hint: 'Shows the review count and average rating for each route.' },
];

const reportColumns = {
  routeBookings: [
    { key: 'routeNo', label: 'Route no.' },
    { key: 'routeName', label: 'Route' },
    { key: 'tickets', label: 'Tickets', align: 'right' },
  ],
  revenue: [
    { key: 'metric', label: 'Revenue metric' },
    { key: 'amount', label: 'Amount', align: 'right' },
  ],
  passengerTrips: [
    { key: 'bookingReference', label: 'Booking reference' },
    { key: 'route', label: 'Route' },
    { key: 'tripDate', label: 'Trip date' },
    { key: 'status', label: 'Booking status' },
    { key: 'seats', label: 'Seats', align: 'right' },
    { key: 'amount', label: 'Fare', align: 'right' },
  ],
  maintenanceDue: [
    { key: 'vehicleNo', label: 'Vehicle' },
    { key: 'serviceType', label: 'Service' },
    { key: 'dueDate', label: 'Due date' },
    { key: 'status', label: 'Status' },
  ],
  feedbackSummary: [
    { key: 'routeName', label: 'Route' },
    { key: 'reviews', label: 'Reviews', align: 'right' },
    { key: 'averageRating', label: 'Average rating', align: 'right' },
  ],
};

function parseReportLines(type, lines) {
  const noDataMessage = lines.find((line) => /^No .+ (?:found|were found|are due)/i.test(line.trim()));

  if (noDataMessage) return { rows: [], emptyMessage: noDataMessage };

  const rows = lines.map((line, index) => {
    const parts = line.split(' | ');

    if (type === 'routeBookings') {
      const ticketMatch = parts[2]?.match(/^tickets:\s*(.*)$/i);
      return parts.length >= 3
        ? { id: index, routeNo: parts[0], routeName: parts[1], tickets: ticketMatch?.[1] ?? parts[2] }
        : { id: index, routeNo: '—', routeName: line, tickets: '—' };
    }

    if (type === 'revenue') {
      const revenueMatch = line.match(/^Successful revenue:\s*(.*)$/i);
      return { id: index, metric: 'Successful revenue', amount: revenueMatch?.[1] ?? line };
    }

    if (type === 'passengerTrips') {
      const seatMatch = parts[4]?.match(/^seats:\s*(.*)$/i);
      const amountMatch = parts[5]?.match(/^LKR\s*(.*)$/i);
      return {
        id: index,
        bookingReference: parts[0] || '—',
        route: parts[1] || '—',
        tripDate: parts[2] || '—',
        status: parts[3] || '—',
        seats: seatMatch?.[1] ?? parts[4] ?? '—',
        amount: amountMatch ? `LKR ${amountMatch[1]}` : parts[5] || '—',
      };
    }

    if (type === 'maintenanceDue') {
      const dueMatch = parts[2]?.match(/^due:\s*(.*)$/i);
      return {
        id: index,
        vehicleNo: parts[0] || '—',
        serviceType: parts[1] || '—',
        dueDate: dueMatch?.[1] ?? parts[2] ?? '—',
        status: parts[3] || '—',
      };
    }

    if (type === 'feedbackSummary') {
      const reviewMatch = parts[1]?.match(/^reviews:\s*(.*)$/i);
      const ratingMatch = parts[2]?.match(/^average rating:\s*(.*)$/i);
      return {
        id: index,
        routeName: parts[0] || '—',
        reviews: reviewMatch?.[1] ?? parts[1] ?? '—',
        averageRating: ratingMatch?.[1] ?? parts[2] ?? '—',
      };
    }

    return { id: index, value: line };
  });

  return { rows, emptyMessage: '' };
}

function dateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function initialFromDate() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return dateInputValue(date);
}

export default function ReportsDashboard({ passengers = [] }) {
  const [reportType, setReportType] = useState('routeBookings');
  const [from, setFrom] = useState(initialFromDate);
  const [to, setTo] = useState(() => dateInputValue(new Date()));
  const [passengerId, setPassengerId] = useState('');
  const [days, setDays] = useState('30');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  const selectedReport = reportOptions.find((item) => item.key === reportType) || reportOptions[0];

  const updateInput = (setter) => (event) => {
    setter(event.target.value);
    setResult(null);
    setError('');
  };

  const selectReport = (event) => {
    setReportType(event.target.value);
    setResult(null);
    setError('');
  };

  const generateReport = async (event) => {
    event.preventDefault();
    setError('');
    setGenerating(true);

    try {
      const query = new URLSearchParams({ type: reportType });
      if (reportType === 'revenue') {
        query.set('from', from);
        query.set('to', to);
      } else if (reportType === 'passengerTrips' && passengerId) {
        query.set('passengerId', passengerId);
      } else if (reportType === 'maintenanceDue') {
        query.set('days', days);
      }

      const output = await api.get(`/api/reports/generate?${query.toString()}`);
      const lines = Array.isArray(output) ? output.map((line) => String(line)) : output == null ? [] : [String(output)];
      const parsedOutput = parseReportLines(reportType, lines);
      setResult({
        type: reportType,
        title: selectedReport.title,
        generatedAt: new Date(),
        rows: parsedOutput.rows,
        emptyMessage: parsedOutput.emptyMessage,
      });
    } catch (requestError) {
      setError(requestError.message || 'Unable to generate this report.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section className="page reports-dashboard">
      <PageHeader
        title="Reports & analytics"
      />

      <section className="report-control-panel">
        <div className="report-control-heading">
          <span className="report-control-icon"><Icon name="chart" size={20} /></span>
          <div>
            <span className="report-eyebrow">REPORT BUILDER</span>
            <h2>Generate a report</h2>
          </div>
        </div>

        <form className="report-builder-form" onSubmit={generateReport}>
          <label className="report-field report-field--report">
            <span>Report</span>
            <select value={reportType} onChange={selectReport}>
              {reportOptions.map((item) => <option key={item.key} value={item.key}>{item.title}</option>)}
            </select>
          </label>

          {reportType === 'revenue' && (
            <>
              <label className="report-field">
                <span>From date</span>
                <input type="date" required value={from} max={to} onChange={updateInput(setFrom)} />
              </label>
              <label className="report-field">
                <span>To date</span>
                <input type="date" required value={to} min={from} onChange={updateInput(setTo)} />
              </label>
            </>
          )}

          {reportType === 'passengerTrips' && (
            <label className="report-field report-field--variable">
              <span>Passenger</span>
              <select value={passengerId} onChange={updateInput(setPassengerId)}>
                <option value="">All passengers</option>
                {passengers.map((passenger) => (
                  <option key={passenger.id} value={passenger.id}>
                    {passenger.fullName || `Passenger #${passenger.id}`}{passenger.email ? ` · ${passenger.email}` : ''}
                  </option>
                ))}
              </select>
            </label>
          )}

          {reportType === 'maintenanceDue' && (
            <label className="report-field report-field--variable">
              <span>Due within</span>
              <div className="report-number-input">
                <input type="number" required min="0" step="1" value={days} onChange={updateInput(setDays)} />
                <span>days</span>
              </div>
            </label>
          )}

          <div className="report-builder-action">
            {selectedReport.hint && <p>{selectedReport.hint}</p>}
            <button className="primary" type="submit" disabled={generating}>
              <Icon name="chart" size={16} />
              {generating ? 'Generating…' : 'Generate report'}
            </button>
          </div>
        </form>
      </section>

      {error && <p className="report-error" role="alert">{error}</p>}

      <section className="generated-report-panel" aria-live="polite">
        {result ? (
          <>
            <header className="generated-report-heading">
              <div>
                <h2>{result.title}</h2>
              </div>
              <div className="generated-report-time">
                <span>Generated</span>
                <strong>{result.generatedAt.toLocaleString()}</strong>
              </div>
            </header>
            <div className="report-output-wrap">
              {result.rows.length ? (
                <div className="report-table-wrap">
                  <table className="report-table">
                    <thead>
                      <tr>
                        {reportColumns[result.type].map((column) => (
                          <th className={column.align ? `report-cell--${column.align}` : ''} key={column.key} scope="col">
                            {column.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((row) => (
                        <tr key={row.id}>
                          {reportColumns[result.type].map((column) => (
                            <td className={column.align ? `report-cell--${column.align}` : ''} key={column.key}>
                              {column.key === 'status' ? (
                                <span className={`report-status-pill report-status-pill--${String(row[column.key] || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                                  {row[column.key] || '—'}
                                </span>
                              ) : (
                                row[column.key] || '—'
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="report-output-empty">
                  <strong>No results to display</strong>
                  <span>{result.emptyMessage || 'No results were found for the selected filters.'}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="report-output-placeholder">
            <span className="report-placeholder-icon"><Icon name="chart" size={22} /></span>
            <div>
              <h2>Your generated report will appear here</h2>
              <p>Choose a report and its available filters above. Your results will appear here in a table.</p>
            </div>
          </div>
        )}
      </section>
    </section>
  );
}
