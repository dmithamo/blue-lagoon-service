package com.example.blue_lagoon_service;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReservationResponse(
    String reservationReferenceNumber,
    String hotelName,
    double totalAmountPayable,
    LocalDate checkInDate,
    LocalDate checkOutDate,
    String estimatedConfirmationTime,
    LocalDateTime reservationTime
) {}
