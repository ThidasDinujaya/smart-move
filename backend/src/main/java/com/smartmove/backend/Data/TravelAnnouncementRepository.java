package com.smartmove.backend.data;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TravelAnnouncementRepository extends MongoRepository<TravelAnnouncementDocument, String> {
    List<TravelAnnouncementDocument> findByActiveTrueOrderByPublishedAtDesc();
}
