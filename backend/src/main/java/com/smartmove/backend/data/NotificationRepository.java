package com.smartmove.backend.data;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<NotificationDocument, String> {
    List<NotificationDocument> findByRecipientOracleIdOrderByCreatedAtDesc(Long recipientOracleId);
}
