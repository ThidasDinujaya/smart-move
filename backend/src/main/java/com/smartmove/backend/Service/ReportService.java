
package com.smartmove.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    private final JdbcTemplate jdbcTemplate;

    public ReportService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> getFleetSummary() {

        String sql = """
            SELECT vehicle_type,
                   status,
                   COUNT(*) AS vehicle_count
            FROM vehicles
            GROUP BY vehicle_type, status
            ORDER BY vehicle_type, status
            """;

        return jdbcTemplate.queryForList(sql);
    }

    public List<Map<String, Object>> getDriverAssignments() {

        String sql = """
            SELECT d.full_name AS driver_name,
                   d.status AS driver_status,
                   v.registration_no AS vehicle_no,
                   v.vehicle_type
            FROM drivers d
            LEFT JOIN vehicles v
              ON d.assigned_vehicle_id = v.vehicle_id
            ORDER BY d.driver_id
            """;

        return jdbcTemplate.queryForList(sql);
    }
}

