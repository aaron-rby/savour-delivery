package com.savour.fooddelivery.repository;

import com.savour.fooddelivery.dto.OrderItemDetailDto;
import com.savour.fooddelivery.dto.OrderResponse;
import com.savour.fooddelivery.model.FoodOrder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public class OrderRepository {

    private final JdbcTemplate jdbcTemplate;
    private final OrderItemRepository orderItemRepository;

    public OrderRepository(JdbcTemplate jdbcTemplate, OrderItemRepository orderItemRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.orderItemRepository = orderItemRepository;
    }

    private final RowMapper<FoodOrder> orderRowMapper = (rs, rowNum) -> new FoodOrder(
            rs.getLong("order_id"),
            rs.getLong("customer_id"),
            rs.getLong("restaurant_id"),
            rs.getTimestamp("ordered_at").toLocalDateTime(),
            rs.getString("order_status"),
            rs.getString("dropoff_line"),
            rs.getString("dropoff_city"),
            rs.getString("dropoff_postal_code"),
            rs.getBigDecimal("delivery_fee")
    );

    public Long createOrder(FoodOrder order) {
        String sql = "INSERT INTO FOOD_ORDER (customer_id, restaurant_id, ordered_at, order_status, " +
                     "dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"order_id"});
            ps.setLong(1, order.customerId());
            ps.setLong(2, order.restaurantId());
            ps.setTimestamp(3, Timestamp.valueOf(order.orderedAt()));
            ps.setString(4, order.orderStatus());
            ps.setString(5, order.dropoffLine());
            ps.setString(6, order.dropoffCity());
            ps.setString(7, order.dropoffPostalCode());
            ps.setBigDecimal(8, order.deliveryFee());
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    public Optional<FoodOrder> findById(Long orderId) {
        String sql = "SELECT order_id, customer_id, restaurant_id, ordered_at, order_status, " +
                     "dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee " +
                     "FROM FOOD_ORDER WHERE order_id = ?";
        List<FoodOrder> results = jdbcTemplate.query(sql, orderRowMapper, orderId);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public List<OrderResponse> findByCustomerId(Long customerId) {
        String sql = baseOrderSelectSql() + " WHERE fo.customer_id = ? ORDER BY fo.ordered_at DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> mapOrderResponse(rs), customerId);
    }

    public List<OrderResponse> findByRestaurantId(Long restaurantId) {
        String sql = baseOrderSelectSql() + " WHERE fo.restaurant_id = ? ORDER BY fo.ordered_at DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> mapOrderResponse(rs), restaurantId);
    }

    public List<OrderResponse> findAllOrders() {
        String sql = baseOrderSelectSql() + " ORDER BY fo.ordered_at DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> mapOrderResponse(rs));
    }

    public Optional<OrderResponse> findFullOrderById(Long orderId) {
        String sql = baseOrderSelectSql() + " WHERE fo.order_id = ?";
        List<OrderResponse> results = jdbcTemplate.query(sql, (rs, rowNum) -> mapOrderResponse(rs), orderId);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public void updateStatus(Long orderId, String newStatus) {
        String sql = "UPDATE FOOD_ORDER SET order_status = ? WHERE order_id = ?";
        jdbcTemplate.update(sql, newStatus, orderId);
    }

    private String baseOrderSelectSql() {
        return "SELECT fo.order_id, fo.customer_id, cu.full_name AS customer_name, " +
               "fo.restaurant_id, r.restaurant_name, fo.ordered_at, fo.order_status, " +
               "fo.dropoff_line, fo.dropoff_city, fo.dropoff_postal_code, fo.delivery_fee, " +
               "p.payment_status, p.payment_method, " +
               "d.partner_id AS delivery_partner_id, pu.full_name AS delivery_partner_name, " +
               "d.assigned_at, d.picked_up_at, d.delivered_at " +
               "FROM FOOD_ORDER fo " +
               "JOIN CUSTOMER c ON fo.customer_id = c.user_id " +
               "JOIN APP_USER cu ON c.user_id = cu.user_id " +
               "JOIN RESTAURANT r ON fo.restaurant_id = r.restaurant_id " +
               "LEFT JOIN PAYMENT p ON fo.order_id = p.order_id " +
               "LEFT JOIN DELIVERY d ON fo.order_id = d.order_id " +
               "LEFT JOIN DELIVERY_PARTNER dp ON d.partner_id = dp.user_id " +
               "LEFT JOIN APP_USER pu ON dp.user_id = pu.user_id";
    }

    private OrderResponse mapOrderResponse(java.sql.ResultSet rs) throws java.sql.SQLException {
        Long orderId = rs.getLong("order_id");
        List<OrderItemDetailDto> items = orderItemRepository.findItemsByOrderId(orderId);

        BigDecimal itemsSubtotal = BigDecimal.ZERO;
        for (OrderItemDetailDto item : items) {
            itemsSubtotal = itemsSubtotal.add(item.lineTotal());
        }

        BigDecimal deliveryFee = rs.getBigDecimal("delivery_fee");
        BigDecimal totalAmount = itemsSubtotal.add(deliveryFee != null ? deliveryFee : BigDecimal.ZERO);

        Long partnerId = rs.getObject("delivery_partner_id") != null ? rs.getLong("delivery_partner_id") : null;
        Timestamp assignedAtTs = rs.getTimestamp("assigned_at");
        Timestamp pickedUpAtTs = rs.getTimestamp("picked_up_at");
        Timestamp deliveredAtTs = rs.getTimestamp("delivered_at");

        return new OrderResponse(
                orderId,
                rs.getLong("customer_id"),
                rs.getString("customer_name"),
                rs.getLong("restaurant_id"),
                rs.getString("restaurant_name"),
                rs.getTimestamp("ordered_at").toLocalDateTime(),
                rs.getString("order_status"),
                rs.getString("dropoff_line"),
                rs.getString("dropoff_city"),
                rs.getString("dropoff_postal_code"),
                deliveryFee,
                itemsSubtotal,
                totalAmount,
                rs.getString("payment_status"),
                rs.getString("payment_method"),
                partnerId,
                rs.getString("delivery_partner_name"),
                assignedAtTs != null ? assignedAtTs.toLocalDateTime() : null,
                pickedUpAtTs != null ? pickedUpAtTs.toLocalDateTime() : null,
                deliveredAtTs != null ? deliveredAtTs.toLocalDateTime() : null,
                items
        );
    }
}
