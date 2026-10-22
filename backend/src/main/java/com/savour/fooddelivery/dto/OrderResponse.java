package com.savour.fooddelivery.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
    Long orderId,
    Long customerId,
    String customerName,
    Long restaurantId,
    String restaurantName,
    LocalDateTime orderedAt,
    String orderStatus,
    String dropoffLine,
    String dropoffCity,
    String dropoffPostalCode,
    BigDecimal deliveryFee,
    BigDecimal itemsSubtotal,
    BigDecimal totalAmount,
    String paymentStatus,
    String paymentMethod,
    Long deliveryPartnerId,
    String deliveryPartnerName,
    LocalDateTime assignedAt,
    LocalDateTime pickedUpAt,
    LocalDateTime deliveredAt,
    List<OrderItemDetailDto> items
) {}
