package com.smartmove.backend.service;

import com.smartmove.backend.data.AppUser;
import com.smartmove.backend.data.AppUserRepository;
import com.smartmove.backend.data.AuthSession;
import com.smartmove.backend.data.AuthSessionRepository;
import com.smartmove.backend.data.Passenger;
import com.smartmove.backend.data.PassengerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Locale;

@Service
public class CustomerAuthService {

    private static final int PASSWORD_ITERATIONS = 310_000;
    private static final int PASSWORD_SALT_BYTES = 16;
    private static final int PASSWORD_KEY_BITS = 256;
    private static final int SESSION_TOKEN_BYTES = 32;
    private static final int SESSION_LIFETIME_DAYS = 7;
    private static final String CUSTOMER_ROLE = "CUSTOMER";
    private static final String ACTIVE_STATUS = "Active";

    private final AppUserRepository appUserRepository;
    private final AuthSessionRepository authSessionRepository;
    private final PassengerRepository passengerRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public CustomerAuthService(
            AppUserRepository appUserRepository,
            AuthSessionRepository authSessionRepository,
            PassengerRepository passengerRepository) {
        this.appUserRepository = appUserRepository;
        this.authSessionRepository = authSessionRepository;
        this.passengerRepository = passengerRepository;
    }

    @Transactional
    public AuthResult register(String fullName, String email, String phone, String password, String confirmPassword) {
        String normalizedName = requireText(fullName, "Full name is required.");
        if (normalizedName.length() > 120) {
            throw new IllegalArgumentException("Full name must be 120 characters or fewer.");
        }

        String normalizedEmail = normalizeEmail(email);
        String normalizedPhone = requireText(phone, "Phone number is required.");
        if (normalizedPhone.length() > 25) {
            throw new IllegalArgumentException("Phone number must be 25 characters or fewer.");
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
        if (confirmPassword != null && !normalizedPassword.equals(confirmPassword)) {
            throw new IllegalArgumentException("The passwords do not match.");
        }

        if (appUserRepository.existsByEmailIgnoreCase(normalizedEmail)
                || passengerRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new EmailAlreadyInUseException("An account with this email already exists.");
        }

        Passenger passenger = new Passenger();
        passenger.setFullName(normalizedName);
        passenger.setEmail(normalizedEmail);
        passenger.setPhone(normalizedPhone);
        passenger.setStatus(ACTIVE_STATUS);
        passenger = passengerRepository.save(passenger);

        AppUser appUser = new AppUser();
        appUser.setPassenger(passenger);
        appUser.setEmail(normalizedEmail);
        appUser.setPasswordHash(hashPassword(normalizedPassword));
        appUser.setRoleCode(CUSTOMER_ROLE);
        appUser.setAccountStatus(ACTIVE_STATUS);
        appUser = appUserRepository.save(appUser);

        return createSession(appUser);
    }

    @Transactional
    public AuthResult login(String email, String password) {
        String normalizedEmail = normalizeEmail(email);
        if (password == null || password.isEmpty()) {
            throw new AuthenticationFailedException("Email or password is incorrect.");
        }

        AppUser appUser = appUserRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new AuthenticationFailedException("Email or password is incorrect."));

        if (!ACTIVE_STATUS.equalsIgnoreCase(appUser.getAccountStatus())
                || !verifyPassword(password, appUser.getPasswordHash())) {
            throw new AuthenticationFailedException("Email or password is incorrect.");
        }

        return createSession(appUser);
    }

    @Transactional(readOnly = true)
    public CustomerView currentCustomer(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new AuthenticationFailedException("A valid bearer token is required.");
        }

        AuthSession session = authSessionRepository
                .findByTokenHashAndExpiresAtAfter(hashToken(rawToken), LocalDateTime.now())
                .orElseThrow(() -> new AuthenticationFailedException("Your session is invalid or has expired."));

        AppUser appUser = session.getUser();
        if (!ACTIVE_STATUS.equalsIgnoreCase(appUser.getAccountStatus())) {
            throw new AuthenticationFailedException("Your account is not active.");
        }

        return toCustomerView(appUser);
    }

    @Transactional
    public void logout(String rawToken) {
        if (rawToken != null && !rawToken.isBlank()) {
            authSessionRepository.deleteByTokenHash(hashToken(rawToken));
        }
    }

    private AuthResult createSession(AppUser appUser) {
        String rawToken = createToken();
        LocalDateTime expiresAt = LocalDateTime.now().plusDays(SESSION_LIFETIME_DAYS);

        AuthSession session = new AuthSession();
        session.setUser(appUser);
        session.setTokenHash(hashToken(rawToken));
        session.setExpiresAt(expiresAt);
        authSessionRepository.save(session);

        return new AuthResult(rawToken, "Bearer", expiresAt, toCustomerView(appUser));
    }

    private CustomerView toCustomerView(AppUser appUser) {
        Passenger passenger = appUser.getPassenger();
        return new CustomerView(
                passenger.getId(),
                passenger.getFullName(),
                appUser.getEmail(),
                passenger.getPhone(),
                List.of(appUser.getRoleCode())
        );
    }

    private String createToken() {
        byte[] tokenBytes = new byte[SESSION_TOKEN_BYTES];
        secureRandom.nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }

    private String hashToken(String rawToken) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return java.util.HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("Token hashing is unavailable.", exception);
        }
    }

    private String hashPassword(String password) {
        byte[] salt = new byte[PASSWORD_SALT_BYTES];
        secureRandom.nextBytes(salt);
        byte[] derivedKey = derivePasswordKey(password, salt, PASSWORD_ITERATIONS);
        return "pbkdf2-sha256$" + PASSWORD_ITERATIONS + "$"
                + Base64.getEncoder().encodeToString(salt) + "$"
                + Base64.getEncoder().encodeToString(derivedKey);
    }

    private boolean verifyPassword(String password, String storedHash) {
        if (storedHash == null) {
            return false;
        }

        String[] parts = storedHash.split("\\$", -1);
        if (parts.length != 4 || !"pbkdf2-sha256".equals(parts[0])) {
            return false;
        }

        try {
            int iterations = Integer.parseInt(parts[1]);
            if (iterations < 1 || iterations > 2_000_000) {
                return false;
            }
            byte[] salt = Base64.getDecoder().decode(parts[2]);
            byte[] expectedKey = Base64.getDecoder().decode(parts[3]);
            byte[] actualKey = derivePasswordKey(password, salt, iterations);
            return MessageDigest.isEqual(expectedKey, actualKey);
        } catch (IllegalArgumentException exception) {
            return false;
        }
    }

    private byte[] derivePasswordKey(String password, byte[] salt, int iterations) {
        PBEKeySpec keySpec = new PBEKeySpec(password.toCharArray(), salt, iterations, PASSWORD_KEY_BITS);
        try {
            return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
                    .generateSecret(keySpec)
                    .getEncoded();
        } catch (NoSuchAlgorithmException | InvalidKeySpecException exception) {
            throw new IllegalStateException("Password hashing is unavailable.", exception);
        } finally {
            keySpec.clearPassword();
        }
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

    public record CustomerView(Long id, String fullName, String email, String phone, List<String> roles) {
    }

    public record AuthResult(String accessToken, String tokenType, LocalDateTime expiresAt, CustomerView customer) {
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
