package com.savour.fooddelivery.service;

import com.savour.fooddelivery.dto.AdminMetricsDto;
import com.savour.fooddelivery.repository.AdminRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public AdminMetricsDto getMetrics() {
        return adminRepository.getMetrics();
    }
}
