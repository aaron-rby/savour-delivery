package com.savour.fooddelivery.model;

import java.math.BigDecimal;

public record MenuItem(
    Long itemId,
    Long restaurantId,
    String itemName,
    String category,
    BigDecimal currentPrice,
    Integer isAvailable
) {}
