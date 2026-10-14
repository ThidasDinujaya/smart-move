package com.smartmove.backend.data;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "feedback")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long passengerId;
    private Long tripId;
    private Integer rating;
    @Column(name = "driver_rating")
    private Integer driverRating;
    @Column(name = "vehicle_rating")
    private Integer vehicleRating;
    @Column(name = "review_status")
    private String reviewStatus = "NEW";
    @Transient
    private String comment;
    @Transient
    private Boolean isComplaint = false;
    @Transient
    private String routeName;
    @Transient
    private Long vehicleOracleId;
    @Transient
    private String registrationNo;
    @Transient
    private Long driverOracleId;
    @Transient
    private String driverName;
    @Transient
    private List<String> keywords;
    @Transient
    private Map<String, Object> response;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPassengerId() { return passengerId; }
    public void setPassengerId(Long passengerId) { this.passengerId = passengerId; }
    public Long getTripId() { return tripId; }
    public void setTripId(Long tripId) { this.tripId = tripId; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public Integer getDriverRating() { return driverRating; }
    public void setDriverRating(Integer driverRating) { this.driverRating = driverRating; }
    public Integer getVehicleRating() { return vehicleRating; }
    public void setVehicleRating(Integer vehicleRating) { this.vehicleRating = vehicleRating; }
    public String getReviewStatus() { return reviewStatus; }
    public void setReviewStatus(String reviewStatus) { this.reviewStatus = reviewStatus; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public Boolean getIsComplaint() { return isComplaint; }
    public void setIsComplaint(Boolean complaint) { isComplaint = complaint; }
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
    public List<String> getKeywords() { return keywords; }
    public void setKeywords(List<String> keywords) { this.keywords = keywords; }
    public Map<String, Object> getResponse() { return response; }
    public void setResponse(Map<String, Object> response) { this.response = response; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
