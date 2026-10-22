package com.savour.fooddelivery.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final JdbcTemplate jdbcTemplate;

    public HealthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "SAVOUR Spring Boot Backend");
        response.put("academicProject", "BACSE202 Database Systems | VIT");
        response.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/db")
    public ResponseEntity<Map<String, Object>> getDatabaseHealth() {
        Map<String, Object> response = new HashMap<>();
        try {
            // Test actual JDBC query against database
            Integer result = jdbcTemplate.queryForObject("SELECT 1 FROM DUAL", Integer.class);
            response.put("databaseStatus", "CONNECTED");
            response.put("engine", "Oracle Database (JDBC Thin Driver)");
            response.put("connectivityVerified", true);
            response.put("pingResult", result);
            response.put("timestamp", LocalDateTime.now());
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            response.put("databaseStatus", "DISCONNECTED");
            response.put("connectivityVerified", false);
            response.put("error", ex.getMessage());
            response.put("guidance", "Ensure Oracle XE / Cloud instance is running on port 1521 with listener active.");
            response.put("timestamp", LocalDateTime.now());
            return ResponseEntity.status(503).body(response);
        }
    }
}
