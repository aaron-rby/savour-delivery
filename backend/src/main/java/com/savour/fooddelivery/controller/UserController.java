package com.savour.fooddelivery.controller;

import com.savour.fooddelivery.dto.UserPersonaDto;
import com.savour.fooddelivery.model.AppUser;
import com.savour.fooddelivery.model.DeliveryPartner;
import com.savour.fooddelivery.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/personas")
    public ResponseEntity<List<UserPersonaDto>> getPersonas() {
        return ResponseEntity.ok(userService.getPersonas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppUser> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/partners/available")
    public ResponseEntity<List<DeliveryPartner>> getAvailablePartners() {
        return ResponseEntity.ok(userService.getAvailablePartners());
    }
}
