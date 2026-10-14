package com.smartmove.backend.data;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "travel_announcements")
public class TravelAnnouncementDocument {
    @Id
    private String id;
    private String displayId;
    private String title;
    private String message;
    private String severity;
    private List<Long> routeOracleIds;
    private List<String> audience;
    private Instant publishedAt;
    private Instant startsAt;
    private Instant endsAt;
    private Boolean active;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getDisplayId() { return displayId; }
    public void setDisplayId(String displayId) { this.displayId = displayId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public List<Long> getRouteOracleIds() { return routeOracleIds; }
    public void setRouteOracleIds(List<Long> routeOracleIds) { this.routeOracleIds = routeOracleIds; }
    public List<String> getAudience() { return audience; }
    public void setAudience(List<String> audience) { this.audience = audience; }
    public Instant getPublishedAt() { return publishedAt; }
    public void setPublishedAt(Instant publishedAt) { this.publishedAt = publishedAt; }
    public Instant getStartsAt() { return startsAt; }
    public void setStartsAt(Instant startsAt) { this.startsAt = startsAt; }
    public Instant getEndsAt() { return endsAt; }
    public void setEndsAt(Instant endsAt) { this.endsAt = endsAt; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
