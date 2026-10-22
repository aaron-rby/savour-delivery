package com.savour.fooddelivery.repository;

import com.savour.fooddelivery.dto.AdminMetricsDto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public class AdminRepository {

    private final JdbcTemplate jdbcTemplate;

    public AdminRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public AdminMetricsDto getMetrics() {
        Long totalOrders = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM FOOD_ORDER", Long.class);
        Long completedOrders = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM FOOD_ORDER WHERE order_status = 'DELIVERED'", Long.class);
        Long activeOrders = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM FOOD_ORDER WHERE order_status NOT IN ('DELIVERED', 'CANCELLED')", Long.class);

        String revSql = "SELECT NVL(SUM(oi.quantity * oi.agreed_unit_price) + " +
                        "(SELECT NVL(SUM(delivery_fee), 0) FROM FOOD_ORDER WHERE order_status != 'CANCELLED'), 0) " +
                        "FROM ORDER_ITEM oi " +
                        "JOIN FOOD_ORDER fo ON oi.order_id = fo.order_id " +
                        "WHERE fo.order_status != 'CANCELLED'";
        BigDecimal grossRev = jdbcTemplate.queryForObject(revSql, BigDecimal.class);

        Long totalRestaurants = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM RESTAURANT", Long.class);
        Long totalMenuItems = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM MENU_ITEM", Long.class);
        Long totalCustomers = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM CUSTOMER", Long.class);
        Long activePartners = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM DELIVERY_PARTNER WHERE availability_status = 'AVAILABLE'", Long.class);

        return new AdminMetricsDto(
                totalOrders != null ? totalOrders : 0L,
                completedOrders != null ? completedOrders : 0L,
                activeOrders != null ? activeOrders : 0L,
                grossRev != null ? grossRev : BigDecimal.ZERO,
                totalRestaurants != null ? totalRestaurants : 0L,
                totalMenuItems != null ? totalMenuItems : 0L,
                totalCustomers != null ? totalCustomers : 0L,
                activePartners != null ? activePartners : 0L
        );
    }
}
