package com.savour.fooddelivery.service;

import com.savour.fooddelivery.dto.DeliveryAssignRequest;
import com.savour.fooddelivery.dto.OrderResponse;
import com.savour.fooddelivery.exception.BusinessRuleViolationException;
import com.savour.fooddelivery.exception.ResourceNotFoundException;
import com.savour.fooddelivery.model.Delivery;
import com.savour.fooddelivery.model.FoodOrder;
import com.savour.fooddelivery.repository.DeliveryRepository;
import com.savour.fooddelivery.repository.OrderRepository;
import com.savour.fooddelivery.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public DeliveryService(DeliveryRepository deliveryRepository,
                           OrderRepository orderRepository,
                           UserRepository userRepository) {
        this.deliveryRepository = deliveryRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void assignDeliveryPartner(DeliveryAssignRequest req) {
        FoodOrder order = orderRepository.findById(req.orderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + req.orderId()));

        userRepository.findById(req.partnerId())
                .orElseThrow(() -> new ResourceNotFoundException("Delivery partner not found with id: " + req.partnerId()));

        Optional<Delivery> existing = deliveryRepository.findByOrderId(req.orderId());
        if (existing.isPresent()) {
            throw new BusinessRuleViolationException("Order #" + req.orderId() + " already has a delivery assignment.");
        }

        deliveryRepository.assignDelivery(req.orderId(), req.partnerId());
    }

    public List<OrderResponse> getOrdersForPartner(Long partnerId) {
        return orderRepository.findAllOrders().stream()
                .filter(o -> partnerId.equals(o.deliveryPartnerId()))
                .toList();
    }

    @Transactional
    public void recordPickup(Long orderId) {
        Delivery delivery = deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("No delivery record found for order #" + orderId));

        if (delivery.pickedUpAt() != null) {
            throw new BusinessRuleViolationException("Order #" + orderId + " has already been picked up.");
        }

        deliveryRepository.recordPickup(orderId);
        orderRepository.updateStatus(orderId, "OUT_FOR_DELIVERY");
    }

    @Transactional
    public void recordDelivered(Long orderId) {
        Delivery delivery = deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("No delivery record found for order #" + orderId));

        if (delivery.pickedUpAt() == null) {
            throw new BusinessRuleViolationException("Order #" + orderId + " cannot be marked delivered before pickup!");
        }

        if (delivery.deliveredAt() != null) {
            throw new BusinessRuleViolationException("Order #" + orderId + " has already been marked delivered.");
        }

        deliveryRepository.recordDelivered(orderId);
        orderRepository.updateStatus(orderId, "DELIVERED");
    }
}
