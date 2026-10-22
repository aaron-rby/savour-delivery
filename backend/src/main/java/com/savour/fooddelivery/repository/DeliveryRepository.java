package com.savour.fooddelivery.repository;

import com.savour.fooddelivery.model.Delivery;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public class DeliveryRepository {

    private final JdbcTemplate jdbcTemplate;

    public DeliveryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Delivery> rowMapper = (rs, rowNum) -> {
        Timestamp assignedAtTs = rs.getTimestamp("assigned_at");
        Timestamp pickedUpAtTs = rs.getTimestamp("picked_up_at");
        Timestamp deliveredAtTs = rs.getTimestamp("delivered_at");
        return new Delivery(
                rs.getLong("order_id"),
                rs.getLong("partner_id"),
                assignedAtTs != null ? assignedAtTs.toLocalDateTime() : null,
                pickedUpAtTs != null ? pickedUpAtTs.toLocalDateTime() : null,
                deliveredAtTs != null ? deliveredAtTs.toLocalDateTime() : null
        );
    };

    public void assignDelivery(Long orderId, Long partnerId) {
        String sql = "INSERT INTO DELIVERY (order_id, partner_id, assigned_at) VALUES (?, ?, CURRENT_TIMESTAMP)";
        jdbcTemplate.update(sql, orderId, partnerId);
    }

    public Optional<Delivery> findByOrderId(Long orderId) {
        String sql = "SELECT order_id, partner_id, assigned_at, picked_up_at, delivered_at " +
                     "FROM DELIVERY WHERE order_id = ?";
        List<Delivery> results = jdbcTemplate.query(sql, rowMapper, orderId);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public void recordPickup(Long orderId) {
        String sql = "UPDATE DELIVERY SET picked_up_at = CURRENT_TIMESTAMP WHERE order_id = ?";
        jdbcTemplate.update(sql, orderId);
    }

    public void recordDelivered(Long orderId) {
        String sql = "UPDATE DELIVERY SET delivered_at = CURRENT_TIMESTAMP WHERE order_id = ?";
        jdbcTemplate.update(sql, orderId);
    }
}
