package com.savour.fooddelivery.controller;

import com.savour.fooddelivery.dto.DeliveryAssignRequest;
import com.savour.fooddelivery.dto.OrderResponse;
import com.savour.fooddelivery.service.DeliveryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @PostMapping("/assign")
    public ResponseEntity<Void> assignPartner(@Valid @RequestBody DeliveryAssignRequest request) {
        deliveryService.assignDeliveryPartner(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/partner/{partnerId}")
    public ResponseEntity<List<OrderResponse>> getPartnerDeliveries(@PathVariable Long partnerId) {
        return ResponseEntity.ok(deliveryService.getOrdersForPartner(partnerId));
    }

    @PostMapping("/order/{orderId}/pickup")
    public ResponseEntity<Void> recordPickup(@PathVariable Long orderId) {
        deliveryService.recordPickup(orderId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/order/{orderId}/delivered")
    public ResponseEntity<Void> recordDelivered(@PathVariable Long orderId) {
        deliveryService.recordDelivered(orderId);
        return ResponseEntity.ok().build();
    }
}
