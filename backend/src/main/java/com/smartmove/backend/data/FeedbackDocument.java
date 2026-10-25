package com.smartmove.backend.data;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "feedback")
public class FeedbackDocument {
    @Id
    private String id;
    private Long feedbackOracleId;
    private Long passengerOracleId;
    private Long tripOracleId;
    private Long routeOracleId;
    private String routeName;
    private Long vehicleOracleId;
    private String registrationNo;
    private Long driverOracleId;
    private String driverName;
    private FeedbackRatings ratings;
    private String comment;
    private LocalDateTime submittedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Long getFeedbackOracleId() { return feedbackOracleId; }
    public void setFeedbackOracleId(Long feedbackOracleId) { this.feedbackOracleId = feedbackOracleId; }
    public Long getPassengerOracleId() { return passengerOracleId; }
    public void setPassengerOracleId(Long passengerOracleId) { this.passengerOracleId = passengerOracleId; }
    public Long getTripOracleId() { return tripOracleId; }
    public void setTripOracleId(Long tripOracleId) { this.tripOracleId = tripOracleId; }
    public Long getRouteOracleId() { return routeOracleId; }
    public void setRouteOracleId(Long routeOracleId) { this.routeOracleId = routeOracleId; }
    public String getRouteName() { return routeName; }
    public void setRouteName(String routeName) { this.routeName = routeName; }
    public Long getVehicleOracleId() { return vehicleOracleId; }
    public void setVehicleOracleId(Long vehicleOracleId) { this.vehicleOracleId = vehicleOracleId; }
    public String getRegistrationNo() { return registrationNo; }
    public void setRegistrationNo(String registrationNo) { this.registrationNo = registrationNo; }
    public Long getDriverOracleId() { return driverOracleId; }
    public void setDriverOracleId(Long driverOracleId) { this.driverOracleId = driverOracleId; }
    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
    public FeedbackRatings getRatings() { return ratings; }
    public void setRatings(FeedbackRatings ratings) { this.ratings = ratings; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public static class FeedbackRatings {
        private Integer overall;
        private Integer vehicle;
        private Integer driver;

        public FeedbackRatings() { }
        public FeedbackRatings(Integer overall, Integer vehicle, Integer driver) {
            this.overall = overall;
            this.vehicle = vehicle;
            this.driver = driver;
        }
        public Integer getOverall() { return overall; }
        public void setOverall(Integer overall) { this.overall = overall; }
        public Integer getVehicle() { return vehicle; }
        public void setVehicle(Integer vehicle) { this.vehicle = vehicle; }
        public Integer getDriver() { return driver; }
        public void setDriver(Integer driver) { this.driver = driver; }
    }
}
