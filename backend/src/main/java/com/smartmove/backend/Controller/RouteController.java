
package com.smartmove.backend.Controller;

import com.smartmove.backend.Data.Route;
import com.smartmove.backend.Service.RouteService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "http://localhost:5173")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    // ADD ROUTE
    @PostMapping
    public ResponseEntity<?> addRoute(
            @RequestBody Route route) {

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
    public ResponseEntity<List<Route>> getAllRoutes() {
        return ResponseEntity.ok(
                routeService.getAllRoutes()
        );
    }

    // VIEW ROUTE BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getRouteById(
            @PathVariable Long id) {

        try {
            Route route = routeService.getRouteById(id);

            return ResponseEntity.ok(route);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // UPDATE ROUTE
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoute(
            @PathVariable Long id,
            @RequestBody Route route) {

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
            @PathVariable Long id) {

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

