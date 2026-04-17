package com.example.blue_lagoon_service;

import java.time.LocalDate;

public record ReservationRequest(
    String hotelName,
    int numberOfRooms,
    LocalDate checkInDate,
    LocalDate checkOutDate,
    String customerName,
    String requestTime
) {}
