package com.smartmove.backend.service;

import org.bson.Document;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
public class PublicIdService {
    private static final String SEQUENCE_COLLECTION = "id_sequences";

    private final MongoTemplate mongoTemplate;

    public PublicIdService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public String nextId(String sequenceName, String prefix, long highestExistingId) {
        Query sequenceQuery = Query.query(Criteria.where("_id").is(sequenceName));
        try {
            mongoTemplate.upsert(
                    sequenceQuery,
                    new Update().max("value", Math.max(999L, highestExistingId)),
                    SEQUENCE_COLLECTION);
        } catch (DuplicateKeyException ignored) {
            // Another request created this sequence at the same time; the increment below is atomic.
        }

        Document sequence = mongoTemplate.findAndModify(
                sequenceQuery,
                new Update().inc("value", 1L),
                FindAndModifyOptions.options().returnNew(true),
                Document.class,
                SEQUENCE_COLLECTION);
        if (sequence == null || !(sequence.get("value") instanceof Number value)) {
            throw new IllegalStateException("Unable to allocate a public record ID.");
        }
        return prefix + value.longValue();
    }
}
