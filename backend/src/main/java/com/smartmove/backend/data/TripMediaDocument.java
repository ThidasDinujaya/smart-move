package com.smartmove.backend.data;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "trip_media")
public class TripMediaDocument {
    @Id
    private String id;
    private String displayId;
    private Long tripOracleId;
    private String mediaType;
    private String title;
    private String fileName;
    private String contentType;
    private String mediaData;
    private Instant uploadedAt;
    private Long uploadedByOracleId;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getDisplayId() { return displayId; }
    public void setDisplayId(String displayId) { this.displayId = displayId; }
    public Long getTripOracleId() { return tripOracleId; }
    public void setTripOracleId(Long tripOracleId) { this.tripOracleId = tripOracleId; }
    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public String getMediaData() { return mediaData; }
    public void setMediaData(String mediaData) { this.mediaData = mediaData; }
    public Instant getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(Instant uploadedAt) { this.uploadedAt = uploadedAt; }
    public Long getUploadedByOracleId() { return uploadedByOracleId; }
    public void setUploadedByOracleId(Long uploadedByOracleId) { this.uploadedByOracleId = uploadedByOracleId; }
}
