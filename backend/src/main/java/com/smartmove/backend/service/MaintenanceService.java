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
        maintenance.setId(null);
        return maintenanceRepository.save(maintenance);
    }

    public Maintenance updateMaintenance(Long id, Maintenance maintenance) {
        maintenanceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Maintenance record was not found."));
        maintenance.setId(id);
        return maintenanceRepository.save(maintenance);
    }

    public void deleteMaintenance(Long id) {
        if (!maintenanceRepository.existsById(id)) {
            throw new IllegalArgumentException("Maintenance record was not found.");
        }
        maintenanceRepository.deleteById(id);
    }
}
