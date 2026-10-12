package com.smartmove.backend.Data;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TripMediaRepository extends MongoRepository<TripMediaDocument, String> {
    List<TripMediaDocument> findByTripOracleIdOrderByUploadedAtDesc(Long tripOracleId);
}
