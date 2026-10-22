package com.savour.fooddelivery.dto;

import java.math.BigDecimal;

public record OrderItemDetailDto(
    Long itemId,
    String itemName,
    String category,
    Integer quantity,
    BigDecimal agreedUnitPrice,
    BigDecimal lineTotal
) {}
