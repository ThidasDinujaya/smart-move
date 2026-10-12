package com.smartmove.backend.service;

import com.smartmove.backend.data.AppUser;
import com.smartmove.backend.data.AppUserRepository;
import com.smartmove.backend.data.Passenger;
import com.smartmove.backend.data.PassengerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
public class PassengerService {

    private final PassengerRepository passengerRepository;
    private final AppUserRepository appUserRepository;
    private final CustomerAuthService customerAuthService;

    public PassengerService(
            PassengerRepository passengerRepository,
            AppUserRepository appUserRepository,
            CustomerAuthService customerAuthService) {
        this.passengerRepository = passengerRepository;
        this.appUserRepository = appUserRepository;
        this.customerAuthService = customerAuthService;
    }

    @Transactional(readOnly = true)
    public List<Passenger> getAllPassengers(String userId) {
        requireStaffRole(userId);
        return passengerRepository.findAll();
    }

    @Transactional
    public Passenger createPassenger(PassengerRequest request, String userId) {
        requireStaffRole(userId);
        Passenger passenger = new Passenger();
        applyFields(passenger, request, true);
        assertEmailAvailable(passenger.getEmail(), null);
        assertNicAvailable(passenger.getNic(), null);
        passenger.setId(null);
        return passengerRepository.save(passenger);
    }

    @Transactional
    public Passenger updatePassenger(Long id, PassengerRequest request, String userId) {
        requireStaffRole(userId);
        Passenger passenger = findPassenger(id);
        applyFields(passenger, request, false);
        assertEmailAvailable(passenger.getEmail(), id);
        assertNicAvailable(passenger.getNic(), id);

        Passenger savedPassenger = passengerRepository.save(passenger);
        appUserRepository.findByPassenger_Id(id).ifPresent(account -> {
            account.setEmail(savedPassenger.getEmail());
            account.setAccountStatus(savedPassenger.getStatus());
            appUserRepository.save(account);
        });
        return savedPassenger;
    }

    @Transactional
    public void deactivatePassenger(Long id, String userId) {
        requireStaffRole(userId);
        Passenger passenger = findPassenger(id);
        passenger.setStatus("Inactive");
        passengerRepository.save(passenger);
        appUserRepository.findByPassenger_Id(id).ifPresent(account -> {
            account.setAccountStatus("Inactive");
            appUserRepository.save(account);
        });
    }

    @Transactional(readOnly = true)
    public Passenger getMyProfile(String userId) {
        CustomerAuthService.CustomerView currentCustomer = customerAuthService.requireAnyRole(userId, "CUSTOMER");
        return findPassenger(currentCustomer.id());
    }

    @Transactional
    public Passenger updateMyProfile(ProfileUpdateRequest request, String userId) {
        CustomerAuthService.CustomerView currentCustomer = customerAuthService.requireAnyRole(userId, "CUSTOMER");
        Passenger passenger = findPassenger(currentCustomer.id());

        if (request == null) {
            throw new IllegalArgumentException("Profile details are required.");
        }

        passenger.setFullName(requireText(request.fullName(), "Full name is required."));
        passenger.setEmail(normalizeEmail(request.email()));
        passenger.setPhone(requireText(request.phone(), "Phone number is required."));
        passenger.setNic(normalizeOptional(request.nic()));
        passenger.setGender(normalizeOptional(request.gender()));

        validateLengths(passenger);
        assertEmailAvailable(passenger.getEmail(), passenger.getId());
        assertNicAvailable(passenger.getNic(), passenger.getId());

        Passenger savedPassenger = passengerRepository.save(passenger);
        appUserRepository.findByPassenger_Id(passenger.getId()).ifPresent(account -> {
            account.setEmail(savedPassenger.getEmail());
            appUserRepository.save(account);
        });
        return savedPassenger;
    }

    private void requireStaffRole(String userId) {
        CustomerAuthService.CustomerView currentUser = customerAuthService.currentCustomer(userId);
        boolean isStaff = currentUser.roles().stream().anyMatch(role ->
                "ADMIN".equalsIgnoreCase(role) || "OPERATIONS".equalsIgnoreCase(role));
        if (!isStaff) {
            throw new ForbiddenPassengerOperationException("An admin or operations account is required.");
        }
    }

    private Passenger findPassenger(Long id) {
        return passengerRepository.findById(id)
                .orElseThrow(() -> new PassengerNotFoundException("Passenger not found."));
    }

