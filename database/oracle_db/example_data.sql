-- Insert a small connected sample set for the SmartMove screens and reports.
-- Demo accounts use Welcome123! as their password.

SET DEFINE OFF

INSERT INTO passengers (passenger_id, full_name, email, phone, nic, gender)
VALUES (1, 'SmartMove Administrator', 'admin@smartmove.local', '0710000000', 'ADMIN001', 'Other');

INSERT INTO passengers (passenger_id, full_name, email, phone, nic, gender)
VALUES (2, 'Thidas Perera', 'thidas@example.com', '0711111111', '199901010001', 'Male');

INSERT INTO passengers (passenger_id, full_name, email, phone, nic, gender)
VALUES (3, 'Amaya Rathnayake', 'amaya@example.com', '0712222222', '199902020002', 'Female');

INSERT INTO passengers (passenger_id, full_name, email, phone, nic, gender)
VALUES (4, 'Ruwan Jayasuriya', 'ruwan@example.com', '0713333333', '199903030003', 'Male');

INSERT INTO passengers (passenger_id, full_name, email, phone, nic, gender)
VALUES (5, 'Hasini Kumari', 'hasini@example.com', '0714444444', '199904040004', 'Female');

INSERT INTO passengers (passenger_id, full_name, email, phone, nic, gender)
VALUES (6, 'Dinesh Chandimal', 'dinesh@example.com', '0715555555', '199905050005', 'Male');

INSERT INTO users (user_id, passenger_id, email, password, role_code, account_status)
VALUES (1, 1, 'admin@smartmove.local', 'Welcome123!', 'ADMIN', 'Active');

INSERT INTO users (user_id, passenger_id, email, password, role_code, account_status)
VALUES (2, 2, 'thidas@example.com', 'Welcome123!', 'CUSTOMER', 'Active');

INSERT INTO users (user_id, passenger_id, email, password, role_code, account_status)
VALUES (3, 3, 'amaya@example.com', 'Welcome123!', 'CUSTOMER', 'Active');

INSERT INTO users (user_id, passenger_id, email, password, role_code, account_status)
VALUES (4, 4, 'ruwan@example.com', 'Welcome123!', 'CUSTOMER', 'Active');

INSERT INTO users (user_id, passenger_id, email, password, role_code, account_status)
VALUES (5, 5, 'hasini@example.com', 'Welcome123!', 'CUSTOMER', 'Active');

INSERT INTO users (user_id, passenger_id, email, password, role_code, account_status)
VALUES (6, 6, 'dinesh@example.com', 'Welcome123!', 'CUSTOMER', 'Active');

INSERT INTO drivers (id, name, nic, license_no, contact, email, assigned_vehicle, address, status)
VALUES (1, 'Nimal Perera', '198801010001', 'B1234567', '0716000001', 'nimal@smartmove.local', 'WP-CAB-1234', 'Colombo', 'Active');

INSERT INTO drivers (id, name, nic, license_no, contact, email, assigned_vehicle, address, status)
VALUES (2, 'Sajith Fernando', '198802020002', 'B2345678', '0716000002', 'sajith@smartmove.local', 'WP-VAN-4567', 'Gampaha', 'Active');

INSERT INTO drivers (id, name, nic, license_no, contact, email, assigned_vehicle, address, status)
VALUES (3, 'Ruwan Jayasinghe', '198803030003', 'B3456789', '0716000003', 'ruwan.driver@smartmove.local', 'WP-BUS-8899', 'Kandy', 'Active');

INSERT INTO routes (id, route_no, route_name, start_location, end_location, distance, fare, estimated_time, description, status)
VALUES (1, 'SM-01', 'Colombo to Kandy', 'Colombo', 'Kandy', 115, 1800, '3 hours', 'Central route with scheduled stops.', 'Active');

INSERT INTO routes (id, route_no, route_name, start_location, end_location, distance, fare, estimated_time, description, status)
VALUES (2, 'SM-02', 'Colombo to Galle', 'Colombo', 'Galle', 125, 1600, '2 hours 30 minutes', 'Southern route along the coast.', 'Active');

INSERT INTO routes (id, route_no, route_name, start_location, end_location, distance, fare, estimated_time, description, status)
VALUES (3, 'SM-03', 'Kandy to Nuwara Eliya', 'Kandy', 'Nuwara Eliya', 75, 2200, '2 hours 45 minutes', 'Hill country route.', 'Active');

INSERT INTO vehicles (id, vehicle_no, vehicle_type, brand, model, manufacture_year, seating_capacity, fuel_type, last_service_date, status)
VALUES (1, 'WP-CAB-1234', 'Coach', 'Ashok Leyland', 'Viking', 2022, 40, 'Diesel', TRUNC(SYSDATE) - 60, 'Active');

INSERT INTO vehicles (id, vehicle_no, vehicle_type, brand, model, manufacture_year, seating_capacity, fuel_type, last_service_date, status)
VALUES (2, 'WP-VAN-4567', 'Van', 'Toyota', 'Hiace', 2021, 14, 'Diesel', TRUNC(SYSDATE) - 45, 'Active');

INSERT INTO vehicles (id, vehicle_no, vehicle_type, brand, model, manufacture_year, seating_capacity, fuel_type, last_service_date, status)
VALUES (3, 'WP-BUS-8899', 'Bus', 'Tata', 'LP 909', 2020, 32, 'Diesel', TRUNC(SYSDATE) - 100, 'Active');

