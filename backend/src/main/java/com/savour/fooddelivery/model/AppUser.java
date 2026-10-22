package com.savour.fooddelivery.model;

public record AppUser(
    Long userId,
    String fullName,
    String email,
    String phone
) {}
