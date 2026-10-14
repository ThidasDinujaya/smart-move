package com.smartmove.backend.Data;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;
import java.util.List;

public interface VehicleMediaRepository extends MongoRepository<VehicleMediaDocument, String> {
    List<VehicleMediaDocument> findByVehicleOracleIdOrderByUploadedAtDesc(Long vehicleOracleId);

    Optional<VehicleMediaDocument> findFirstByVehicleOracleIdAndMediaTypeAndImageDataIsNotNullOrderByUploadedAtDesc(
            Long vehicleOracleId,
            String mediaType
    );

    void deleteByVehicleOracleId(Long vehicleOracleId);
}
