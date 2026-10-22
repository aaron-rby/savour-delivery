package com.savour.fooddelivery.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        Map<String, Object> body = createErrorBody(HttpStatus.NOT_FOUND.value(), "Resource Not Found", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(BusinessRuleViolationException.class)
    public ResponseEntity<Map<String, Object>> handleBusinessRule(BusinessRuleViolationException ex) {
        Map<String, Object> body = createErrorBody(HttpStatus.BAD_REQUEST.value(), "Business Rule Violation", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(InvalidStatusTransitionException.class)
    public ResponseEntity<Map<String, Object>> handleStatusTransition(InvalidStatusTransitionException ex) {
        Map<String, Object> body = createErrorBody(HttpStatus.BAD_REQUEST.value(), "Invalid Status Transition", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fe.getField(), fe.getDefaultMessage());
        }
        Map<String, Object> body = createErrorBody(HttpStatus.BAD_REQUEST.value(), "Validation Failed", "One or more input fields are invalid");
        body.put("errors", fieldErrors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrity(DataIntegrityViolationException ex) {
        String msg = ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : ex.getMessage();
        String userFriendly = "Database integrity constraint violated.";
        
        if (msg.contains("ORA-00001") || msg.toLowerCase().contains("unique")) {
            userFriendly = "A record with this unique attribute already exists (e.g. duplicate email or second payment for the same order).";
        } else if (msg.contains("ORA-02290") || msg.toLowerCase().contains("check")) {
            userFriendly = "A database check constraint failed (e.g. invalid price, quantity <= 0, or invalid status value).";
        } else if (msg.contains("ORA-02291") || msg.toLowerCase().contains("foreign key")) {
            userFriendly = "Referenced parent entity does not exist in the database.";
        }

        Map<String, Object> body = createErrorBody(HttpStatus.CONFLICT.value(), "Database Constraint Violation", userFriendly);
        body.put("databaseError", msg);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
        Map<String, Object> body = createErrorBody(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Internal Server Error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    private Map<String, Object> createErrorBody(int status, String error, String message) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status);
        body.put("error", error);
        body.put("message", message);
        return body;
    }
}
