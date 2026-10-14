-- Record payments and keep booking and ticket statuses together.

CREATE OR REPLACE PROCEDURE sp_record_payment (
    p_booking_id IN NUMBER,
    p_payment_method IN VARCHAR2
)
IS
    v_amount bookings.total_amount%TYPE;
    v_passenger_id bookings.passenger_id%TYPE;
    v_booking_status bookings.booking_status%TYPE;
BEGIN
    SELECT total_amount, passenger_id, booking_status
      INTO v_amount, v_passenger_id, v_booking_status
      FROM bookings
     WHERE booking_id = p_booking_id
       FOR UPDATE;

    IF v_booking_status <> 'Pending Payment' THEN
        RAISE_APPLICATION_ERROR(-20004, 'This booking is not awaiting payment.');
    END IF;

    IF p_payment_method IS NULL OR TRIM(p_payment_method) IS NULL THEN
        RAISE_APPLICATION_ERROR(-20005, 'Payment method is required.');
    END IF;

    INSERT INTO payments (booking_id, passenger_id, amount, payment_method, payment_status, payment_date)
    VALUES (p_booking_id, v_passenger_id, v_amount, TRIM(p_payment_method), 'Successful', CURRENT_TIMESTAMP);

    UPDATE bookings
       SET booking_status = 'Confirmed'
     WHERE booking_id = p_booking_id;

    UPDATE tickets
       SET ticket_status = 'Confirmed'
     WHERE booking_id = p_booking_id
       AND ticket_status = 'Reserved';
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20006, 'Booking was not found.');
END;
/

-- Refund a successful payment once.
CREATE OR REPLACE PROCEDURE sp_refund_payment (p_payment_id IN NUMBER)
IS
    v_status payments.payment_status%TYPE;
BEGIN
    SELECT payment_status
      INTO v_status
      FROM payments
     WHERE id = p_payment_id
       FOR UPDATE;

    IF v_status = 'Refunded' THEN
        RETURN;
    END IF;

    IF v_status <> 'Successful' THEN
        RAISE_APPLICATION_ERROR(-20007, 'Only successful payments can be refunded.');
    END IF;

    UPDATE payments
       SET payment_status = 'Refunded',
           refunded_at = CURRENT_TIMESTAMP
     WHERE id = p_payment_id;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20008, 'Payment was not found.');
END;
/

-- Cancel a customer's future booking and return its seats.
CREATE OR REPLACE PROCEDURE sp_cancel_booking (p_booking_id IN NUMBER)
IS
    v_booking_status bookings.booking_status%TYPE;
    v_trip_id bookings.trip_id%TYPE;
    v_trip_status trips.status%TYPE;
    v_trip_date trips.trip_date%TYPE;
    v_departure_time trips.departure_time%TYPE;
    v_departure_at DATE;
BEGIN
    SELECT booking_status, trip_id
      INTO v_booking_status, v_trip_id
      FROM bookings
     WHERE booking_id = p_booking_id
       FOR UPDATE;

    IF v_booking_status = 'Cancelled' THEN
        RETURN;
    END IF;

    IF v_booking_status = 'Completed' THEN
        RAISE_APPLICATION_ERROR(-20009, 'A completed booking cannot be cancelled.');
    END IF;

    SELECT status, trip_date, departure_time
      INTO v_trip_status, v_trip_date, v_departure_time
      FROM trips
     WHERE trip_id = v_trip_id;

    IF v_trip_status <> 'Cancelled' THEN
        v_departure_at := TO_DATE(
            TO_CHAR(v_trip_date, 'YYYY-MM-DD') || ' ' || TO_CHAR(v_departure_time, 'HH24:MI:SS'),
            'YYYY-MM-DD HH24:MI:SS'
        );
        IF v_departure_at <= SYSDATE THEN
            RAISE_APPLICATION_ERROR(-20010, 'A booking cannot be cancelled after the trip has departed.');
        END IF;
    END IF;

    IF v_booking_status NOT IN ('Pending Payment', 'Confirmed') THEN
        RAISE_APPLICATION_ERROR(-20011, 'This booking cannot be cancelled.');
    END IF;

    UPDATE payments
       SET payment_status = 'Refunded',
           refunded_at = CURRENT_TIMESTAMP
     WHERE booking_id = p_booking_id
       AND payment_status = 'Successful';

    UPDATE tickets
       SET ticket_status = 'Cancelled'
     WHERE booking_id = p_booking_id
       AND ticket_status <> 'Cancelled';

    UPDATE bookings
       SET booking_status = 'Cancelled'
     WHERE booking_id = p_booking_id;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20012, 'Booking or trip was not found.');
