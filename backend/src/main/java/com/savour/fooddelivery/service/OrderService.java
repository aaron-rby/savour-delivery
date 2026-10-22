package com.savour.fooddelivery.service;

import com.savour.fooddelivery.dto.OrderCreateRequest;
import com.savour.fooddelivery.dto.OrderItemRequest;
import com.savour.fooddelivery.dto.OrderResponse;
import com.savour.fooddelivery.exception.BusinessRuleViolationException;
import com.savour.fooddelivery.exception.InvalidStatusTransitionException;
import com.savour.fooddelivery.exception.ResourceNotFoundException;
import com.savour.fooddelivery.model.FoodOrder;
import com.savour.fooddelivery.model.MenuItem;
import com.savour.fooddelivery.model.OrderItem;
import com.savour.fooddelivery.repository.MenuItemRepository;
import com.savour.fooddelivery.repository.OrderRepository;
import com.savour.fooddelivery.repository.OrderItemRepository;
import com.savour.fooddelivery.repository.RestaurantRepository;
import com.savour.fooddelivery.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;
    private final com.savour.fooddelivery.repository.PaymentRepository paymentRepository;

    // Permitted status transitions state machine (supports both academic workflow & frontend operator UI)
    private static final Map<String, Set<String>> VALID_TRANSITIONS = Map.of(
            "PLACED", Set.of("ACCEPTED", "CONFIRMED", "CANCELLED"),
            "ACCEPTED", Set.of("PREPARING", "CANCELLED"),
            "CONFIRMED", Set.of("PREPARING", "CANCELLED"),
            "PREPARING", Set.of("READY", "OUT_FOR_DELIVERY", "CANCELLED"),
            "READY", Set.of("OUT_FOR_DELIVERY", "CANCELLED"),
            "OUT_FOR_DELIVERY", Set.of("DELIVERED"),
            "DELIVERED", Set.of(),
            "CANCELLED", Set.of()
    );

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        RestaurantRepository restaurantRepository,
                        MenuItemRepository menuItemRepository,
                        UserRepository userRepository,
                        com.savour.fooddelivery.repository.PaymentRepository paymentRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public OrderResponse placeOrder(OrderCreateRequest req) {
        // Step 1: Validate customer and restaurant existence
        userRepository.findById(req.customerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with user_id: " + req.customerId()));

        restaurantRepository.findById(req.restaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with restaurant_id: " + req.restaurantId()));

        // Step 2: Validate cart is non-empty
        if (req.items() == null || req.items().isEmpty()) {
            throw new BusinessRuleViolationException("Cart cannot be empty. Please select at least one menu item.");
        }

        // Step 3, 4, 5, 6: Validate items, ownership, availability, positive quantity, and read current menu prices
        for (OrderItemRequest itemReq : req.items()) {
            if (itemReq.quantity() == null || itemReq.quantity() <= 0) {
                throw new BusinessRuleViolationException("Quantity for item " + itemReq.itemId() + " must be a positive integer (> 0)");
            }

            MenuItem menuItem = menuItemRepository.findById(itemReq.itemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with item_id: " + itemReq.itemId()));

            if (!menuItem.restaurantId().equals(req.restaurantId())) {
                throw new BusinessRuleViolationException("Item '" + menuItem.itemName() + "' belongs to another restaurant. Multi-restaurant ordering is not permitted.");
            }

            if (menuItem.isAvailable() == 0) {
                throw new BusinessRuleViolationException("Item '" + menuItem.itemName() + "' is currently sold out and cannot be ordered.");
            }
        }

        // Step 7: Calculate items subtotal on the server using trusted current menu prices
        BigDecimal calculatedItemsSubtotal = BigDecimal.ZERO;
        for (OrderItemRequest itemReq : req.items()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.itemId()).orElseThrow();
            BigDecimal lineTotal = menuItem.currentPrice().multiply(BigDecimal.valueOf(itemReq.quantity()));
            calculatedItemsSubtotal = calculatedItemsSubtotal.add(lineTotal);
        }

        // Flat delivery fee of ₹50.00
        BigDecimal deliveryFee = BigDecimal.valueOf(50.00);
        BigDecimal totalOrderAmount = calculatedItemsSubtotal.add(deliveryFee);

        // Step 8: Insert FOOD_ORDER header
        FoodOrder orderHeader = new FoodOrder(
                null,
                req.customerId(),
                req.restaurantId(),
                LocalDateTime.now(),
                "PLACED",
                req.resolveDropoffLine(),
                req.resolveDropoffCity(),
                req.resolveDropoffPostalCode(),
                deliveryFee
        );
        Long createdOrderId = orderRepository.createOrder(orderHeader);

        // Step 9: Insert ORDER_ITEM rows with agreed_unit_price = database current_price (frozen snapshot)
        for (OrderItemRequest itemReq : req.items()) {
            MenuItem menuItem = menuItemRepository.findById(itemReq.itemId()).orElseThrow();
            OrderItem orderItem = new OrderItem(
                    createdOrderId,
                    menuItem.itemId(),
                    itemReq.quantity(),
                    menuItem.currentPrice() // agreed_unit_price frozen at order placement
            );
            orderItemRepository.create(orderItem);
        }

        // Step 10: Insert PAYMENT record within the same ACID transaction
        String method = (req.paymentMethod() != null && !req.paymentMethod().isBlank())
                ? req.paymentMethod().trim().toUpperCase()
                : "UPI";
        String payStatus = "CASH_ON_DELIVERY".equals(method) ? "PENDING" : "COMPLETED";
        LocalDateTime paidTimestamp = "CASH_ON_DELIVERY".equals(method) ? null : LocalDateTime.now();

        com.savour.fooddelivery.model.Payment paymentRecord = new com.savour.fooddelivery.model.Payment(
                null,
                createdOrderId,
                method,
                totalOrderAmount,
                payStatus,
                paidTimestamp
        );
        paymentRepository.create(paymentRecord);

        // Step 11: Return full OrderResponse with joined payment and item snapshots
        return orderRepository.findFullOrderById(createdOrderId)
                .orElseThrow(() -> new IllegalStateException("Failed to retrieve created order summary"));
    }

    public OrderResponse getOrderById(Long orderId) {
        return orderRepository.findFullOrderById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
    }

    public List<OrderResponse> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    public List<OrderResponse> getOrdersByRestaurant(Long restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId);
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllOrders();
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, String targetStatus) {
        FoodOrder currentOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        String currentStatus = currentOrder.orderStatus();
        Set<String> allowed = VALID_TRANSITIONS.getOrDefault(currentStatus, Set.of());

        if (!allowed.contains(targetStatus)) {
            throw new InvalidStatusTransitionException(
                    "Cannot transition order #" + orderId + " from '" + currentStatus + "' to '" + targetStatus + "'. Permitted transitions: " + allowed
            );
        }

        orderRepository.updateStatus(orderId, targetStatus);
        return orderRepository.findFullOrderById(orderId).orElseThrow();
    }
}
