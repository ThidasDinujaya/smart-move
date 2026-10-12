package com.smartmove.backend.Controller;


import com.smartmove.service.ReportService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/fleet-summary")
    public List<Map<String, Object>> getFleetSummary() {
        return reportService.getFleetSummary();
    }

    @GetMapping("/driver-assignments")
    public List<Map<String, Object>> getDriverAssignments() {
        return reportService.getDriverAssignments();
    }
}

