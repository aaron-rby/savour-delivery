package com.savour.fooddelivery;

import com.savour.fooddelivery.dto.OrderCreateRequest;
import com.savour.fooddelivery.dto.OrderItemRequest;
import com.savour.fooddelivery.dto.OrderResponse;
import com.savour.fooddelivery.dto.PaymentRequest;
import com.savour.fooddelivery.dto.DeliveryAssignRequest;
import com.savour.fooddelivery.exception.BusinessRuleViolationException;
import com.savour.fooddelivery.exception.InvalidStatusTransitionException;
import com.savour.fooddelivery.model.MenuItem;
import com.savour.fooddelivery.service.DeliveryService;
import com.savour.fooddelivery.service.MenuService;
import com.savour.fooddelivery.service.OrderService;
import com.savour.fooddelivery.service.PaymentService;
import com.savour.fooddelivery.service.RestaurantService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class SavourBackendTests {

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private MenuService menuService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private DeliveryService deliveryService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    @DisplayName("Test 1: Fetch restaurants from database")
    void testFetchRestaurants() {
        var restaurants = restaurantService.getAllRestaurants(null);
        assertNotNull(restaurants);
        assertFalse(restaurants.isEmpty(), "Should retrieve seeded restaurants");
        assertEquals("Bukhara - ITC Maurya", restaurants.get(0).restaurantName());
    }

    @Test
    @DisplayName("Test 2: Fetch a restaurant's menu items")
    void testFetchMenu() {
        var menu = menuService.getMenuByRestaurant(1L, false);
        assertNotNull(menu);
        assertEquals(3, menu.size(), "Should retrieve 3 dishes for restaurant 1");
    }

    @Test
    @DisplayName("Test 3 & 4: Successfully place an order with multiple items & verify DB persistence")
    void testPlaceOrderSuccessfully() {
        OrderCreateRequest request = new OrderCreateRequest(
                1L,
                1L,
                "Suite 100, Chanakyapuri",
                "New Delhi",
                "110021",
                List.of(
                        new OrderItemRequest(101L, 2), // Dal Bukhara: 2 * 650 = 1300
                        new OrderItemRequest(102L, 1)  // Murgh Malai: 1 * 795 = 795
                )
        );

        OrderResponse response = orderService.placeOrder(request);
        assertNotNull(response.orderId());
        assertEquals("PLACED", response.orderStatus());
        assertEquals(2, response.items().size());

        // Verify items subtotal = 1300 + 795 = 2095, total = 2095 + 50 = 2145
        assertEquals(new BigDecimal("2095.00"), response.itemsSubtotal());
        assertEquals(new BigDecimal("2145.00"), response.totalAmount());

        // Verify persistence in database directly via JdbcTemplate
        Integer orderCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM FOOD_ORDER WHERE order_id = ?", Integer.class, response.orderId());
        assertEquals(1, orderCount);

        Integer itemCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM ORDER_ITEM WHERE order_id = ?", Integer.class, response.orderId());
        assertEquals(2, itemCount);

        Integer paymentCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM PAYMENT WHERE order_id = ?", Integer.class, response.orderId());
        assertEquals(1, paymentCount, "Order creation must atomically persist exactly 1 payment record");
    }

    @Test
    @DisplayName("Test 5: Reject an unavailable menu item")
    void testRejectUnavailableItem() {
        OrderCreateRequest request = new OrderCreateRequest(
                1L,
                1L,
                "Suite 100, Chanakyapuri",
                "New Delhi",
                "110021",
                List.of(new OrderItemRequest(105L, 1)) // 105 is marked is_available = 0
        );

        assertThrows(BusinessRuleViolationException.class, () -> orderService.placeOrder(request),
                "Should reject ordering sold-out dish");
    }

    @Test
    @DisplayName("Test 6: Reject a zero or negative quantity")
    void testRejectZeroOrNegativeQuantity() {
        OrderCreateRequest request = new OrderCreateRequest(
                1L,
                1L,
                "Suite 100",
                "New Delhi",
                "110021",
                List.of(new OrderItemRequest(101L, 0))
        );

        assertThrows(BusinessRuleViolationException.class, () -> orderService.placeOrder(request),
                "Should reject 0 quantity");
    }

    @Test
    @DisplayName("Test 7: Reject negative menu price via business rule & constraint")
    void testRejectNegativeMenuPrice() {
        MenuItem invalidDish = new MenuItem(null, 1L, "Invalid Dish", "Mains", new BigDecimal("-100.00"), 1);
        assertThrows(BusinessRuleViolationException.class, () -> menuService.createMenuItem(invalidDish),
                "Should reject negative menu price");
    }

    @Test
    @DisplayName("Test 8: Reject duplicate email addresses via unique constraint")
    void testRejectDuplicateEmail() {
        assertThrows(DataIntegrityViolationException.class, () -> {
            jdbcTemplate.update("INSERT INTO APP_USER (full_name, email, phone) VALUES (?, ?, ?)",
                    "Duplicate User", "priyansh.asati@vitstudent.ac.in", "+91 99999 88888");
        });
    }

    @Test
    @DisplayName("Test 9: Reject a second payment for the same order (1:1 constraint)")
    void testRejectSecondPayment() {
        PaymentRequest secondPayment = new PaymentRequest(1001L, "CARD", new BigDecimal("1350.00"));
        assertThrows(BusinessRuleViolationException.class, () -> paymentService.processPayment(secondPayment),
                "Should reject 2nd payment for order 1001");
    }

    @Test
    @DisplayName("Test 10: Reject second delivery assignment for the same order")
    void testRejectSecondDeliveryAssignment() {
        deliveryService.assignDeliveryPartner(new DeliveryAssignRequest(1001L, 5L));
        assertThrows(BusinessRuleViolationException.class, () -> {
            deliveryService.assignDeliveryPartner(new DeliveryAssignRequest(1001L, 5L));
        });
    }

    @Test
    @DisplayName("Test 11: Reject invalid order status transitions")
    void testRejectInvalidStatusTransitions() {
        // PLACED cannot jump directly to DELIVERED
        assertThrows(InvalidStatusTransitionException.class, () -> {
            orderService.updateOrderStatus(1001L, "DELIVERED");
        });

        // Valid transition: PLACED -> ACCEPTED
        OrderResponse updated = orderService.updateOrderStatus(1001L, "ACCEPTED");
        assertEquals("ACCEPTED", updated.orderStatus());
    }

    @Test
    @DisplayName("Test 12: Verify dynamic total calculation preserves agreed unit price")
    void testDynamicTotalPreservesAgreedUnitPrice() {
        // If current menu price of Dal Bukhara is changed in catalog
        menuService.updatePrice(101L, new BigDecimal("999.00"));

        // Historical order 1001 items should still reflect the agreed price of 650.00
        OrderResponse historicalOrder = orderService.getOrderById(1001L);
        assertEquals(new BigDecimal("650.00"), historicalOrder.items().get(0).agreedUnitPrice());
        assertEquals(new BigDecimal("1300.00"), historicalOrder.itemsSubtotal());
        assertEquals(new BigDecimal("1350.00"), historicalOrder.totalAmount());

        // Restore price
        menuService.updatePrice(101L, new BigDecimal("650.00"));
    }

    @Test
    @DisplayName("Test 13: Verify that a failed order transaction rolls back cleanly")
    void testFailedOrderRollback() {
        int initialOrderCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM FOOD_ORDER", Integer.class);

        // Attempt order with 1 valid item and 1 invalid unavailable item
        OrderCreateRequest invalidRequest = new OrderCreateRequest(
                1L,
                1L,
                "Suite 100",
                "New Delhi",
                "110021",
                List.of(
                        new OrderItemRequest(101L, 1),
                        new OrderItemRequest(105L, 1) // Unavailable!
                )
        );

        assertThrows(BusinessRuleViolationException.class, () -> orderService.placeOrder(invalidRequest));

        // Confirm rollback: order count unchanged
        int finalOrderCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM FOOD_ORDER", Integer.class);
        assertEquals(initialOrderCount, finalOrderCount, "No partial records must be left in database");
    }
}
