package com.savour.fooddelivery.dto;

import jakarta.validation.constraints.NotEmpty;

public record OrderStatusUpdateRequest(
    @NotEmpty(message = "New status is required")
    String newStatus
) {}
