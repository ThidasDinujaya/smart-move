package com.smartmove.backend.data;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.Map;

@Document(collection = "notifications")
public class NotificationDocument {
    @Id
    private String id;
    private String displayId;
    private Long recipientOracleId;
    private String recipientRole;
    private String notificationType;
    private String title;
    private String message;
    private Long relatedTripOracleId;
    private String channel;
    private Instant createdAt;
    private Instant readAt;
    private String status;
    private String bookingReference;
    private Map<String, Object> details;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getDisplayId() { return displayId; }
    public void setDisplayId(String displayId) { this.displayId = displayId; }
    public Long getRecipientOracleId() { return recipientOracleId; }
    public void setRecipientOracleId(Long recipientOracleId) { this.recipientOracleId = recipientOracleId; }
    public String getRecipientRole() { return recipientRole; }
    public void setRecipientRole(String recipientRole) { this.recipientRole = recipientRole; }
    public String getNotificationType() { return notificationType; }
    public void setNotificationType(String notificationType) { this.notificationType = notificationType; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Long getRelatedTripOracleId() { return relatedTripOracleId; }
    public void setRelatedTripOracleId(Long relatedTripOracleId) { this.relatedTripOracleId = relatedTripOracleId; }
    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getReadAt() { return readAt; }
    public void setReadAt(Instant readAt) { this.readAt = readAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }
    public Map<String, Object> getDetails() { return details; }
    public void setDetails(Map<String, Object> details) { this.details = details; }
}
