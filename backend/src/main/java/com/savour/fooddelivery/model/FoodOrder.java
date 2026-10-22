package com.savour.fooddelivery.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FoodOrder(
    Long orderId,
    Long customerId,
    Long restaurantId,
    LocalDateTime orderedAt,
    String orderStatus,
    String dropoffLine,
    String dropoffCity,
    String dropoffPostalCode,
    BigDecimal deliveryFee
) {}
