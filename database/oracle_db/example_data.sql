-- Insert a small connected sample set for the SmartMove screens and reports.
-- Demo accounts use Welcome123! as their password.
-- Oracle identity columns start at 1000. Their numeric keys are displayed with
-- the entity prefixes used by the app: Passenger P, Payment PA, Driver D,
-- Ticket TI, Trip T, Booking B, Vehicle V, Route R, User U, Maintenance M,
-- and Feedback F (for example, passenger_id 1000 is shown as P1000).
-- Keep the numeric foreign-key values below unchanged so sample relationships
-- continue to point to the correct Oracle records.

SET DEFINE OFF

INSERT INTO passengers (full_name, email, phone, nic, gender)
VALUES ('SmartMove Administrator', 'admin@smartmove.local', '0710000000', 'ADMIN001', 'Other');

INSERT INTO passengers (full_name, email, phone, nic, gender)
VALUES ('Thidas Perera', 'thidas@example.com', '0711111111', '199901010001', 'Male');

INSERT INTO passengers (full_name, email, phone, nic, gender)
VALUES ('Amaya Rathnayake', 'amaya@example.com', '0712222222', '199902020002', 'Female');

INSERT INTO passengers (full_name, email, phone, nic, gender)
VALUES ('Ruwan Jayasuriya', 'ruwan@example.com', '0713333333', '199903030003', 'Male');

INSERT INTO passengers (full_name, email, phone, nic, gender)
VALUES ('Hasini Kumari', 'hasini@example.com', '0714444444', '199904040004', 'Female');

INSERT INTO passengers (full_name, email, phone, nic, gender)
VALUES ('Dinesh Chandimal', 'dinesh@example.com', '0715555555', '199905050005', 'Male');

INSERT INTO users (passenger_id, email, password, role_code, account_status)
VALUES (1000, 'admin@smartmove.local', 'Welcome123!', 'ADMIN', 'Active');

INSERT INTO users (passenger_id, email, password, role_code, account_status)
VALUES (1001, 'thidas@example.com', 'Welcome123!', 'CUSTOMER', 'Active');

INSERT INTO users (passenger_id, email, password, role_code, account_status)
VALUES (1002, 'amaya@example.com', 'Welcome123!', 'CUSTOMER', 'Active');

INSERT INTO users (passenger_id, email, password, role_code, account_status)
VALUES (1003, 'ruwan@example.com', 'Welcome123!', 'CUSTOMER', 'Active');

INSERT INTO users (passenger_id, email, password, role_code, account_status)
VALUES (1004, 'hasini@example.com', 'Welcome123!', 'CUSTOMER', 'Active');

INSERT INTO users (passenger_id, email, password, role_code, account_status)
VALUES (1005, 'dinesh@example.com', 'Welcome123!', 'CUSTOMER', 'Active');

INSERT INTO routes (route_no, route_name, start_location, end_location, distance, fare, estimated_time, description, status)
VALUES ('SM-01', 'Colombo to Kandy', 'Colombo', 'Kandy', 115, 1800, '3 hours', 'Central route with scheduled stops.', 'Active');

INSERT INTO routes (route_no, route_name, start_location, end_location, distance, fare, estimated_time, description, status)
VALUES ('SM-02', 'Colombo to Galle', 'Colombo', 'Galle', 125, 1600, '2 hours 30 minutes', 'Southern route along the coast.', 'Active');

INSERT INTO routes (route_no, route_name, start_location, end_location, distance, fare, estimated_time, description, status)
VALUES ('SM-03', 'Kandy to Nuwara Eliya', 'Kandy', 'Nuwara Eliya', 75, 2200, '2 hours 45 minutes', 'Hill country route.', 'Active');

INSERT INTO vehicles (vehicle_no, vehicle_type, brand, model, manufacture_year, seating_capacity, fuel_type, last_service_date, status)
VALUES ('WP-CAB-1234', 'Coach', 'Ashok Leyland', 'Viking', 2022, 40, 'Diesel', TRUNC(SYSDATE) - 60, 'Active');

INSERT INTO vehicles (vehicle_no, vehicle_type, brand, model, manufacture_year, seating_capacity, fuel_type, last_service_date, status)
VALUES ('WP-VAN-4567', 'Van', 'Toyota', 'Hiace', 2021, 14, 'Diesel', TRUNC(SYSDATE) - 45, 'Active');

INSERT INTO vehicles (vehicle_no, vehicle_type, brand, model, manufacture_year, seating_capacity, fuel_type, last_service_date, status)
VALUES ('WP-BUS-8899', 'Bus', 'Tata', 'LP 909', 2020, 32, 'Diesel', TRUNC(SYSDATE) - 100, 'Active');

INSERT INTO drivers (name, nic, license_no, contact, email, vehicle_id, address, status)
VALUES ('Nimal Perera', '198801010001', 'B1234567', '0716000001', 'nimal@smartmove.local', 1000, 'Colombo', 'Active');

INSERT INTO drivers (name, nic, license_no, contact, email, vehicle_id, address, status)
VALUES ('Sajith Fernando', '198802020002', 'B2345678', '0716000002', 'sajith@smartmove.local', 1001, 'Gampaha', 'Active');

INSERT INTO drivers (name, nic, license_no, contact, email, vehicle_id, address, status)
VALUES ('Ruwan Jayasinghe', '198803030003', 'B3456789', '0716000003', 'ruwan.driver@smartmove.local', 1002, 'Kandy', 'Active');

