package com.savour.fooddelivery.service;

import com.savour.fooddelivery.dto.RestaurantDto;
import com.savour.fooddelivery.exception.ResourceNotFoundException;
import com.savour.fooddelivery.model.Restaurant;
import com.savour.fooddelivery.repository.MenuItemRepository;
import com.savour.fooddelivery.repository.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    public RestaurantService(RestaurantRepository restaurantRepository, MenuItemRepository menuItemRepository) {
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
    }

    public List<RestaurantDto> getAllRestaurants(String query) {
        List<Restaurant> list = (query != null && !query.trim().isEmpty())
                ? restaurantRepository.search(query.trim())
                : restaurantRepository.findAll();

        return list.stream().map(this::toDto).toList();
    }

    public RestaurantDto getRestaurantById(Long id) {
        Restaurant r = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        return toDto(r);
    }

    public RestaurantDto createRestaurant(Restaurant r) {
        Long id = restaurantRepository.create(r);
        return getRestaurantById(id);
    }

    public void updateRestaurant(Long id, Restaurant r) {
        restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        restaurantRepository.update(new Restaurant(id, r.restaurantName(), r.addressLine(), r.city(), r.postalCode(), r.contactPhone()));
    }

    private RestaurantDto toDto(Restaurant r) {
        var menu = menuItemRepository.findByRestaurantId(r.restaurantId());
        int totalItems = menu.size();
        BigDecimal minPrice = menu.stream()
                .map(com.savour.fooddelivery.model.MenuItem::currentPrice)
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.valueOf(100.00));

        return new RestaurantDto(
                r.restaurantId(),
                r.restaurantName(),
                r.addressLine(),
                r.city(),
                r.postalCode(),
                r.contactPhone(),
                totalItems,
                minPrice
        );
    }
}
