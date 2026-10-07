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

  const activePage = page === 'trip-form'
    ? 'trips'
    : page === 'booking-form'
      ? 'bookings'
      : page === 'receipt'
        ? 'payments'
        : page;
  const receiptBooking = data.bookings.find((booking) => booking.id === receipt?.booking);

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

      {page === 'trip-form' && (
        <section className="page form-page">
          <TripForm
            value={editingTrip}
            options={data.tripOptions}
            onCancel={() => {
              setEditingTrip(null);
              setPage('trips');
            }}
            onSave={(trip) => {
              data.saveTrip(trip, editingTrip);
              setEditingTrip(null);
              setPage('trips');
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
            onSave={(booking) => {
              data.saveBooking(booking);
              setPage('bookings');
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
          onSave={(value) => {
            data.saveRecord(dialog, value);
            closeDialog();
          }}
          onDelete={(item) => {
            data.deleteRecord(dialog.type, item);
            closeDialog();
          }}
        />
      )}
    </AppLayout>
  );
}
