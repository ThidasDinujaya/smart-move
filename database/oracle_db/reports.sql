-- Five business reports for route use, revenue, passengers, maintenance, and feedback.

CREATE OR REPLACE PROCEDURE sp_report_route_bookings
IS
    v_found BOOLEAN := FALSE;
BEGIN
    FOR r IN (
        SELECT routes.route_no, routes.route_name, COUNT(tickets.ticket_id) AS ticket_count
          FROM routes
          LEFT JOIN trips ON trips.route_id = routes.id
          LEFT JOIN tickets ON tickets.trip_id = trips.trip_id
             AND tickets.ticket_status <> 'Cancelled'
         GROUP BY routes.route_no, routes.route_name
         ORDER BY routes.route_no
    ) LOOP
        v_found := TRUE;
        DBMS_OUTPUT.PUT_LINE(r.route_no || ' | ' || r.route_name || ' | tickets: ' || r.ticket_count);
    END LOOP;

    IF NOT v_found THEN
        DBMS_OUTPUT.PUT_LINE('No routes were found.');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Route bookings report failed: ' || SQLERRM);
        RAISE;
END;
/

CREATE OR REPLACE PROCEDURE sp_report_revenue (p_from IN DATE, p_to IN DATE)
IS
    v_total NUMBER(14,2);
BEGIN
    IF p_from IS NULL OR p_to IS NULL OR p_from > p_to THEN
        RAISE_APPLICATION_ERROR(-20018, 'Enter a valid date range.');
    END IF;

    SELECT NVL(SUM(amount), 0)
      INTO v_total
      FROM payments
     WHERE payment_status = 'Successful'
       AND payment_date >= p_from
       AND payment_date < p_to + 1;

    DBMS_OUTPUT.PUT_LINE('Successful revenue: LKR ' || TO_CHAR(v_total, 'FM999999999990.00'));
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Revenue report failed: ' || SQLERRM);
        RAISE;
END;
/

CREATE OR REPLACE PROCEDURE sp_report_passenger_trips (p_passenger_id IN NUMBER DEFAULT NULL)
IS
    v_found BOOLEAN := FALSE;
BEGIN
    FOR r IN (
        SELECT bookings.booking_reference, bookings.booking_status, trips.trip_date,
               routes.start_location, routes.end_location, bookings.seat_count, bookings.total_amount
          FROM bookings
          JOIN trips ON trips.trip_id = bookings.trip_id
          JOIN routes ON routes.id = trips.route_id
         WHERE p_passenger_id IS NULL OR bookings.passenger_id = p_passenger_id
         ORDER BY trips.trip_date DESC
    ) LOOP
        v_found := TRUE;
        DBMS_OUTPUT.PUT_LINE(r.booking_reference || ' | '
            || r.start_location || ' to ' || r.end_location || ' | '
            || TO_CHAR(r.trip_date, 'YYYY-MM-DD') || ' | '
            || r.booking_status || ' | seats: ' || r.seat_count
            || ' | LKR ' || TO_CHAR(r.total_amount, 'FM999999999990.00'));
    END LOOP;

    IF NOT v_found THEN
        DBMS_OUTPUT.PUT_LINE('No trips were found.');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Passenger trips report failed: ' || SQLERRM);
        RAISE;
END;
/

CREATE OR REPLACE PROCEDURE sp_report_maintenance_due (p_days IN NUMBER DEFAULT 30)
IS
    v_found BOOLEAN := FALSE;
BEGIN
    IF p_days IS NULL OR p_days < 0 THEN
        RAISE_APPLICATION_ERROR(-20020, 'The number of days cannot be negative.');
    END IF;

    FOR r IN (
        SELECT vehicles.vehicle_no, maintenance.service_type, maintenance.next_service_date, maintenance.status
          FROM maintenance
          JOIN vehicles ON vehicles.id = maintenance.vehicle_id
         WHERE maintenance.status <> 'Completed'
           AND maintenance.next_service_date <= TRUNC(SYSDATE) + p_days
         ORDER BY maintenance.next_service_date
    ) LOOP
        v_found := TRUE;
        DBMS_OUTPUT.PUT_LINE(r.vehicle_no || ' | ' || r.service_type || ' | due: '
            || TO_CHAR(r.next_service_date, 'YYYY-MM-DD') || ' | ' || r.status);
    END LOOP;

    IF NOT v_found THEN
        DBMS_OUTPUT.PUT_LINE('No vehicle services are due in this period.');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Maintenance report failed: ' || SQLERRM);
        RAISE;
END;
/

CREATE OR REPLACE PROCEDURE sp_report_feedback_summary
IS
    v_found BOOLEAN := FALSE;
BEGIN
    FOR r IN (
        SELECT routes.route_name, COUNT(feedback.id) AS review_count,
               ROUND(AVG(feedback.rating), 2) AS average_rating
          FROM routes
          LEFT JOIN trips ON trips.route_id = routes.id
          LEFT JOIN feedback ON feedback.trip_id = trips.trip_id
         GROUP BY routes.route_name
         ORDER BY routes.route_name
    ) LOOP
        v_found := TRUE;
        DBMS_OUTPUT.PUT_LINE(r.route_name || ' | reviews: ' || r.review_count
            || ' | average rating: ' || NVL(TO_CHAR(r.average_rating), 'N/A'));
    END LOOP;

    IF NOT v_found THEN
        DBMS_OUTPUT.PUT_LINE('No feedback was found.');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Feedback report failed: ' || SQLERRM);
        RAISE;
END;
/

-- Enable DBMS Output in SQL Developer before running this report sample.

SET SERVEROUTPUT ON

BEGIN
    sp_report_route_bookings;
    sp_report_revenue(TRUNC(SYSDATE) - 30, TRUNC(SYSDATE));
    sp_report_passenger_trips(NULL);
    sp_report_maintenance_due(30);
    sp_report_feedback_summary;
END;
/
