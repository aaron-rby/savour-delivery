package com.savour.fooddelivery.repository;

import com.savour.fooddelivery.dto.OrderItemDetailDto;
import com.savour.fooddelivery.model.OrderItem;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public class OrderItemRepository {

    private final JdbcTemplate jdbcTemplate;

    public OrderItemRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void create(OrderItem item) {
        String sql = "INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) " +
                     "VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql, item.orderId(), item.itemId(), item.quantity(), item.agreedUnitPrice());
    }

    public List<OrderItemDetailDto> findItemsByOrderId(Long orderId) {
        String sql = "SELECT oi.item_id, mi.item_name, mi.category, oi.quantity, oi.agreed_unit_price, " +
                     "(oi.quantity * oi.agreed_unit_price) AS line_total " +
                     "FROM ORDER_ITEM oi " +
                     "JOIN MENU_ITEM mi ON oi.item_id = mi.item_id " +
                     "WHERE oi.order_id = ? " +
                     "ORDER BY mi.category, mi.item_name";

        return jdbcTemplate.query(sql, (rs, rowNum) -> new OrderItemDetailDto(
                rs.getLong("item_id"),
                rs.getString("item_name"),
                rs.getString("category"),
                rs.getInt("quantity"),
                rs.getBigDecimal("agreed_unit_price"),
                rs.getBigDecimal("line_total")
        ), orderId);
    }

    public BigDecimal calculateItemsSubtotal(Long orderId) {
        String sql = "SELECT NVL(SUM(quantity * agreed_unit_price), 0) FROM ORDER_ITEM WHERE order_id = ?";
        BigDecimal total = jdbcTemplate.queryForObject(sql, BigDecimal.class, orderId);
        return total != null ? total : BigDecimal.ZERO;
    }
}
