package com.smartmove.backend.controller;

import com.smartmove.backend.data.NotificationDocument;
import com.smartmove.backend.data.NotificationRepository;
import com.smartmove.backend.data.PassengerRepository;
import com.smartmove.backend.data.TravelAnnouncementDocument;
import com.smartmove.backend.data.TravelAnnouncementRepository;
import com.smartmove.backend.data.TripMediaDocument;
import com.smartmove.backend.data.TripMediaRepository;
import com.smartmove.backend.data.TripRepository;
import com.smartmove.backend.data.Vehicle;
import com.smartmove.backend.data.VehicleMediaDocument;
import com.smartmove.backend.data.VehicleMediaRepository;
import com.smartmove.backend.data.VehicleRepository;
import com.smartmove.backend.service.CustomerAuthService;
import com.smartmove.backend.service.PublicIdService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/content")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class MongoContentController {
    private static final int MAX_MEDIA_DATA_LENGTH = 14 * 1024 * 1024;

    private final TravelAnnouncementRepository announcementRepository;
    private final NotificationRepository notificationRepository;
    private final TripMediaRepository tripMediaRepository;
    private final VehicleMediaRepository vehicleMediaRepository;
    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final PassengerRepository passengerRepository;
    private final CustomerAuthService customerAuthService;
    private final PublicIdService publicIdService;

    public MongoContentController(
            TravelAnnouncementRepository announcementRepository,
            NotificationRepository notificationRepository,
            TripMediaRepository tripMediaRepository,
            VehicleMediaRepository vehicleMediaRepository,
            TripRepository tripRepository,
            VehicleRepository vehicleRepository,
            PassengerRepository passengerRepository,
            CustomerAuthService customerAuthService,
            PublicIdService publicIdService) {
        this.announcementRepository = announcementRepository;
        this.notificationRepository = notificationRepository;
        this.tripMediaRepository = tripMediaRepository;
        this.vehicleMediaRepository = vehicleMediaRepository;
        this.tripRepository = tripRepository;
        this.vehicleRepository = vehicleRepository;
        this.passengerRepository = passengerRepository;
        this.customerAuthService = customerAuthService;
        this.publicIdService = publicIdService;
    }

    @GetMapping("/announcements")
    public List<TravelAnnouncementDocument> getActiveAnnouncements(
            @RequestHeader(name = "X-User-Id", required = false) String userId,
            @RequestParam(required = false) Long routeId) {
        List<String> roles = userId == null || userId.isBlank()
                ? List.of("CUSTOMER")
                : customerAuthService.currentCustomer(userId).roles();
        ensureAnnouncementDisplayIds(announcementRepository.findAll());
        Instant now = Instant.now();
        List<TravelAnnouncementDocument> announcements = announcementRepository.findByActiveTrueOrderByPublishedAtDesc().stream()
                .filter(item -> item.getPublishedAt() == null || !item.getPublishedAt().isAfter(now))
                .filter(item -> item.getStartsAt() == null || !item.getStartsAt().isAfter(now))
                .filter(item -> item.getEndsAt() == null || !item.getEndsAt().isBefore(now))
                .filter(item -> audienceMatches(item.getAudience(), roles))
                .filter(item -> item.getRouteOracleIds() == null || item.getRouteOracleIds().isEmpty()
                        || routeId != null && item.getRouteOracleIds().contains(routeId))
                .toList();
        return ensureAnnouncementDisplayIds(announcements);
    }

    @GetMapping("/notifications/{recipientOracleId}")
    public List<NotificationDocument> getNotifications(
            @PathVariable Long recipientOracleId,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        CustomerAuthService.CustomerView customer = customerAuthService.requireAnyRole(userId, "CUSTOMER");
        if (!customer.id().equals(recipientOracleId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only view your own notifications.");
        }
        ensureNotificationDisplayIds(notificationRepository.findAll());
        return ensureNotificationDisplayIds(notificationRepository.findByRecipientOracleIdOrderByCreatedAtDesc(recipientOracleId));
    }

    @PutMapping("/notifications/{notificationId}/read")
    public NotificationDocument markNotificationRead(
            @PathVariable String notificationId,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        CustomerAuthService.CustomerView customer = customerAuthService.requireAnyRole(userId, "CUSTOMER");
        NotificationDocument notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification was not found."));
        if (notification.getRecipientOracleId() == null
                || !notification.getRecipientOracleId().equals(customer.id())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This notification belongs to another account.");
        }
        notification.setStatus("READ");
        notification.setReadAt(Instant.now());
        return notificationRepository.save(notification);
    }

    @GetMapping("/trips/{tripOracleId}/media")
    public List<TripMediaDocument> getTripMedia(@PathVariable Long tripOracleId) {
        ensureTripMediaDisplayIds(tripMediaRepository.findAll());
        return ensureTripMediaDisplayIds(tripMediaRepository.findByTripOracleIdOrderByUploadedAtDesc(tripOracleId));
    }

    @GetMapping("/admin/announcements")
    public List<TravelAnnouncementDocument> getAllAnnouncements(
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        requireContentStaff(userId);
        return ensureAnnouncementDisplayIds(announcementRepository.findAll());
    }

    @PostMapping("/admin/announcements")
    public TravelAnnouncementDocument createAnnouncement(
            @RequestBody TravelAnnouncementDocument request,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        requireContentStaff(userId);
        requireText(request.getTitle(), "An announcement title is required.");
        requireText(request.getMessage(), "An announcement message is required.");
        validateAnnouncementAudience(request);
        request.setId(null);
        request.setDisplayId(nextDisplayId("announcements", "A", announcementRepository.findAll().stream()
                .map(TravelAnnouncementDocument::getDisplayId).toList()));
        if (request.getPublishedAt() == null) request.setPublishedAt(Instant.now());
        if (request.getActive() == null) request.setActive(true);
        return announcementRepository.save(request);
    }

    @PutMapping("/admin/announcements/{id}")
    public TravelAnnouncementDocument updateAnnouncement(
            @PathVariable String id,
            @RequestBody TravelAnnouncementDocument request,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        requireContentStaff(userId);
        TravelAnnouncementDocument saved = announcementRepository.findById(id)
                .orElseThrow(() -> notFound("Announcement was not found."));
        requireText(request.getTitle(), "An announcement title is required.");
        requireText(request.getMessage(), "An announcement message is required.");
        validateAnnouncementAudience(request);
        request.setId(id);
        request.setDisplayId(saved.getDisplayId());
        if (request.getPublishedAt() == null) request.setPublishedAt(saved.getPublishedAt());
        return announcementRepository.save(request);
    }

    @DeleteMapping("/admin/announcements/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAnnouncement(
            @PathVariable String id,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        requireContentStaff(userId);
        if (!announcementRepository.existsById(id)) throw notFound("Announcement was not found.");
        announcementRepository.deleteById(id);
    }

    @GetMapping("/admin/notifications")
    public List<NotificationDocument> getAllNotifications(
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        requireContentStaff(userId);
        return ensureNotificationDisplayIds(notificationRepository.findAll());
    }

    @PostMapping("/admin/notifications")
    public NotificationDocument createNotification(
            @RequestBody NotificationDocument request,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        requireContentStaff(userId);
        validateNotification(request);
        request.setId(null);
        request.setDisplayId(nextDisplayId("notifications", "N", notificationRepository.findAll().stream()
                .map(NotificationDocument::getDisplayId).toList()));
        request.setCreatedAt(Instant.now());
        request.setReadAt(null);
        request.setStatus("UNREAD");
        if (request.getRecipientRole() == null || request.getRecipientRole().isBlank()) {
            request.setRecipientRole("CUSTOMER");
        }
        if (request.getChannel() == null || request.getChannel().isBlank()) request.setChannel("IN_APP");
        return notificationRepository.save(request);
    }

    @PutMapping("/admin/notifications/{id}")
    public NotificationDocument updateNotification(
            @PathVariable String id,
            @RequestBody NotificationDocument request,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        requireContentStaff(userId);
        NotificationDocument saved = notificationRepository.findById(id)
                .orElseThrow(() -> notFound("Notification was not found."));
        validateNotification(request);
        request.setId(id);
        request.setDisplayId(saved.getDisplayId());
        request.setCreatedAt(saved.getCreatedAt());
        request.setReadAt(saved.getReadAt());
        request.setStatus(saved.getStatus());
        if (request.getChannel() == null || request.getChannel().isBlank()) request.setChannel(saved.getChannel());
        return notificationRepository.save(request);
    }

    @DeleteMapping("/admin/notifications/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteNotification(
            @PathVariable String id,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        requireContentStaff(userId);
        if (!notificationRepository.existsById(id)) throw notFound("Notification was not found.");
        notificationRepository.deleteById(id);
    }

    @GetMapping("/admin/trip-media")
    public List<TripMediaDocument> getAllTripMedia(
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        requireContentStaff(userId);
        return ensureTripMediaDisplayIds(tripMediaRepository.findAll());
    }

    @PostMapping("/admin/trip-media")
    public TripMediaDocument createTripMedia(
            @RequestBody TripMediaDocument request,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        CustomerAuthService.CustomerView staff = requireContentStaff(userId);
        validateTripMedia(request);
        request.setId(null);
        request.setDisplayId(nextDisplayId("trip_media", "TM", tripMediaRepository.findAll().stream()
                .map(TripMediaDocument::getDisplayId).toList()));
        request.setUploadedAt(Instant.now());
        request.setUploadedByOracleId(staff.id());
        return tripMediaRepository.save(request);
    }

    @PutMapping("/admin/trip-media/{id}")
    public TripMediaDocument updateTripMedia(
            @PathVariable String id,
            @RequestBody TripMediaDocument request,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        requireContentStaff(userId);
        TripMediaDocument saved = tripMediaRepository.findById(id)
                .orElseThrow(() -> notFound("Trip media was not found."));
        validateTripMedia(request);
        request.setId(id);
        request.setDisplayId(saved.getDisplayId());
        request.setUploadedAt(saved.getUploadedAt());
        request.setUploadedByOracleId(saved.getUploadedByOracleId());
        if (request.getMediaData() == null) request.setMediaData(saved.getMediaData());
        return tripMediaRepository.save(request);
    }

    @DeleteMapping("/admin/trip-media/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTripMedia(
            @PathVariable String id,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        requireContentStaff(userId);
        if (!tripMediaRepository.existsById(id)) throw notFound("Trip media was not found.");
        tripMediaRepository.deleteById(id);
    }

    @GetMapping("/admin/vehicle-media")
    public List<VehicleMediaDocument> getAllVehicleMedia(
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        requireContentStaff(userId);
        return ensureVehicleMediaDisplayIds(vehicleMediaRepository.findAll());
    }

    @PostMapping("/admin/vehicle-media")
    public VehicleMediaDocument createVehicleMedia(
            @RequestBody VehicleMediaDocument request,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        requireContentStaff(userId);
        Vehicle vehicle = validateVehicleMedia(request);
        request.setId(null);
        request.setDisplayId(nextDisplayId("vehicle_media", "VM", vehicleMediaRepository.findAll().stream()
                .map(VehicleMediaDocument::getDisplayId).toList()));
        request.setRegistrationNo(vehicle.getVehicleNo());
        request.setUploadedAt(Instant.now());
        return vehicleMediaRepository.save(request);
    }

    @PutMapping("/admin/vehicle-media/{id}")
    public VehicleMediaDocument updateVehicleMedia(
            @PathVariable String id,
            @RequestBody VehicleMediaDocument request,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        requireContentStaff(userId);
        VehicleMediaDocument saved = vehicleMediaRepository.findById(id)
                .orElseThrow(() -> notFound("Vehicle media was not found."));
        Vehicle vehicle = validateVehicleMedia(request);
        request.setId(id);
        request.setDisplayId(saved.getDisplayId());
        request.setRegistrationNo(vehicle.getVehicleNo());
        request.setUploadedAt(saved.getUploadedAt());
        if (request.getMediaData() == null) {
            request.setMediaData(saved.getMediaData());
            if (request.getImageData() == null) request.setImageData(saved.getImageData());
        }
        return vehicleMediaRepository.save(request);
    }

    @DeleteMapping("/admin/vehicle-media/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteVehicleMedia(
            @PathVariable String id,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        requireContentStaff(userId);
        if (!vehicleMediaRepository.existsById(id)) throw notFound("Vehicle media was not found.");
        vehicleMediaRepository.deleteById(id);
    }

    private CustomerAuthService.CustomerView requireContentStaff(String userId) {
        return customerAuthService.requireAnyRole(userId, "ADMIN", "OPERATIONS");
    }

    private List<TravelAnnouncementDocument> ensureAnnouncementDisplayIds(List<TravelAnnouncementDocument> records) {
        List<TravelAnnouncementDocument> results = new ArrayList<>(records);
        long highest = highestDisplayNumber(results.stream().map(TravelAnnouncementDocument::getDisplayId).toList(), "A");
        for (int index = 0; index < results.size(); index++) {
            TravelAnnouncementDocument record = results.get(index);
            if (record.getDisplayId() == null || record.getDisplayId().isBlank()) {
                record.setDisplayId(publicIdService.nextId("announcements", "A", highest));
                highest = highestDisplayNumber(List.of(record.getDisplayId()), "A");
                results.set(index, announcementRepository.save(record));
            }
        }
        return results;
    }

    private List<NotificationDocument> ensureNotificationDisplayIds(List<NotificationDocument> records) {
        List<NotificationDocument> results = new ArrayList<>(records);
        long highest = highestDisplayNumber(results.stream().map(NotificationDocument::getDisplayId).toList(), "N");
        for (int index = 0; index < results.size(); index++) {
            NotificationDocument record = results.get(index);
            if (record.getDisplayId() == null || record.getDisplayId().isBlank()) {
                record.setDisplayId(publicIdService.nextId("notifications", "N", highest));
                highest = highestDisplayNumber(List.of(record.getDisplayId()), "N");
                results.set(index, notificationRepository.save(record));
            }
        }
        return results;
    }

    private List<TripMediaDocument> ensureTripMediaDisplayIds(List<TripMediaDocument> records) {
        List<TripMediaDocument> results = new ArrayList<>(records);
        long highest = highestDisplayNumber(results.stream().map(TripMediaDocument::getDisplayId).toList(), "TM");
        for (int index = 0; index < results.size(); index++) {
            TripMediaDocument record = results.get(index);
            if (record.getDisplayId() == null || record.getDisplayId().isBlank()) {
                record.setDisplayId(publicIdService.nextId("trip_media", "TM", highest));
                highest = highestDisplayNumber(List.of(record.getDisplayId()), "TM");
                results.set(index, tripMediaRepository.save(record));
            }
        }
        return results;
    }

    private List<VehicleMediaDocument> ensureVehicleMediaDisplayIds(List<VehicleMediaDocument> records) {
        List<VehicleMediaDocument> results = new ArrayList<>(records);
        long highest = highestDisplayNumber(results.stream().map(VehicleMediaDocument::getDisplayId).toList(), "VM");
        for (int index = 0; index < results.size(); index++) {
            VehicleMediaDocument record = results.get(index);
            if (record.getDisplayId() == null || record.getDisplayId().isBlank()) {
                record.setDisplayId(publicIdService.nextId("vehicle_media", "VM", highest));
                highest = highestDisplayNumber(List.of(record.getDisplayId()), "VM");
                results.set(index, vehicleMediaRepository.save(record));
            }
        }
        return results;
    }

    private String nextDisplayId(String sequenceName, String prefix, List<String> existingIds) {
        return publicIdService.nextId(sequenceName, prefix, highestDisplayNumber(existingIds, prefix));
    }

    private long highestDisplayNumber(List<String> displayIds, String prefix) {
        return displayIds.stream()
                .filter(value -> value != null && value.startsWith(prefix))
                .mapToLong(value -> {
                    try {
                        return Long.parseLong(value.substring(prefix.length()));
                    } catch (NumberFormatException ignored) {
                        return 999L;
                    }
                })
                .max()
                .orElse(999L);
    }

    private boolean audienceMatches(List<String> audience, List<String> roles) {
        if (audience == null || audience.isEmpty()) return true;
        return audience.stream().anyMatch(item -> "ALL".equalsIgnoreCase(item)
                || roles.stream().anyMatch(role -> role.equalsIgnoreCase(item)));
    }

    private void validateNotification(NotificationDocument request) {
        if (request == null || request.getRecipientOracleId() == null
                || !passengerRepository.existsById(request.getRecipientOracleId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Select an existing passenger for the notification.");
        }
        requireText(request.getTitle(), "A notification title is required.");
        requireText(request.getMessage(), "A notification message is required.");
    }

    private void validateAnnouncementAudience(TravelAnnouncementDocument request) {
        if (request.getAudience() == null) return;
        List<String> normalizedAudience = request.getAudience().stream()
                .filter(value -> value != null && !value.isBlank())
                .map(String::trim)
                .map(String::toUpperCase)
                .distinct()
                .toList();
        if (normalizedAudience.stream().anyMatch(value -> !List.of("CUSTOMER", "DRIVER", "ALL").contains(value))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Announcement audience must be CUSTOMER, DRIVER, or ALL.");
        }
        request.setAudience(normalizedAudience);
    }

    private void validateTripMedia(TripMediaDocument request) {
        if (request == null || request.getTripOracleId() == null
                || !tripRepository.existsById(request.getTripOracleId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Select an existing trip for the media.");
        }
        validateMediaAttachment(request.getContentType(), request.getMediaData());
        requireText(request.getMediaType(), "A media type is required.");
        requireText(request.getTitle(), "A media title is required.");
    }

    private Vehicle validateVehicleMedia(VehicleMediaDocument request) {
        if (request == null || request.getVehicleOracleId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Select a vehicle for the media.");
        }
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleOracleId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "The selected vehicle was not found."));
        validateMediaAttachment(request.getContentType(), request.getMediaData());
        requireText(request.getMediaType(), "A media type is required.");
        return vehicle;
    }

    private void validateMediaAttachment(String contentType, String mediaData) {
        if (mediaData == null || mediaData.isBlank()) return;
        if (mediaData.length() > MAX_MEDIA_DATA_LENGTH) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "The uploaded file is too large. Choose a file no larger than 10 MB.");
        }
        if (contentType == null || !(contentType.equals("application/pdf")
                || contentType.equals("image/png") || contentType.equals("image/jpeg"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Media uploads must be PDF, PNG, or JPG files.");
        }
        if (mediaData.startsWith("data:") && !mediaData.startsWith("data:" + contentType + ";base64,")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "The uploaded file does not match its content type.");
        }
    }

    private void requireText(String value, String message) {
        if (value == null || value.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    private ResponseStatusException notFound(String message) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, message);
    }
}
