package com.savour.fooddelivery.repository;

import com.savour.fooddelivery.dto.UserPersonaDto;
import com.savour.fooddelivery.model.AppUser;
import com.savour.fooddelivery.model.DeliveryPartner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<AppUser> findById(Long userId) {
        String sql = "SELECT user_id, full_name, email, phone FROM APP_USER WHERE user_id = ?";
        List<AppUser> results = jdbcTemplate.query(sql, (rs, rowNum) -> new AppUser(
                rs.getLong("user_id"),
                rs.getString("full_name"),
                rs.getString("email"),
                rs.getString("phone")
        ), userId);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public List<DeliveryPartner> findAvailablePartners() {
        String sql = "SELECT user_id, transport_mode, availability_status FROM DELIVERY_PARTNER WHERE availability_status = 'AVAILABLE'";
        return jdbcTemplate.query(sql, (rs, rowNum) -> new DeliveryPartner(
                rs.getLong("user_id"),
                rs.getString("transport_mode"),
                rs.getString("availability_status")
        ));
    }

    public List<UserPersonaDto> getPersonas() {
        List<UserPersonaDto> personas = new ArrayList<>();
        personas.add(new UserPersonaDto(1L, "Priyansh Asati", "priyansh.asati@vitstudent.ac.in", "+91 98765 43210", "CUSTOMER", null, "Lead Student Customer (New Delhi)"));
        personas.add(new UserPersonaDto(2L, "Aarav Patel", "aarav.patel@gmail.com", "+91 98111 22334", "CUSTOMER", null, "Regular Customer (Bengaluru)"));
        personas.add(new UserPersonaDto(3L, "Ananya Sharma", "ananya.sharma@outlook.com", "+91 98222 33445", "CUSTOMER", null, "Seafood Connoisseur (Mumbai)"));
        personas.add(new UserPersonaDto(8L, "Aaron Robertson", "aaron.robertson@vitstudent.ac.in", "+91 98777 88990", "DUAL_ROLE", null, "Student & Delivery Partner (Dual Role)"));
        personas.add(new UserPersonaDto(16L, "Chef Sanjeev", "sanjeev.bukhara@itchotels.in", "+91 97666 67890", "RESTAURANT_OPERATOR", 1L, "Head Chef at Bukhara (Restaurant 1)"));
        personas.add(new UserPersonaDto(5L, "Vikram Sharma", "vikram.delivery@savour.in", "+91 98444 55667", "DELIVERY_PARTNER", 5L, "Fleet Rider (Bike)"));
        personas.add(new UserPersonaDto(6L, "Rajesh Kumar", "rajesh.fleet@savour.in", "+91 98555 66778", "DELIVERY_PARTNER", 6L, "Fleet Rider (Scooter)"));
        personas.add(new UserPersonaDto(999L, "SAVOUR Administrator", "admin@savour.in", "+91 80000 00000", "ADMIN", null, "Course Evaluation Administrator"));
        return personas;
    }
}
