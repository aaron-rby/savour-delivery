package com.savour.fooddelivery.dto;

import java.math.BigDecimal;

public record AdminMetricsDto(
    Long totalOrders,
    Long completedOrders,
    Long activeOrders,
    BigDecimal grossRevenue,
    Long totalRestaurants,
    Long totalMenuItems,
    Long totalCustomers,
    Long activeDeliveryPartners
) {}