INSERT INTO trips (trip_id, route_id, vehicle_id, driver_id, trip_date, departure_time, arrival_time, seat_capacity, fare, status, notes)
VALUES (1, 1, 1, 1, TRUNC(SYSDATE) - 7, TO_TIMESTAMP('2000-01-01 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2000-01-01 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 40, 1800, 'Completed', 'Sample completed trip.');

INSERT INTO trips (trip_id, route_id, vehicle_id, driver_id, trip_date, departure_time, arrival_time, seat_capacity, fare, status, notes)
VALUES (2, 1, 1, 1, TRUNC(SYSDATE) + 2, TO_TIMESTAMP('2000-01-01 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2000-01-01 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 40, 1800, 'Scheduled', 'Morning service.');

INSERT INTO trips (trip_id, route_id, vehicle_id, driver_id, trip_date, departure_time, arrival_time, seat_capacity, fare, status, notes)
VALUES (3, 2, 2, 2, TRUNC(SYSDATE) + 4, TO_TIMESTAMP('2000-01-01 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2000-01-01 11:30:00', 'YYYY-MM-DD HH24:MI:SS'), 14, 1600, 'Scheduled', 'Coastal morning service.');

INSERT INTO trips (trip_id, route_id, vehicle_id, driver_id, trip_date, departure_time, arrival_time, seat_capacity, fare, status, notes)
VALUES (4, 3, 3, 3, TRUNC(SYSDATE) - 2, TO_TIMESTAMP('2000-01-01 07:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2000-01-01 10:15:00', 'YYYY-MM-DD HH24:MI:SS'), 32, 2200, 'Completed', 'Sample completed hill country trip.');

INSERT INTO bookings (booking_id, booking_reference, passenger_id, trip_id, booking_date, seat_count, total_amount, booking_status)
VALUES (1, 'SMB-DEMO-0001', 2, 1, SYSTIMESTAMP - INTERVAL '7' DAY, 1, 1800, 'Completed');

INSERT INTO bookings (booking_id, booking_reference, passenger_id, trip_id, booking_date, seat_count, total_amount, booking_status)
VALUES (2, 'SMB-DEMO-0002', 3, 2, SYSTIMESTAMP - INTERVAL '1' DAY, 2, 3600, 'Confirmed');

INSERT INTO bookings (booking_id, booking_reference, passenger_id, trip_id, booking_date, seat_count, total_amount, booking_status)
VALUES (3, 'SMB-DEMO-0003', 4, 3, SYSTIMESTAMP, 1, 1600, 'Pending Payment');

INSERT INTO bookings (booking_id, booking_reference, passenger_id, trip_id, booking_date, seat_count, total_amount, booking_status)
VALUES (4, 'SMB-DEMO-0004', 5, 4, SYSTIMESTAMP - INTERVAL '2' DAY, 1, 2200, 'Completed');

INSERT INTO tickets (ticket_id, ticket_number, booking_id, trip_id, seat_number, ticket_status)
VALUES (1, 'SMT-DEMO-0001', 1, 1, '1', 'Issued');

INSERT INTO tickets (ticket_id, ticket_number, booking_id, trip_id, seat_number, ticket_status)
VALUES (2, 'SMT-DEMO-0002', 2, 2, '1', 'Confirmed');

INSERT INTO tickets (ticket_id, ticket_number, booking_id, trip_id, seat_number, ticket_status)
VALUES (3, 'SMT-DEMO-0003', 2, 2, '2', 'Confirmed');

INSERT INTO tickets (ticket_id, ticket_number, booking_id, trip_id, seat_number, ticket_status)
VALUES (4, 'SMT-DEMO-0004', 3, 3, '1', 'Reserved');

INSERT INTO tickets (ticket_id, ticket_number, booking_id, trip_id, seat_number, ticket_status)
VALUES (5, 'SMT-DEMO-0005', 4, 4, '1', 'Issued');

INSERT INTO payments (id, booking_id, passenger_id, amount, payment_method, payment_status, payment_date)
VALUES (1, 1, 2, 1800, 'Card', 'Successful', SYSTIMESTAMP - INTERVAL '7' DAY);

INSERT INTO payments (id, booking_id, passenger_id, amount, payment_method, payment_status, payment_date)
VALUES (2, 2, 3, 3600, 'Mobile Wallet', 'Successful', SYSTIMESTAMP - INTERVAL '1' DAY);

INSERT INTO payments (id, booking_id, passenger_id, amount, payment_method, payment_status, payment_date)
VALUES (3, 4, 5, 2200, 'Cash', 'Successful', SYSTIMESTAMP - INTERVAL '2' DAY);

INSERT INTO maintenance (id, vehicle_id, service_type, description, cost, start_date, next_service_date, provider, status)
VALUES (1, 1, 'Routine service', 'Oil, filters, and brake inspection.', 45000, TRUNC(SYSDATE) - 60, TRUNC(SYSDATE) + 30, 'Central Fleet Care', 'Completed');

INSERT INTO maintenance (id, vehicle_id, service_type, description, cost, start_date, next_service_date, provider, status)
VALUES (2, 3, 'Engine inspection', 'Inspection required before the next trip.', 78000, TRUNC(SYSDATE) - 10, TRUNC(SYSDATE) - 5, 'Hill Country Motors', 'Due');

INSERT INTO feedback (id, passenger_id, trip_id, rating, driver_rating, vehicle_rating, review_status, created_at)
VALUES (1, 2, 1, 5, 5, 4, 'REVIEWED', SYSTIMESTAMP - INTERVAL '6' DAY);

INSERT INTO feedback (id, passenger_id, trip_id, rating, driver_rating, vehicle_rating, review_status, created_at)
VALUES (2, 5, 4, 2, 3, 2, 'NEW', SYSTIMESTAMP - INTERVAL '1' DAY);

INSERT INTO feedback (id, passenger_id, trip_id, rating, driver_rating, vehicle_rating, review_status, created_at)
VALUES (3, 3, 1, 4, 4, 5, 'NEW', SYSTIMESTAMP - INTERVAL '5' DAY);

COMMIT;
