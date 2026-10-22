package com.savour.fooddelivery.model;

public record DeliveryPartner(
    Long userId,
    String transportMode,
    String availabilityStatus
) {}
