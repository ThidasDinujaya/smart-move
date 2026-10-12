-- Return the number of seats that are still available on a trip.

CREATE OR REPLACE FUNCTION fn_available_seats (p_trip_id IN NUMBER)
RETURN NUMBER
IS
    v_capacity trips.seat_capacity%TYPE;
    v_taken NUMBER;
BEGIN
    SELECT seat_capacity
      INTO v_capacity
      FROM trips
     WHERE trip_id = p_trip_id;

    SELECT COUNT(*)
      INTO v_taken
      FROM tickets
     WHERE trip_id = p_trip_id
       AND ticket_status IN ('Reserved', 'Confirmed', 'Issued');

    RETURN GREATEST(v_capacity - v_taken, 0);
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20003, 'Trip was not found.');
END;
/
