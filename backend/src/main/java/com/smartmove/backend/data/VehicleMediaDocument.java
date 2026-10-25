package com.smartmove.backend.data;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Document(collection = "vehicle_media")
public class VehicleMediaDocument {
    @Id
    private String id;
    private String displayId;
    private Long vehicleOracleId;
    private String registrationNo;
    private String mediaType;
    private String title;
    private String fileName;
    private String contentType;
    private String mediaData;
    @JsonIgnore
    @Field("imageData")
    private String legacyImageData;
    private Instant uploadedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getDisplayId() { return displayId; }
    public void setDisplayId(String displayId) { this.displayId = displayId; }
    public Long getVehicleOracleId() { return vehicleOracleId; }
    public void setVehicleOracleId(Long vehicleOracleId) { this.vehicleOracleId = vehicleOracleId; }
    public String getRegistrationNo() { return registrationNo; }
    public void setRegistrationNo(String registrationNo) { this.registrationNo = registrationNo; }
    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public String getMediaData() { return mediaData == null ? legacyImageData : mediaData; }
    public void setMediaData(String mediaData) { this.mediaData = mediaData; }
    public void clearLegacyImageData() { this.legacyImageData = null; }
    public Instant getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(Instant uploadedAt) { this.uploadedAt = uploadedAt; }
}
