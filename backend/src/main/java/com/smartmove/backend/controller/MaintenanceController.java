package com.smartmove.backend.controller;

import com.smartmove.backend.data.Maintenance;
import com.smartmove.backend.service.MaintenanceService;
import com.smartmove.backend.service.CustomerAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class MaintenanceController {
    @Autowired
    private MaintenanceService maintenanceService;
    @Autowired
    private CustomerAuthService customerAuthService;

    @GetMapping
    public List<Maintenance> getAllMaintenance(
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        customerAuthService.requireAnyRole(userId, "ADMIN", "OPERATIONS");
        return maintenanceService.getAllMaintenance();
    }

    @PostMapping
    public Maintenance createMaintenance(
            @RequestBody Maintenance maintenance,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        customerAuthService.requireAnyRole(userId, "ADMIN", "OPERATIONS");
        return maintenanceService.saveMaintenance(maintenance);
    }

    @PutMapping("/{id}")
    public Maintenance updateMaintenance(
            @PathVariable Long id,
            @RequestBody Maintenance maintenance,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        customerAuthService.requireAnyRole(userId, "ADMIN", "OPERATIONS");
        return maintenanceService.updateMaintenance(id, maintenance);
    }

    @DeleteMapping("/{id}")
    public void deleteMaintenance(
            @PathVariable Long id,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        customerAuthService.requireAnyRole(userId, "ADMIN", "OPERATIONS");
        maintenanceService.deleteMaintenance(id);
    }
}