    private void applyFields(Passenger passenger, PassengerRequest request, boolean creating) {
        if (request == null) {
            throw new IllegalArgumentException("Passenger details are required.");
        }

        passenger.setFullName(requireText(request.fullName(), "Full name is required."));
        passenger.setEmail(normalizeEmail(request.email()));
        passenger.setPhone(requireText(request.phone(), "Phone number is required."));
        passenger.setNic(normalizeOptional(request.nic()));
        passenger.setGender(normalizeOptional(request.gender()));

        String requestedStatus = normalizeOptional(request.status());
        if (requestedStatus != null) {
            passenger.setStatus(normalizeStatus(requestedStatus));
        } else if (creating) {
            passenger.setStatus("Active");
        }

        validateLengths(passenger);
    }

    private void validateLengths(Passenger passenger) {
        if (passenger.getFullName().length() > 120) {
            throw new IllegalArgumentException("Full name must be 120 characters or fewer.");
        }
        if (passenger.getEmail().length() > 254) {
            throw new IllegalArgumentException("Email must be 254 characters or fewer.");
        }
        if (passenger.getPhone().length() > 25) {
            throw new IllegalArgumentException("Phone number must be 25 characters or fewer.");
        }
        if (passenger.getNic() != null && passenger.getNic().length() > 20) {
            throw new IllegalArgumentException("NIC must be 20 characters or fewer.");
        }
        if (passenger.getGender() != null && passenger.getGender().length() > 20) {
            throw new IllegalArgumentException("Gender must be 20 characters or fewer.");
        }
    }

    private void assertEmailAvailable(String email, Long currentPassengerId) {
        Passenger passengerWithEmail = passengerRepository.findByEmailIgnoreCase(email).orElse(null);
        if (passengerWithEmail != null
                && (currentPassengerId == null || !passengerWithEmail.getId().equals(currentPassengerId))) {
            throw new PassengerAlreadyExistsException("A passenger with this email already exists.");
        }

        AppUser accountWithEmail = appUserRepository.findByEmailIgnoreCase(email).orElse(null);
        if (accountWithEmail != null) {
            AppUser currentAccount = currentPassengerId == null
                    ? null
                    : appUserRepository.findByPassenger_Id(currentPassengerId).orElse(null);
            if (currentAccount == null || !accountWithEmail.getId().equals(currentAccount.getId())) {
                throw new PassengerAlreadyExistsException("A passenger with this email already exists.");
            }
        }
    }

    private void assertNicAvailable(String nic, Long currentPassengerId) {
        if (nic == null) {
            return;
        }
        Passenger passengerWithNic = passengerRepository.findByNicIgnoreCase(nic).orElse(null);
        if (passengerWithNic != null
                && (currentPassengerId == null || !passengerWithNic.getId().equals(currentPassengerId))) {
            throw new PassengerAlreadyExistsException("A passenger with this NIC already exists.");
        }
    }

    private String normalizeEmail(String email) {
        String normalizedEmail = requireText(email, "Email is required.").toLowerCase(Locale.ROOT);
        if (!normalizedEmail.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new IllegalArgumentException("Enter a valid email address.");
        }
        return normalizedEmail;
    }

    private String normalizeStatus(String status) {
        if ("active".equalsIgnoreCase(status)) {
            return "Active";
        }
        if ("inactive".equalsIgnoreCase(status)) {
            return "Inactive";
        }
        throw new IllegalArgumentException("Passenger status must be Active or Inactive.");
    }

    private String normalizeOptional(String value) {
        return value == null || value.trim().isEmpty() ? null : value.trim();
    }

    private String requireText(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(message);
        }
        return value.trim();
    }

    public record PassengerRequest(String fullName, String email, String phone, String nic,
                                   String gender, String status) {
    }

    public record ProfileUpdateRequest(String fullName, String email, String phone, String nic, String gender) {
    }

    public static class PassengerNotFoundException extends RuntimeException {
        public PassengerNotFoundException(String message) {
            super(message);
        }
    }

    public static class PassengerAlreadyExistsException extends RuntimeException {
        public PassengerAlreadyExistsException(String message) {
            super(message);
        }
    }

    public static class ForbiddenPassengerOperationException extends RuntimeException {
        public ForbiddenPassengerOperationException(String message) {
            super(message);
        }
    }
}
