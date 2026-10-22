package com.savour.fooddelivery.dto;

import java.math.BigDecimal;

public record MenuItemDto(
    Long itemId,
    Long restaurantId,
    String itemName,
    String category,
    BigDecimal currentPrice,
    Integer isAvailable
) {}
