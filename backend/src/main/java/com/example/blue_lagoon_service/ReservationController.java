package com.example.blue_lagoon_service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reservations")
@CrossOrigin(
    origins = "*",
    allowedHeaders = "*",
    methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS }
)
public class ReservationController {

    private final List<ReservationResponse> database = new ArrayList<>();
    private static final Logger log = LoggerFactory.getLogger(
        ReservationController.class
    );

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ReservationRequest req) {
        try {
            LocalDate today = LocalDate.now();

            if (req.checkInDate().isBefore(today)) {
                return buildErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    "Check-in cannot be in the past.",
                    "/reservations"
                );
            }

            long days = ChronoUnit.DAYS.between(
                req.checkInDate(),
                req.checkOutDate()
            );
            if (days <= 0) {
                return buildErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    "Check-out must be after check-in.",
                    "/reservations"
                );
            }

            double dailyRate = 60000.0;
            double extraBedRate = 10000.0;
            double total =
                (dailyRate * days * req.numberOfRooms()) +
                (req.extraBeds() * extraBedRate);

            ReservationResponse successBody = new ReservationResponse(
                "BL-" +
                    UUID.randomUUID().toString().substring(0, 5).toUpperCase(),
                req.hotelName(),
                req.customerName(),
                total,
                req.checkInDate(),
                req.checkOutDate(),
                "10 Minutes",
                LocalDateTime.now()
            );

            database.add(successBody);

            log.info(
                "Reservation successful for {}: Total Ksh {}",
                req.customerName(),
                total
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(successBody);
        } catch (Exception e) {
            log.error("Error processing request: {}", e.getMessage());
            return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred.",
                "/reservations"
            );
        }
    }

    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getAll() {
        return ResponseEntity.ok(database);
    }

    private ResponseEntity<ApiError> buildErrorResponse(
        HttpStatus status,
        String message,
        String path
    ) {
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
