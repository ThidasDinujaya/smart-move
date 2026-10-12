package com.smartmove.backend.service;

import org.springframework.jdbc.core.ConnectionCallback;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;
import java.sql.Types;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class OracleProcedureService {

    private final JdbcTemplate jdbcTemplate;

    public OracleProcedureService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void recordPayment(Long bookingId, String paymentMethod) {
        execute("BEGIN sp_record_payment(?, ?); END;", statement -> {
            statement.setLong(1, bookingId);
            statement.setString(2, paymentMethod);
        });
    }

    public void cancelBooking(Long bookingId) {
        execute("BEGIN sp_cancel_booking(?); END;", statement -> statement.setLong(1, bookingId));
    }

    public void cancelTrip(Long tripId) {
        execute("BEGIN sp_cancel_trip(?); END;", statement -> statement.setLong(1, tripId));
    }

    public void completeTrip(Long tripId) {
        execute("BEGIN sp_complete_trip(?); END;", statement -> statement.setLong(1, tripId));
    }

    public int availableSeats(Long tripId) {
        Integer available = jdbcTemplate.queryForObject(
                "SELECT fn_available_seats(?) FROM dual", Integer.class, tripId);
        return available == null ? 0 : available;
    }

    public Reports runReports() {
        return jdbcTemplate.execute((ConnectionCallback<Reports>) connection -> {
            try (CallableStatement enable = connection.prepareCall("BEGIN DBMS_OUTPUT.ENABLE(NULL); END;")) {
                enable.execute();
            }

            try {
                List<String> routeBookings = readOutput(connection,
                        "BEGIN sp_report_route_bookings; END;", null);
                List<String> revenue = readOutput(connection,
                        "BEGIN sp_report_revenue(?, ?); END;", statement -> {
                            statement.setDate(1, Date.valueOf(LocalDate.now().minusDays(30)));
                            statement.setDate(2, Date.valueOf(LocalDate.now()));
                        });
                List<String> passengerTrips = readOutput(connection,
                        "BEGIN sp_report_passenger_trips(NULL); END;", null);
                List<String> maintenanceDue = readOutput(connection,
                        "BEGIN sp_report_maintenance_due(?); END;", statement -> statement.setInt(1, 30));
                List<String> feedbackSummary = readOutput(connection,
                        "BEGIN sp_report_feedback_summary; END;", null);
                return new Reports(routeBookings, revenue, passengerTrips, maintenanceDue, feedbackSummary);
            } finally {
                try (CallableStatement disable = connection.prepareCall("BEGIN DBMS_OUTPUT.DISABLE; END;")) {
                    disable.execute();
                }
            }
        });
    }

    private List<String> readOutput(Connection connection, String call, StatementBinder binder) throws SQLException {
        try (CallableStatement statement = connection.prepareCall(call)) {
            if (binder != null) {
                binder.bind(statement);
            }
            statement.execute();
        }

        List<String> lines = new ArrayList<>();
        try (CallableStatement getLine = connection.prepareCall("BEGIN DBMS_OUTPUT.GET_LINE(?, ?); END;")) {
            getLine.registerOutParameter(1, Types.VARCHAR);
            getLine.registerOutParameter(2, Types.INTEGER);
            while (true) {
                getLine.execute();
                if (getLine.getInt(2) != 0) {
                    break;
                }
                lines.add(getLine.getString(1));
            }
        }
        return lines;
    }

    private void execute(String call, StatementBinder binder) {
        jdbcTemplate.execute((ConnectionCallback<Void>) connection -> {
            try (CallableStatement statement = connection.prepareCall(call)) {
                binder.bind(statement);
                statement.execute();
            }
            return null;
        });
    }

    @FunctionalInterface
    private interface StatementBinder {
        void bind(CallableStatement statement) throws SQLException;
    }

    public record Reports(
            List<String> routeBookings,
            List<String> revenue,
            List<String> passengerTrips,
            List<String> maintenanceDue,
            List<String> feedbackSummary) {
    }
}
