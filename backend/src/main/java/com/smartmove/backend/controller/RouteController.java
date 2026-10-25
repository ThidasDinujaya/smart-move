
package com.smartmove.backend.controller;

import com.smartmove.backend.data.Route;
import com.smartmove.backend.service.RouteService;
import com.smartmove.backend.service.CustomerAuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class RouteController {

    private final RouteService routeService;
    private final CustomerAuthService customerAuthService;

    public RouteController(RouteService routeService, CustomerAuthService customerAuthService) {
        this.routeService = routeService;
        this.customerAuthService = customerAuthService;
    }

    // ADD ROUTE
    @PostMapping
    public ResponseEntity<?> addRoute(
            @RequestBody Route route,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        customerAuthService.requireAnyRole(userId, "ADMIN", "OPERATIONS");

        try {
            Route savedRoute = routeService.addRoute(route);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedRoute);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // VIEW ALL ROUTES
    @GetMapping
    public ResponseEntity<List<Route>> getAllRoutes(
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        return ResponseEntity.ok(
                routeService.getAllRoutes()
        );
    }

    // UPDATE ROUTE
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoute(
            @PathVariable Long id,
            @RequestBody Route route,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        customerAuthService.requireAnyRole(userId, "ADMIN", "OPERATIONS");

        try {
            Route updatedRoute =
                    routeService.updateRoute(id, route);

            return ResponseEntity.ok(updatedRoute);

        } catch (IllegalArgumentException e) {

            HttpStatus status =
                    e.getMessage().startsWith("Route not found")
                            ? HttpStatus.NOT_FOUND
                            : HttpStatus.BAD_REQUEST;

            return ResponseEntity
                    .status(status)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // DELETE ROUTE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoute(
            @PathVariable Long id,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        customerAuthService.requireAnyRole(userId, "ADMIN", "OPERATIONS");

        try {
            routeService.deleteRoute(id);

            return ResponseEntity.ok(
                    Map.of("message", "Route deleted successfully!")
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}

