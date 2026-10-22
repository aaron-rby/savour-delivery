package com.savour.fooddelivery.model;

import java.time.LocalDateTime;

public record Delivery(
    Long orderId,
    Long partnerId,
    LocalDateTime assignedAt,
    LocalDateTime pickedUpAt,
    LocalDateTime deliveredAt
) {}
