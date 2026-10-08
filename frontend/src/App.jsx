import { useState } from 'react';
import AppLayout from './components/AppLayout.jsx';
import BookingForm from './components/BookingForm.jsx';
import RecordDialog from './components/RecordDialog.jsx';
import TripForm from './components/TripForm.jsx';
import BookingsPage from './pages/admin/BookingsPage.jsx';
import PassengersPage from './pages/admin/PassengersPage.jsx';
import PaymentReceiptPage from './pages/admin/PaymentReceiptPage.jsx';
import PaymentsPage from './pages/admin/PaymentsPage.jsx';
import TripsPage from './pages/admin/TripsPage.jsx';
import MaintenanceManagement from './pages/admin/MaintenanceManagement.jsx';
import AddMaintenance from './pages/admin/AddMaintenance.jsx';
import FeedbackReviews from './pages/admin/FeedbackReviews.jsx';
import ReportsDashboard from './pages/admin/ReportsDashboard.jsx';
import useSmartMoveData from './hooks/useSmartMoveData.js';
import downloadReceipt from './utils/downloadReceipt.js';

const emptyPassenger = {
  name: '',
  email: '',
  phone: '',
  gender: '',
  status: '',
};

const emptyPayment = {
  booking: '',
  passenger: '',
  amount: '',
  method: '',
  status: '',
};

export default function App() {
  const data = useSmartMoveData();
  const [page, setPage] = useState('passengers');
  const [dialog, setDialog] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const activePage = {
    'trip-form': 'trips',
    'booking-form': 'bookings',
    'maintenance-form': 'maintenance',
    receipt: 'payments',
  }[page] || page;
  const receiptBooking = data.bookings.find((booking) => String(booking.id) === String(receipt?.booking));

  function openDialog(type, mode, item = {}) {
    setDialog({ type, mode, item });
  }

  function closeDialog() {
    setDialog(null);
  }

  function openReceipt(payment) {
    setReceipt(payment);
    setPage('receipt');
  }

  function navigate(nextPage) {
    setPage(nextPage);
    closeDialog();
  }

  return (
    <AppLayout activePage={activePage} onNavigate={navigate}>
      {page === 'passengers' && (
        <PassengersPage
          passengers={data.passengers}
          onAdd={() => openDialog('passenger', 'add', emptyPassenger)}
          onOpen={openDialog}
        />
      )}

      {page === 'trips' && (
        <TripsPage
          trips={data.trips}
          routes={data.routes}
          statuses={data.tripOptions.statuses}
          onAdd={() => {
            setEditingTrip(null);
            setPage('trip-form');
          }}
          onOpen={openDialog}
          onEdit={(trip) => {
            setEditingTrip(trip);
            setPage('trip-form');
          }}
        />
      )}

      {page === 'bookings' && (
        <BookingsPage
          bookings={data.bookings}
          routes={data.routes}
          onAdd={() => setPage('booking-form')}
          onOpen={openDialog}
        />
      )}

      {page === 'payments' && (
        <PaymentsPage
          payments={data.payments}
          onAdd={() => openDialog('payment', 'add', emptyPayment)}
          onOpen={openDialog}
          onOpenReceipt={openReceipt}
        />
      )}

      {page === 'maintenance' && (
        <MaintenanceManagement
          records={data.maintenance}
          statuses={data.maintenanceOptions.statuses}
          onAdd={() => setPage('maintenance-form')}
        />
      )}

      {page === 'maintenance-form' && (
        <AddMaintenance
          options={data.maintenanceOptions}
          onCancel={() => setPage('maintenance')}
          onSave={async (record) => {
            if (await data.saveMaintenance(record)) setPage('maintenance');
          }}
        />
      )}

      {page === 'feedback' && <FeedbackReviews reviews={data.feedback} />}

      {page === 'reports' && <ReportsDashboard report={data.reports} />}

      {page === 'trip-form' && (
        <section className="page form-page">
          <TripForm
            value={editingTrip}
            options={data.tripOptions}
            onCancel={() => {
              setEditingTrip(null);
              setPage('trips');
            }}
            onSave={async (trip) => {
              if (await data.saveTrip(trip, editingTrip)) {
                setEditingTrip(null);
                setPage('trips');
              }
            }}
          />
        </section>
      )}

      {page === 'booking-form' && (
        <section className="page form-page">
          <BookingForm
            trips={data.trips}
            passengers={data.passengers}
            onCancel={() => setPage('bookings')}
            onSave={async (booking) => {
              if (await data.saveBooking(booking)) setPage('bookings');
            }}
          />
        </section>
      )}

      {page === 'receipt' && (
        <PaymentReceiptPage
          receipt={receipt}
          booking={receiptBooking}
          onDownload={() => downloadReceipt(receipt, receiptBooking)}
          onBack={() => setPage('bookings')}
        />
      )}

      {dialog && (
        <RecordDialog
          key={[dialog.type, dialog.mode, dialog.item.id || 'new'].join(':')}
          data={dialog}
          onClose={closeDialog}
          onSave={async (value) => {
            if (await data.saveRecord(dialog, value)) closeDialog();
          }}
          onDelete={async (item) => {
            if (await data.deleteRecord(dialog.type, item)) closeDialog();
          }}
        />
      )}
    </AppLayout>
  );
}
