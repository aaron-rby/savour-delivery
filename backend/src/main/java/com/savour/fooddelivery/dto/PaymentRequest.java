package com.savour.fooddelivery.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record PaymentRequest(
    @NotNull(message = "Order ID is required")
    Long orderId,

    @NotEmpty(message = "Payment method is required")
    String paymentMethod,

    @NotNull(message = "Payment amount is required")
    @DecimalMin(value = "0.01", message = "Payment amount must be greater than 0")
    BigDecimal paymentAmount
) {}
