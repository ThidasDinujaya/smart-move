package com.smartmove.backend.Controller;

import com.smartmove.backend.Data.NotificationDocument;
import com.smartmove.backend.Data.NotificationRepository;
import com.smartmove.backend.Data.TravelAnnouncementDocument;
import com.smartmove.backend.Data.TravelAnnouncementRepository;
import com.smartmove.backend.Data.TripMediaDocument;
import com.smartmove.backend.Data.TripMediaRepository;
import com.smartmove.backend.service.CustomerAuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.time.Instant;

@RestController
@RequestMapping("/api/content")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class MongoContentController {
    private final TravelAnnouncementRepository announcementRepository;
    private final NotificationRepository notificationRepository;
    private final TripMediaRepository tripMediaRepository;
    private final CustomerAuthService customerAuthService;

    public MongoContentController(
            TravelAnnouncementRepository announcementRepository,
            NotificationRepository notificationRepository,
            TripMediaRepository tripMediaRepository,
            CustomerAuthService customerAuthService
    ) {
        this.announcementRepository = announcementRepository;
        this.notificationRepository = notificationRepository;
        this.tripMediaRepository = tripMediaRepository;
        this.customerAuthService = customerAuthService;
    }

    @GetMapping("/announcements")
    public List<TravelAnnouncementDocument> getActiveAnnouncements() {
        return announcementRepository.findByActiveTrueOrderByPublishedAtDesc();
    }

    @GetMapping("/notifications/{recipientOracleId}")
    public List<NotificationDocument> getNotifications(@PathVariable Long recipientOracleId) {
        return notificationRepository.findByRecipientOracleIdOrderByCreatedAtDesc(recipientOracleId);
    }

    @PutMapping("/notifications/{notificationId}/read")
    public NotificationDocument markNotificationRead(
            @PathVariable String notificationId,
            @RequestHeader(name = "X-User-Id", required = false) String userId
    ) {
        CustomerAuthService.CustomerView customer = customerAuthService.currentCustomer(userId);
        NotificationDocument notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification was not found."));
        if (!notification.getRecipientOracleId().equals(customer.id())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This notification belongs to another account.");
        }
        notification.setStatus("READ");
        notification.setReadAt(Instant.now());
        return notificationRepository.save(notification);
    }

    @GetMapping("/trips/{tripOracleId}/media")
    public List<TripMediaDocument> getTripMedia(@PathVariable Long tripOracleId) {
        return tripMediaRepository.findByTripOracleIdOrderByUploadedAtDesc(tripOracleId);
    }
}
