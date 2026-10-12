package com.smartmove.backend.data;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface FeedbackDocumentRepository extends MongoRepository<FeedbackDocument, String> {
    Optional<FeedbackDocument> findByFeedbackOracleId(Long feedbackOracleId);
    List<FeedbackDocument> findAllByFeedbackOracleIdIn(Collection<Long> feedbackOracleIds);
}