INSERT INTO trips (route_id, vehicle_id, driver_id, trip_date, departure_time, arrival_time, seat_capacity, fare, status, notes)
VALUES (1000, 1000, 1000, TRUNC(SYSDATE) - 7, TO_TIMESTAMP('2000-01-01 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2000-01-01 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 40, 1800, 'Completed', 'Sample completed trip.');

INSERT INTO trips (route_id, vehicle_id, driver_id, trip_date, departure_time, arrival_time, seat_capacity, fare, status, notes)
VALUES (1000, 1000, 1000, TRUNC(SYSDATE) + 2, TO_TIMESTAMP('2000-01-01 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2000-01-01 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 40, 1800, 'Scheduled', 'Morning service.');

INSERT INTO trips (route_id, vehicle_id, driver_id, trip_date, departure_time, arrival_time, seat_capacity, fare, status, notes)
VALUES (1001, 1001, 1001, TRUNC(SYSDATE) + 4, TO_TIMESTAMP('2000-01-01 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2000-01-01 11:30:00', 'YYYY-MM-DD HH24:MI:SS'), 14, 1600, 'Scheduled', 'Coastal morning service.');

INSERT INTO trips (route_id, vehicle_id, driver_id, trip_date, departure_time, arrival_time, seat_capacity, fare, status, notes)
VALUES (1002, 1002, 1002, TRUNC(SYSDATE) - 2, TO_TIMESTAMP('2000-01-01 07:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2000-01-01 10:15:00', 'YYYY-MM-DD HH24:MI:SS'), 32, 2200, 'Completed', 'Sample completed hill country trip.');

INSERT INTO bookings (booking_reference, passenger_id, trip_id, booking_date, seat_count, total_amount, booking_status)
VALUES ('SMB-DEMO-0001', 1001, 1000, SYSTIMESTAMP - INTERVAL '7' DAY, 1, 1800, 'Completed');

INSERT INTO bookings (booking_reference, passenger_id, trip_id, booking_date, seat_count, total_amount, booking_status)
VALUES ('SMB-DEMO-0002', 1002, 1001, SYSTIMESTAMP - INTERVAL '1' DAY, 2, 3600, 'Confirmed');

INSERT INTO bookings (booking_reference, passenger_id, trip_id, booking_date, seat_count, total_amount, booking_status)
VALUES ('SMB-DEMO-0003', 1003, 1002, SYSTIMESTAMP, 1, 1600, 'Pending Payment');

INSERT INTO bookings (booking_reference, passenger_id, trip_id, booking_date, seat_count, total_amount, booking_status)
VALUES ('SMB-DEMO-0004', 1004, 1003, SYSTIMESTAMP - INTERVAL '2' DAY, 1, 2200, 'Completed');

INSERT INTO tickets (ticket_number, booking_id, trip_id, seat_number, ticket_status)
VALUES ('SMT-DEMO-0001', 1000, 1000, '1', 'Issued');

INSERT INTO tickets (ticket_number, booking_id, trip_id, seat_number, ticket_status)
VALUES ('SMT-DEMO-0002', 1001, 1001, '1', 'Confirmed');

INSERT INTO tickets (ticket_number, booking_id, trip_id, seat_number, ticket_status)
VALUES ('SMT-DEMO-0003', 1001, 1001, '2', 'Confirmed');

INSERT INTO tickets (ticket_number, booking_id, trip_id, seat_number, ticket_status)
VALUES ('SMT-DEMO-0004', 1002, 1002, '1', 'Reserved');

INSERT INTO tickets (ticket_number, booking_id, trip_id, seat_number, ticket_status)
VALUES ('SMT-DEMO-0005', 1003, 1003, '1', 'Issued');

INSERT INTO payments (booking_id, amount, payment_method, payment_status, payment_date)
VALUES (1000, 1800, 'Card', 'Successful', SYSTIMESTAMP - INTERVAL '7' DAY);

INSERT INTO payments (booking_id, amount, payment_method, payment_status, payment_date)
VALUES (1001, 3600, 'Mobile Wallet', 'Successful', SYSTIMESTAMP - INTERVAL '1' DAY);

INSERT INTO payments (booking_id, amount, payment_method, payment_status, payment_date)
VALUES (1003, 2200, 'Cash', 'Successful', SYSTIMESTAMP - INTERVAL '2' DAY);

INSERT INTO maintenance (vehicle_id, service_type, description, cost, start_date, next_service_date, provider, status)
VALUES (1000, 'Routine service', 'Oil, filters, and brake inspection.', 45000, TRUNC(SYSDATE) - 60, TRUNC(SYSDATE) + 30, 'Central Fleet Care', 'Completed');

INSERT INTO maintenance (vehicle_id, service_type, description, cost, start_date, next_service_date, provider, status)
VALUES (1002, 'Engine inspection', 'Inspection required before the next trip.', 78000, TRUNC(SYSDATE) - 10, TRUNC(SYSDATE) - 5, 'Hill Country Motors', 'Due');

INSERT INTO feedback (passenger_id, trip_id, rating, driver_rating, vehicle_rating, created_at)
VALUES (1001, 1000, 5, 5, 4, SYSTIMESTAMP - INTERVAL '6' DAY);

INSERT INTO feedback (passenger_id, trip_id, rating, driver_rating, vehicle_rating, created_at)
VALUES (1004, 1003, 2, 3, 2, SYSTIMESTAMP - INTERVAL '1' DAY);

INSERT INTO feedback (passenger_id, trip_id, rating, driver_rating, vehicle_rating, created_at)
VALUES (1002, 1000, 4, 4, 5, SYSTIMESTAMP - INTERVAL '5' DAY);

COMMIT;
