package com.smartmove.backend.data;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.Map;

@Document(collection = "trip_media")
public class TripMediaDocument {
    @Id
    private String id;
    private Long tripOracleId;
    private String mediaType;
    private String title;
    private String description;
    private String contentType;
    private String storageUrl;
    private String mediaData;
    private Instant uploadedAt;
    private Long uploadedByOracleId;
    private String location;
    private Map<String, Object> metadata;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Long getTripOracleId() { return tripOracleId; }
    public void setTripOracleId(Long tripOracleId) { this.tripOracleId = tripOracleId; }
    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public String getStorageUrl() { return storageUrl; }
    public void setStorageUrl(String storageUrl) { this.storageUrl = storageUrl; }
    public String getMediaData() { return mediaData; }
    public void setMediaData(String mediaData) { this.mediaData = mediaData; }
    public Instant getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(Instant uploadedAt) { this.uploadedAt = uploadedAt; }
    public Long getUploadedByOracleId() { return uploadedByOracleId; }
    public void setUploadedByOracleId(Long uploadedByOracleId) { this.uploadedByOracleId = uploadedByOracleId; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
}
