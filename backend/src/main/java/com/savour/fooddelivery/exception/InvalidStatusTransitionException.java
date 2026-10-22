package com.savour.fooddelivery.exception;

public class InvalidStatusTransitionException extends RuntimeException {
    public InvalidStatusTransitionException(String currentStatus, String targetStatus) {
        super("Invalid order status transition from '" + currentStatus + "' to '" + targetStatus + "'");
    }

    public InvalidStatusTransitionException(String message) {
        super(message);
    }
}
