package com.smartmove.backend.controller;

import com.smartmove.backend.service.CustomerAuthService;
import com.smartmove.backend.service.OracleProcedureService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class ReportController {

    private final CustomerAuthService customerAuthService;
    private final OracleProcedureService oracleProcedureService;

    public ReportController(
            CustomerAuthService customerAuthService,
            OracleProcedureService oracleProcedureService) {
        this.customerAuthService = customerAuthService;
        this.oracleProcedureService = oracleProcedureService;
    }

    @GetMapping
    public OracleProcedureService.Reports getReports(
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        customerAuthService.requireAnyRole(userId, "ADMIN", "FINANCE");
        return oracleProcedureService.runReports();
    }
}
