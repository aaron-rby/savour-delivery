package com.savour.fooddelivery.repository;

import com.savour.fooddelivery.model.Restaurant;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class RestaurantRepository {

    private final JdbcTemplate jdbcTemplate;

    public RestaurantRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Restaurant> rowMapper = (rs, rowNum) -> new Restaurant(
            rs.getLong("restaurant_id"),
            rs.getString("restaurant_name"),
            rs.getString("address_line"),
            rs.getString("city"),
            rs.getString("postal_code"),
            rs.getString("contact_phone")
    );

    public List<Restaurant> findAll() {
        String sql = "SELECT restaurant_id, restaurant_name, address_line, city, postal_code, contact_phone " +
                     "FROM RESTAURANT ORDER BY restaurant_id ASC";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Optional<Restaurant> findById(Long id) {
        String sql = "SELECT restaurant_id, restaurant_name, address_line, city, postal_code, contact_phone " +
                     "FROM RESTAURANT WHERE restaurant_id = ?";
        List<Restaurant> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public List<Restaurant> search(String query) {
        String sql = "SELECT restaurant_id, restaurant_name, address_line, city, postal_code, contact_phone " +
                     "FROM RESTAURANT " +
                     "WHERE LOWER(restaurant_name) LIKE ? OR LOWER(city) LIKE ? " +
                     "ORDER BY restaurant_id ASC";
        String pattern = "%" + query.toLowerCase() + "%";
        return jdbcTemplate.query(sql, rowMapper, pattern, pattern);
    }

    public Long create(Restaurant r) {
        String sql = "INSERT INTO RESTAURANT (restaurant_name, address_line, city, postal_code, contact_phone) " +
                     "VALUES (?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"restaurant_id"});
            ps.setString(1, r.restaurantName());
            ps.setString(2, r.addressLine());
            ps.setString(3, r.city());
            ps.setString(4, r.postalCode());
            ps.setString(5, r.contactPhone());
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    public void update(Restaurant r) {
        String sql = "UPDATE RESTAURANT SET restaurant_name = ?, address_line = ?, city = ?, " +
                     "postal_code = ?, contact_phone = ? WHERE restaurant_id = ?";
        jdbcTemplate.update(sql, r.restaurantName(), r.addressLine(), r.city(), r.postalCode(), r.contactPhone(), r.restaurantId());
    }
}
