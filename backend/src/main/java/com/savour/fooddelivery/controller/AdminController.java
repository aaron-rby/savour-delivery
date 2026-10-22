package com.savour.fooddelivery.controller;

import com.savour.fooddelivery.dto.AdminMetricsDto;
import com.savour.fooddelivery.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/metrics")
    public ResponseEntity<AdminMetricsDto> getMetrics() {
        return ResponseEntity.ok(adminService.getMetrics());
    }
}
