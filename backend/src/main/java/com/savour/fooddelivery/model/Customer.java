package com.savour.fooddelivery.model;

import java.time.LocalDate;

public record Customer(
    Long userId,
    LocalDate customerSince
) {}
