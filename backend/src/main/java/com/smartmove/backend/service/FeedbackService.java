package com.smartmove.backend.service;

import com.smartmove.backend.data.Feedback;
import com.smartmove.backend.data.FeedbackDocument;
import com.smartmove.backend.data.FeedbackDocumentRepository;
import com.smartmove.backend.data.FeedbackRepository;
import com.smartmove.backend.data.BookingRepository;
import com.smartmove.backend.data.Trip;
import com.smartmove.backend.data.TripRepository;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final FeedbackDocumentRepository feedbackDocumentRepository;
    private final TripRepository tripRepository;
    private final BookingRepository bookingRepository;
    private final CustomerAuthService customerAuthService;

    public FeedbackService(
            FeedbackRepository feedbackRepository,
            FeedbackDocumentRepository feedbackDocumentRepository,
            TripRepository tripRepository,
            BookingRepository bookingRepository,
            CustomerAuthService customerAuthService
    ) {
        this.feedbackRepository = feedbackRepository;
        this.feedbackDocumentRepository = feedbackDocumentRepository;
        this.tripRepository = tripRepository;
        this.bookingRepository = bookingRepository;
        this.customerAuthService = customerAuthService;
    }

    @Transactional(readOnly = true)
    public List<Feedback> getAllFeedback() {
        List<Feedback> feedbackRows = feedbackRepository.findAll();
        attachMongoDetails(feedbackRows);
        return feedbackRows;
    }

    @Transactional(readOnly = true)
    public List<Feedback> getMyFeedback(String userId) {
        CustomerAuthService.CustomerView customer = requireCustomer(userId);
        List<Feedback> feedbackRows = feedbackRepository.findByPassengerIdOrderByCreatedAtDesc(customer.id());
        attachMongoDetails(feedbackRows);
        return feedbackRows;
    }

    private void attachMongoDetails(List<Feedback> feedbackRows) {
        List<Long> feedbackIds = feedbackRows.stream().map(Feedback::getId).toList();
        Map<Long, FeedbackDocument> commentsByFeedbackId = new HashMap<>();

        if (!feedbackIds.isEmpty()) {
            feedbackDocumentRepository.findAllByFeedbackOracleIdIn(feedbackIds)
                    .forEach(document -> commentsByFeedbackId.put(document.getFeedbackOracleId(), document));
        }

        feedbackRows.forEach(feedback -> {
            FeedbackDocument document = commentsByFeedbackId.get(feedback.getId());
            if (document != null) {
                feedback.setComment(document.getComment());
                feedback.setIsComplaint(document.getIsComplaint());
                feedback.setRouteName(document.getRouteName());
                feedback.setVehicleOracleId(document.getVehicleOracleId());
                feedback.setRegistrationNo(document.getRegistrationNo());
                feedback.setDriverOracleId(document.getDriverOracleId());
                feedback.setDriverName(document.getDriverName());
                feedback.setKeywords(document.getKeywords());
                feedback.setResponse(document.getResponse());
            }
        });
    }

    @Transactional
    public Feedback saveFeedback(Feedback feedback, String userId) {
        if (feedback == null || feedback.getTripId() == null) {
            throw new IllegalArgumentException("Trip details are required for feedback.");
        }
        CustomerAuthService.CustomerView customer = requireCustomer(userId);
        if (feedback.getRating() == null || !validRating(feedback.getRating()) || !validRating(feedback.getDriverRating())
                || !validRating(feedback.getVehicleRating())) {
            throw new IllegalArgumentException("Choose a rating from 1 to 5 for each category.");
        }
        Trip trip = tripRepository.findById(feedback.getTripId())
                .orElseThrow(() -> new IllegalArgumentException("Trip was not found."));
        if (!"Completed".equalsIgnoreCase(trip.getStatus())) {
            throw new IllegalArgumentException("Feedback can be submitted after a trip is completed.");
        }
        if (!bookingRepository.existsByPassenger_IdAndTrip_IdAndBookingStatus(customer.id(), trip.getId(), "Completed")) {
            throw new IllegalArgumentException("Feedback is available only for your completed bookings.");
        }
        if (feedbackRepository.existsByPassengerIdAndTripId(customer.id(), trip.getId())) {
            throw new IllegalArgumentException("You have already submitted feedback for this trip.");
        }
        feedback.setId(null);
        feedback.setPassengerId(customer.id());
        feedback.setReviewStatus("NEW");
        feedback.setCreatedAt(LocalDateTime.now());
        if (feedback.getDriverRating() == null) {
            feedback.setDriverRating(feedback.getRating());
        }
        if (feedback.getVehicleRating() == null) {
            feedback.setVehicleRating(feedback.getRating());
        }

        String comment = feedback.getComment();
        Feedback savedFeedback = feedbackRepository.save(feedback);

        FeedbackDocument document = feedbackDocumentRepository
                .findByFeedbackOracleId(savedFeedback.getId())
                .orElseGet(FeedbackDocument::new);
        document.setFeedbackOracleId(savedFeedback.getId());
        document.setPassengerOracleId(savedFeedback.getPassengerId());
        document.setTripOracleId(trip.getId());
        document.setRouteOracleId(trip.getRoute().getId());
        document.setRouteName(trip.getRoute().getRouteName());
        document.setVehicleOracleId(trip.getVehicle().getId());
        document.setRegistrationNo(trip.getVehicle().getVehicleNo());
        document.setDriverOracleId(trip.getDriver().getId());
        document.setDriverName(trip.getDriver().getName());
        document.setRatings(new FeedbackDocument.FeedbackRatings(
                savedFeedback.getRating(), savedFeedback.getVehicleRating(), savedFeedback.getDriverRating()));
        document.setComment(comment);
        document.setIsComplaint(Boolean.TRUE.equals(feedback.getIsComplaint()));
        document.setKeywords(keywordsFrom(comment));
        document.setSubmittedAt(savedFeedback.getCreatedAt());
        document.setModerationStatus(Optional.ofNullable(savedFeedback.getReviewStatus()).orElse("NEW"));
        feedbackDocumentRepository.save(document);

        savedFeedback.setComment(comment);
        savedFeedback.setIsComplaint(feedback.getIsComplaint());
        savedFeedback.setRouteName(document.getRouteName());
        savedFeedback.setVehicleOracleId(document.getVehicleOracleId());
        savedFeedback.setRegistrationNo(document.getRegistrationNo());
        savedFeedback.setDriverOracleId(document.getDriverOracleId());
        savedFeedback.setDriverName(document.getDriverName());
        savedFeedback.setKeywords(document.getKeywords());
        savedFeedback.setResponse(document.getResponse());
        return savedFeedback;
    }

    @Transactional
    public Feedback updateReviewStatus(Long feedbackId, String requestedStatus, String userId) {
        CustomerAuthService.CustomerView currentUser = customerAuthService.currentCustomer(userId);
        boolean canReview = currentUser.roles().stream().anyMatch(role ->
                "ADMIN".equalsIgnoreCase(role) || "SUPPORT".equalsIgnoreCase(role));
        if (!canReview) {
            throw new IllegalArgumentException("An admin or support account is required to review feedback.");
        }

        String status = requestedStatus == null ? "" : requestedStatus.trim().toUpperCase();
        if (!List.of("NEW", "REVIEWED", "HIDDEN").contains(status)) {
            throw new IllegalArgumentException("Review status must be New, Reviewed, or Hidden.");
        }

        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new IllegalArgumentException("Feedback was not found."));
        feedback.setReviewStatus(status);
        Feedback savedFeedback = feedbackRepository.save(feedback);
        feedbackDocumentRepository.findByFeedbackOracleId(feedbackId).ifPresent(document -> {
            document.setModerationStatus(status);
            feedbackDocumentRepository.save(document);
            savedFeedback.setComment(document.getComment());
            savedFeedback.setIsComplaint(document.getIsComplaint());
            savedFeedback.setRouteName(document.getRouteName());
            savedFeedback.setVehicleOracleId(document.getVehicleOracleId());
            savedFeedback.setRegistrationNo(document.getRegistrationNo());
            savedFeedback.setDriverOracleId(document.getDriverOracleId());
            savedFeedback.setDriverName(document.getDriverName());
            savedFeedback.setKeywords(document.getKeywords());
            savedFeedback.setResponse(document.getResponse());
        });
        return savedFeedback;
    }

    private CustomerAuthService.CustomerView requireCustomer(String userId) {
        CustomerAuthService.CustomerView customer = customerAuthService.currentCustomer(userId);
        if (customer.roles().stream().noneMatch(role -> "CUSTOMER".equalsIgnoreCase(role))) {
            throw new IllegalArgumentException("A customer account is required to submit feedback.");
        }
        return customer;
    }

    private boolean validRating(Integer rating) {
        return rating == null || (rating >= 1 && rating <= 5);
    }

    private List<String> keywordsFrom(String comment) {
        List<String> keywords = new ArrayList<>();
        if (comment == null || comment.isBlank()) {
            return keywords;
        }

        for (String word : comment.toLowerCase().split("[^a-z0-9]+")) {
            if (word.length() > 2 && !keywords.contains(word)) {
                keywords.add(word);
            }
        }
        return keywords;
    }
}
