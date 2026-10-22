package com.savour.fooddelivery.model;

import java.math.BigDecimal;

public record OrderItem(
    Long orderId,
    Long itemId,
    Integer quantity,
    BigDecimal agreedUnitPrice
) {}
