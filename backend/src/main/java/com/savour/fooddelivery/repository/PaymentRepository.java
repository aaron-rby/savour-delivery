package com.savour.fooddelivery.repository;

import com.savour.fooddelivery.model.Payment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public class PaymentRepository {

    private final JdbcTemplate jdbcTemplate;

    public PaymentRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Payment> rowMapper = (rs, rowNum) -> {
        Timestamp paidAtTs = rs.getTimestamp("paid_at");
        return new Payment(
                rs.getLong("payment_id"),
                rs.getLong("order_id"),
                rs.getString("payment_method"),
                rs.getBigDecimal("payment_amount"),
                rs.getString("payment_status"),
                paidAtTs != null ? paidAtTs.toLocalDateTime() : null
        );
    };

    public Long create(Payment payment) {
        String sql = "INSERT INTO PAYMENT (order_id, payment_method, payment_amount, payment_status, paid_at) " +
                     "VALUES (?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"payment_id"});
            ps.setLong(1, payment.orderId());
            ps.setString(2, payment.paymentMethod());
            ps.setBigDecimal(3, payment.paymentAmount());
            ps.setString(4, payment.paymentStatus());
            ps.setTimestamp(5, payment.paidAt() != null ? Timestamp.valueOf(payment.paidAt()) : null);
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    public Optional<Payment> findByOrderId(Long orderId) {
        String sql = "SELECT payment_id, order_id, payment_method, payment_amount, payment_status, paid_at " +
                     "FROM PAYMENT WHERE order_id = ?";
        List<Payment> results = jdbcTemplate.query(sql, rowMapper, orderId);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public void updateStatus(Long paymentId, String status) {
        String sql = "UPDATE PAYMENT SET payment_status = ?, paid_at = CURRENT_TIMESTAMP WHERE payment_id = ?";
        jdbcTemplate.update(sql, status, paymentId);
    }
}
