package com.savour.fooddelivery.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record Payment(
    Long paymentId,
    Long orderId,
    String paymentMethod,
    BigDecimal paymentAmount,
    String paymentStatus,
    LocalDateTime paidAt
) {}
