package com.smartmove.backend.data;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface VehicleMediaRepository extends MongoRepository<VehicleMediaDocument, String> {
    List<VehicleMediaDocument> findByVehicleOracleIdOrderByUploadedAtDesc(Long vehicleOracleId);

    void deleteByVehicleOracleId(Long vehicleOracleId);
}
