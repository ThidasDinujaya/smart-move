
package com.smartmove.backend.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {

    boolean existsByRouteNoIgnoreCase(String routeNo);

    Optional<Route> findByRouteNoIgnoreCase(String routeNo);

}

