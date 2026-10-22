package com.savour.fooddelivery.service;

import com.savour.fooddelivery.dto.UserPersonaDto;
import com.savour.fooddelivery.exception.ResourceNotFoundException;
import com.savour.fooddelivery.model.AppUser;
import com.savour.fooddelivery.model.DeliveryPartner;
import com.savour.fooddelivery.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserPersonaDto> getPersonas() {
        return userRepository.getPersonas();
    }

    public AppUser getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    public List<DeliveryPartner> getAvailablePartners() {
        return userRepository.findAvailablePartners();
    }
}
