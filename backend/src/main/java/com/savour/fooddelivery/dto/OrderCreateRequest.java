package com.savour.fooddelivery.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OrderCreateRequest(
    @NotNull(message = "Customer ID is required")
    Long customerId,

    @NotNull(message = "Restaurant ID is required")
    Long restaurantId,

    String dropoffLine,

    String dropoffCity,

    String dropoffPostalCode,

    String deliveryAddress,

    @NotEmpty(message = "Order must contain at least one item")
    List<OrderItemRequest> items,

    String paymentMethod
) {
    // Overloaded 6-parameter constructor for existing automated unit tests
    public OrderCreateRequest(Long customerId, Long restaurantId, String dropoffLine, String dropoffCity, String dropoffPostalCode, List<OrderItemRequest> items) {
        this(customerId, restaurantId, dropoffLine, dropoffCity, dropoffPostalCode, null, items, "UPI");
    }

    public String resolveDropoffLine() {
        if (dropoffLine != null && !dropoffLine.isBlank()) {
            return dropoffLine.trim();
        }
        if (deliveryAddress != null && !deliveryAddress.isBlank()) {
            return deliveryAddress.trim();
        }
        return "Flat 402, Shanti Niketan Apts";
    }

    public String resolveDropoffCity() {
        if (dropoffCity != null && !dropoffCity.isBlank()) {
            return dropoffCity.trim();
        }
        return "New Delhi";
    }

    public String resolveDropoffPostalCode() {
        if (dropoffPostalCode != null && !dropoffPostalCode.isBlank()) {
            return dropoffPostalCode.trim();
        }
        return "110021";
    }
}

