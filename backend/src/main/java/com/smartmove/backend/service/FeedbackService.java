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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FeedbackService {
    private final FeedbackRepository feedbackRepository;
    private final FeedbackDocumentRepository feedbackDocumentRepository;
    private final TripRepository tripRepository;
    private final BookingRepository bookingRepository;
    private final CustomerAuthService customerAuthService;
    private final TripCompletionService tripCompletionService;

    public FeedbackService(
            FeedbackRepository feedbackRepository,
            FeedbackDocumentRepository feedbackDocumentRepository,
            TripRepository tripRepository,
            BookingRepository bookingRepository,
            CustomerAuthService customerAuthService,
            TripCompletionService tripCompletionService
    ) {
        this.feedbackRepository = feedbackRepository;
        this.feedbackDocumentRepository = feedbackDocumentRepository;
        this.tripRepository = tripRepository;
        this.bookingRepository = bookingRepository;
        this.customerAuthService = customerAuthService;
        this.tripCompletionService = tripCompletionService;
    }

    @Transactional(readOnly = true)
    public List<Feedback> getAllFeedback(String userId) {
        customerAuthService.requireAnyRole(userId, "ADMIN", "SUPPORT");
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
                feedback.setRouteName(document.getRouteName());
                feedback.setVehicleOracleId(document.getVehicleOracleId());
                feedback.setRegistrationNo(document.getRegistrationNo());
                feedback.setDriverOracleId(document.getDriverOracleId());
                feedback.setDriverName(document.getDriverName());
            }
        });
    }

    @Transactional
    public Feedback saveFeedback(Feedback feedback, String userId) {
        if (feedback == null || feedback.getTripId() == null) {
            throw new IllegalArgumentException("Trip details are required for feedback.");
        }
        CustomerAuthService.CustomerView customer = requireCustomer(userId);
        tripCompletionService.completeArrivedTripsBeforeReadingBookings();
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
        document.setSubmittedAt(savedFeedback.getCreatedAt());
        feedbackDocumentRepository.save(document);

        savedFeedback.setComment(comment);
        savedFeedback.setRouteName(document.getRouteName());
        savedFeedback.setVehicleOracleId(document.getVehicleOracleId());
        savedFeedback.setRegistrationNo(document.getRegistrationNo());
        savedFeedback.setDriverOracleId(document.getDriverOracleId());
        savedFeedback.setDriverName(document.getDriverName());
        return savedFeedback;
    }

    private CustomerAuthService.CustomerView requireCustomer(String userId) {
        return customerAuthService.requireAnyRole(userId, "CUSTOMER");
    }

    private boolean validRating(Integer rating) {
        return rating == null || (rating >= 1 && rating <= 5);
    }

}
