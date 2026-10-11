package com.smartmove.backend.service;

import com.smartmove.backend.data.Maintenance;
import com.smartmove.backend.data.MaintenanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MaintenanceService {
    @Autowired
    private MaintenanceRepository maintenanceRepository;

    public List<Maintenance> getAllMaintenance() {
        return maintenanceRepository.findAll();
    }

    public Maintenance saveMaintenance(Maintenance maintenance) {
        return maintenanceRepository.save(maintenance);
    }
}