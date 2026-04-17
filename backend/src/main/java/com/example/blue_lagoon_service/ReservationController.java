package com.example.blue_lagoon_service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reservations")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*")
public class ReservationController {

    private static final Logger log = LoggerFactory.getLogger(ReservationController.class);

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ReservationRequest req) {
        log.info("Processing reservation for: {}", req.customerName());

        try {
            LocalDate today = LocalDate.now();

            // 1. Validation: Check-in cannot be in the past
            if (req.checkInDate().isBefore(today)) {
                log.warn("Validation failed: Check-in date {} is in the past", req.checkInDate());
                return buildErrorResponse(HttpStatus.BAD_REQUEST, 
                    "Check-in date cannot be in the past.", "/reservations");
            }

            // 2. Validation: Check-out must be after check-in
            long days = ChronoUnit.DAYS.between(req.checkInDate(), req.checkOutDate());
            if (days <= 0) {
                return buildErrorResponse(HttpStatus.BAD_REQUEST, 
                    "Check-out date must be after check-in date.", "/reservations");
            }

            // 3. Success Logic
            double dailyRate = 60000.0;
            double extraBedCharge = 10000.0; 
            double total = (dailyRate * days * req.numberOfRooms()) + extraBedCharge;

            ReservationResponse successBody = new ReservationResponse(
                "BL-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase(),
                req.hotelName(),
                total,
                req.checkInDate(),
                req.checkOutDate(),
                "10 Minutes"
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(successBody);

        } catch (Exception e) {
            log.error("Internal server error: {}", e.getMessage());
            return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, 
                "An unexpected error occurred.", "/reservations");
        }
    }

    private ResponseEntity<ApiError> buildErrorResponse(HttpStatus status, String message, String path) {
        ApiError error = new ApiError(
            LocalDateTime.now(),
            status.value(),
            status.getReasonPhrase(),
            message,
            path
        );
        return new ResponseEntity<>(error, status);
    }
}
