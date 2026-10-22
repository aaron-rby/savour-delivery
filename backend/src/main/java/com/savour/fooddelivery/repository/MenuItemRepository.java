package com.savour.fooddelivery.repository;

import com.savour.fooddelivery.model.MenuItem;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.util.List;
import java.util.Optional;

@Repository
public class MenuItemRepository {

    private final JdbcTemplate jdbcTemplate;

    public MenuItemRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<MenuItem> rowMapper = (rs, rowNum) -> new MenuItem(
            rs.getLong("item_id"),
            rs.getLong("restaurant_id"),
            rs.getString("item_name"),
            rs.getString("category"),
            rs.getBigDecimal("current_price"),
            rs.getInt("is_available")
    );

    public List<MenuItem> findByRestaurantId(Long restaurantId) {
        String sql = "SELECT item_id, restaurant_id, item_name, category, current_price, is_available " +
                     "FROM MENU_ITEM WHERE restaurant_id = ? ORDER BY category, item_name";
        return jdbcTemplate.query(sql, rowMapper, restaurantId);
    }

    public List<MenuItem> findAvailableByRestaurantId(Long restaurantId) {
        String sql = "SELECT item_id, restaurant_id, item_name, category, current_price, is_available " +
                     "FROM MENU_ITEM WHERE restaurant_id = ? AND is_available = 1 ORDER BY category, item_name";
        return jdbcTemplate.query(sql, rowMapper, restaurantId);
    }

    public Optional<MenuItem> findById(Long id) {
        String sql = "SELECT item_id, restaurant_id, item_name, category, current_price, is_available " +
                     "FROM MENU_ITEM WHERE item_id = ?";
        List<MenuItem> results = jdbcTemplate.query(sql, rowMapper, id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public Long create(MenuItem item) {
        String sql = "INSERT INTO MENU_ITEM (restaurant_id, item_name, category, current_price, is_available) " +
                     "VALUES (?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, new String[]{"item_id"});
            ps.setLong(1, item.restaurantId());
            ps.setString(2, item.itemName());
            ps.setString(3, item.category());
            ps.setBigDecimal(4, item.currentPrice());
            ps.setInt(5, item.isAvailable() != null ? item.isAvailable() : 1);
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    public void update(MenuItem item) {
        String sql = "UPDATE MENU_ITEM SET item_name = ?, category = ?, current_price = ?, is_available = ? " +
                     "WHERE item_id = ?";
        jdbcTemplate.update(sql, item.itemName(), item.category(), item.currentPrice(), item.isAvailable(), item.itemId());
    }

    public void updateAvailability(Long itemId, int isAvailable) {
        String sql = "UPDATE MENU_ITEM SET is_available = ? WHERE item_id = ?";
        jdbcTemplate.update(sql, isAvailable, itemId);
    }

    public void updatePrice(Long itemId, BigDecimal price) {
        String sql = "UPDATE MENU_ITEM SET current_price = ? WHERE item_id = ?";
        jdbcTemplate.update(sql, price, itemId);
    }
}