END;
/

-- Cancel a trip and close its bookings, tickets, and successful payments together.
CREATE OR REPLACE PROCEDURE sp_cancel_trip (p_trip_id IN NUMBER)
IS
    v_status trips.status%TYPE;
BEGIN
    SELECT status
      INTO v_status
      FROM trips
     WHERE trip_id = p_trip_id
       FOR UPDATE;

    IF v_status = 'Completed' THEN
        RAISE_APPLICATION_ERROR(-20013, 'A completed trip cannot be cancelled.');
    END IF;

    IF v_status = 'Cancelled' THEN
        RETURN;
    END IF;

    UPDATE payments
       SET payment_status = 'Refunded',
           refunded_at = CURRENT_TIMESTAMP
     WHERE payment_status = 'Successful'
       AND booking_id IN (
           SELECT booking_id FROM bookings
            WHERE trip_id = p_trip_id
              AND booking_status IN ('Pending Payment', 'Confirmed')
       );

    UPDATE tickets
       SET ticket_status = 'Cancelled'
     WHERE trip_id = p_trip_id
       AND ticket_status <> 'Cancelled'
       AND booking_id IN (
           SELECT booking_id FROM bookings
            WHERE trip_id = p_trip_id
              AND booking_status IN ('Pending Payment', 'Confirmed')
       );

    UPDATE bookings
       SET booking_status = 'Cancelled'
     WHERE trip_id = p_trip_id
       AND booking_status IN ('Pending Payment', 'Confirmed');

    UPDATE trips
       SET status = 'Cancelled'
     WHERE trip_id = p_trip_id;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20014, 'Trip was not found.');
END;
/

-- Complete a departed trip, finalize confirmed bookings, and close unpaid reservations.
CREATE OR REPLACE PROCEDURE sp_complete_trip (p_trip_id IN NUMBER)
IS
    v_status trips.status%TYPE;
    v_trip_date trips.trip_date%TYPE;
    v_arrival_time trips.arrival_time%TYPE;
    v_arrival_at DATE;
BEGIN
    SELECT status, trip_date, arrival_time
      INTO v_status, v_trip_date, v_arrival_time
      FROM trips
     WHERE trip_id = p_trip_id
       FOR UPDATE;

    IF v_status = 'Cancelled' THEN
        RAISE_APPLICATION_ERROR(-20015, 'A cancelled trip cannot be completed.');
    END IF;

    IF v_status = 'Completed' THEN
        RETURN;
    END IF;

    v_arrival_at := TO_DATE(
        TO_CHAR(v_trip_date, 'YYYY-MM-DD') || ' ' || TO_CHAR(v_arrival_time, 'HH24:MI:SS'),
        'YYYY-MM-DD HH24:MI:SS'
    );
    IF v_arrival_at > SYSDATE THEN
        RAISE_APPLICATION_ERROR(-20016, 'A trip can be completed after its arrival time.');
    END IF;

    UPDATE tickets
       SET ticket_status = 'Issued'
     WHERE trip_id = p_trip_id
       AND ticket_status = 'Confirmed'
       AND booking_id IN (
           SELECT booking_id FROM bookings
            WHERE trip_id = p_trip_id AND booking_status = 'Confirmed'
       );

    UPDATE tickets
       SET ticket_status = 'Cancelled'
     WHERE trip_id = p_trip_id
       AND ticket_status = 'Reserved'
       AND booking_id IN (
           SELECT booking_id FROM bookings
            WHERE trip_id = p_trip_id AND booking_status = 'Pending Payment'
       );

    UPDATE bookings
       SET booking_status = 'Completed'
     WHERE trip_id = p_trip_id
       AND booking_status = 'Confirmed';

    UPDATE bookings
       SET booking_status = 'Cancelled'
     WHERE trip_id = p_trip_id
       AND booking_status = 'Pending Payment';

    UPDATE trips
       SET status = 'Completed'
     WHERE trip_id = p_trip_id;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20017, 'Trip was not found.');
END;
/
