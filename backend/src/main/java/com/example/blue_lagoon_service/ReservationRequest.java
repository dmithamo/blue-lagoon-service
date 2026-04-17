package com.example.blue_lagoon_service;

import java.time.LocalDate;

public record ReservationRequest(
    String hotelName,
    int numberOfRooms,
    int extraBeds,
    LocalDate checkInDate,
    LocalDate checkOutDate,
    String customerName,
    String requestTime
) {}
