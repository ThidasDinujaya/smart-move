package com.smartmove.backend.controller;

import com.smartmove.backend.data.Maintenance;
import com.smartmove.backend.service.MaintenanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class MaintenanceController {
    @Autowired
    private MaintenanceService maintenanceService;

    @GetMapping
    public List<Maintenance> getAllMaintenance() {
        return maintenanceService.getAllMaintenance();
    }

    @PostMapping
    public Maintenance createMaintenance(@RequestBody Maintenance maintenance) {
        return maintenanceService.saveMaintenance(maintenance);
    }
}
