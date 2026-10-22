package com.savour.fooddelivery.dto;

public record UserPersonaDto(
    Long userId,
    String fullName,
    String email,
    String phone,
    String role, // "CUSTOMER", "DELIVERY_PARTNER", "RESTAURANT_OPERATOR", "ADMIN"
    Long associatedId, // restaurantId or partnerId if applicable
    String description
) {}
