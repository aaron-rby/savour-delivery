package com.savour.fooddelivery.dto;

import jakarta.validation.constraints.NotNull;

public record DeliveryAssignRequest(
    @NotNull(message = "Order ID is required")
    Long orderId,

    @NotNull(message = "Partner ID is required")
    Long partnerId
) {}
