package com.savour.fooddelivery.service;

import com.savour.fooddelivery.dto.PaymentRequest;
import com.savour.fooddelivery.exception.BusinessRuleViolationException;
import com.savour.fooddelivery.exception.ResourceNotFoundException;
import com.savour.fooddelivery.model.Payment;
import com.savour.fooddelivery.repository.OrderRepository;
import com.savour.fooddelivery.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentService(PaymentRepository paymentRepository, OrderRepository orderRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public Payment processPayment(PaymentRequest req) {
        // Check order exists
        orderRepository.findById(req.orderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + req.orderId()));

        // Check if payment already exists for this order (1:1 constraint enforcement)
        if (paymentRepository.findByOrderId(req.orderId()).isPresent()) {
            throw new BusinessRuleViolationException("Payment has already been recorded for order #" + req.orderId());
        }

        Payment payment = new Payment(
                null,
                req.orderId(),
                req.paymentMethod(),
                req.paymentAmount(),
                "COMPLETED",
                LocalDateTime.now()
        );

        Long paymentId = paymentRepository.create(payment);
        return paymentRepository.findByOrderId(req.orderId()).orElseThrow();
    }

    public Payment getPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order id: " + orderId));
    }
}
