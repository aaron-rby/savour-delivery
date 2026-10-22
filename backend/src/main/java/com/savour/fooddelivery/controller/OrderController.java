package com.savour.fooddelivery.controller;

import com.savour.fooddelivery.dto.OrderCreateRequest;
import com.savour.fooddelivery.dto.OrderResponse;
import com.savour.fooddelivery.dto.OrderStatusUpdateRequest;
import com.savour.fooddelivery.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody OrderCreateRequest request) {
        OrderResponse created = orderService.placeOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(orderService.getOrdersByCustomer(customerId));
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByRestaurant(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(orderService.getOrdersByRestaurant(restaurantId));
    }

    @RequestMapping(value = "/{id}/status", method = {RequestMethod.PATCH, RequestMethod.PUT})
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam(required = false) String status,
            @Valid @RequestBody(required = false) OrderStatusUpdateRequest request) {
        String targetStatus = (status != null && !status.isBlank())
                ? status.trim().toUpperCase()
                : (request != null ? request.newStatus().trim().toUpperCase() : null);

        if (targetStatus == null || targetStatus.isBlank()) {
            throw new com.savour.fooddelivery.exception.BusinessRuleViolationException("Target status is required");
        }
        return ResponseEntity.ok(orderService.updateOrderStatus(id, targetStatus));
    }
}
