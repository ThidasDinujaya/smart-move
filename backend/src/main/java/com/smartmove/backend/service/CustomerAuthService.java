package com.smartmove.backend.service;

import com.smartmove.backend.data.AppUser;
import com.smartmove.backend.data.AppUserRepository;
import com.smartmove.backend.data.Passenger;
import com.smartmove.backend.data.PassengerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
public class CustomerAuthService {

    private static final String CUSTOMER_ROLE = "CUSTOMER";
    private static final String ACTIVE_STATUS = "Active";

    private final AppUserRepository appUserRepository;
    private final PassengerRepository passengerRepository;

    public CustomerAuthService(
            AppUserRepository appUserRepository,
            PassengerRepository passengerRepository) {
        this.appUserRepository = appUserRepository;
        this.passengerRepository = passengerRepository;
    }

    @Transactional
    public CustomerView register(String fullName, String email, String phone, String nic, String gender,
                                 String password) {
        String normalizedName = requireText(fullName, "Full name is required.");
        if (normalizedName.length() > 120) {
            throw new IllegalArgumentException("Full name must be 120 characters or fewer.");
        }

        String normalizedEmail = normalizeEmail(email);
        String normalizedPhone = requireText(phone, "Phone number is required.");
        if (normalizedPhone.length() > 25) {
            throw new IllegalArgumentException("Phone number must be 25 characters or fewer.");
        }
        String normalizedNic = normalizeOptional(nic);
        String normalizedGender = normalizeOptional(gender);
        if (normalizedNic != null && normalizedNic.length() > 20) {
            throw new IllegalArgumentException("NIC must be 20 characters or fewer.");
        }
        if (normalizedGender != null && normalizedGender.length() > 20) {
            throw new IllegalArgumentException("Gender must be 20 characters or fewer.");
        }
        if (normalizedNic != null && passengerRepository.existsByNicIgnoreCase(normalizedNic)) {
            throw new IllegalArgumentException("An account with this NIC already exists.");
        }

        if (password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Password is required.");
        }
        String normalizedPassword = password;
        if (normalizedPassword.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long.");
        }
        if (normalizedPassword.length() > 128) {
            throw new IllegalArgumentException("Password must be 128 characters or fewer.");
        }
        if (appUserRepository.existsByEmailIgnoreCase(normalizedEmail)
                || passengerRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new EmailAlreadyInUseException("An account with this email already exists.");
        }

        Passenger passenger = new Passenger();
        passenger.setFullName(normalizedName);
        passenger.setEmail(normalizedEmail);
        passenger.setPhone(normalizedPhone);
        passenger.setNic(normalizedNic);
        passenger.setGender(normalizedGender);
        passenger.setStatus(ACTIVE_STATUS);
        passenger = passengerRepository.save(passenger);

        AppUser appUser = new AppUser();
        appUser.setPassenger(passenger);
        appUser.setEmail(normalizedEmail);
        appUser.setPassword(normalizedPassword);
        appUser.setRoleCode(CUSTOMER_ROLE);
        appUser.setAccountStatus(ACTIVE_STATUS);
        appUser = appUserRepository.save(appUser);

        return toCustomerView(appUser);
    }

    @Transactional
    public CustomerView login(String email, String password) {
        String normalizedEmail = normalizeEmail(email);
        if (password == null || password.isEmpty()) {
            throw new AuthenticationFailedException("Email or password is incorrect.");
        }

        AppUser appUser = appUserRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new AuthenticationFailedException("Email or password is incorrect."));

        if (!ACTIVE_STATUS.equalsIgnoreCase(appUser.getAccountStatus())
                || !password.equals(appUser.getPassword())) {
            throw new AuthenticationFailedException("Email or password is incorrect.");
        }

        return toCustomerView(appUser);
    }

    @Transactional
    public void changePassword(String userId, String currentPassword, String newPassword) {
        CustomerView currentCustomer = requireAnyRole(userId, CUSTOMER_ROLE);
        AppUser appUser = appUserRepository.findById(currentCustomer.userId())
                .orElseThrow(() -> new AuthenticationFailedException("The user was not found."));

        if (currentPassword == null || !currentPassword.equals(appUser.getPassword())) {
            throw new AuthenticationFailedException("Your current password is incorrect.");
        }
        if (newPassword == null || newPassword.isEmpty()) {
            throw new IllegalArgumentException("A new password is required.");
        }
        if (newPassword.length() < 8) {
            throw new IllegalArgumentException("Your new password must be at least 8 characters long.");
        }
        if (newPassword.length() > 128) {
            throw new IllegalArgumentException("Your new password must be 128 characters or fewer.");
        }
        if (newPassword.equals(currentPassword)) {
            throw new IllegalArgumentException("Choose a new password that is different from your current password.");
        }

        appUser.setPassword(newPassword);
    }

    @Transactional(readOnly = true)
    public CustomerView currentCustomer(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new AuthenticationFailedException("A user ID is required.");
        }

        Long id;
        try {
            id = Long.parseLong(userId);
        } catch (NumberFormatException exception) {
            throw new AuthenticationFailedException("The user ID is invalid.");
        }

        AppUser appUser = appUserRepository.findById(id)
                .orElseThrow(() -> new AuthenticationFailedException("The user was not found."));
        if (!ACTIVE_STATUS.equalsIgnoreCase(appUser.getAccountStatus())) {
            throw new AuthenticationFailedException("Your account is not active.");
        }

        return toCustomerView(appUser);
    }

    public CustomerView requireAnyRole(String userId, String... allowedRoles) {
        CustomerView currentUser;
        try {
            currentUser = currentCustomer(userId);
        } catch (AuthenticationFailedException exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, exception.getMessage());
        }
        boolean allowed = currentUser.roles().stream().anyMatch(role ->
                java.util.Arrays.stream(allowedRoles).anyMatch(allowedRole ->
                        allowedRole.equalsIgnoreCase(role)));
        if (!allowed) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to do this.");
        }
        return currentUser;
    }

    private CustomerView toCustomerView(AppUser appUser) {
        Passenger passenger = appUser.getPassenger();
        return new CustomerView(
                passenger.getId(),
                appUser.getId(),
                passenger.getFullName(),
                appUser.getEmail(),
                passenger.getPhone(),
                passenger.getNic(),
                passenger.getGender(),
                List.of(appUser.getRoleCode())
        );
    }

    private String normalizeEmail(String email) {
        String normalizedEmail = requireText(email, "Email is required.").toLowerCase(Locale.ROOT);
        if (normalizedEmail.length() > 254 || !normalizedEmail.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new IllegalArgumentException("Enter a valid email address.");
        }
        return normalizedEmail;
    }

    private String requireText(String value, String message) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(message);
        }
        return value.trim();
    }

    private String normalizeOptional(String value) {
        return value == null || value.trim().isEmpty() ? null : value.trim();
    }

    public record CustomerView(Long id, Long userId, String fullName, String email, String phone,
                               String nic, String gender, List<String> roles) {
    }

    public static class EmailAlreadyInUseException extends RuntimeException {
        public EmailAlreadyInUseException(String message) {
            super(message);
        }
    }

    public static class AuthenticationFailedException extends RuntimeException {
        public AuthenticationFailedException(String message) {
            super(message);
        }
    }
}
