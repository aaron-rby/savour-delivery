package com.savour.fooddelivery.dto;

import java.math.BigDecimal;

public record RestaurantDto(
    Long restaurantId,
    String restaurantName,
    String addressLine,
    String city,
    String postalCode,
    String contactPhone,
    Integer totalMenuItems,
    BigDecimal minimumPrice
) {}
