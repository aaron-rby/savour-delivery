package com.savour.fooddelivery.model;

public record Restaurant(
    Long restaurantId,
    String restaurantName,
    String addressLine,
    String city,
    String postalCode,
    String contactPhone
) {}
