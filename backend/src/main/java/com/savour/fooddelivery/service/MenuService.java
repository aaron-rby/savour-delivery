package com.savour.fooddelivery.service;

import com.savour.fooddelivery.dto.MenuItemDto;
import com.savour.fooddelivery.exception.BusinessRuleViolationException;
import com.savour.fooddelivery.exception.ResourceNotFoundException;
import com.savour.fooddelivery.model.MenuItem;
import com.savour.fooddelivery.repository.MenuItemRepository;
import com.savour.fooddelivery.repository.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class MenuService {

    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;

    public MenuService(MenuItemRepository menuItemRepository, RestaurantRepository restaurantRepository) {
        this.menuItemRepository = menuItemRepository;
        this.restaurantRepository = restaurantRepository;
    }

    public List<MenuItemDto> getMenuByRestaurant(Long restaurantId, boolean onlyAvailable) {
        restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + restaurantId));

        List<MenuItem> items = onlyAvailable
                ? menuItemRepository.findAvailableByRestaurantId(restaurantId)
                : menuItemRepository.findByRestaurantId(restaurantId);

        return items.stream().map(this::toDto).toList();
    }

    public MenuItemDto getMenuItemById(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        return toDto(item);
    }

    public MenuItemDto createMenuItem(MenuItem item) {
        restaurantRepository.findById(item.restaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + item.restaurantId()));

        if (item.currentPrice() == null || item.currentPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessRuleViolationException("Menu item price must be positive (> 0)");
        }

        Long id = menuItemRepository.create(item);
        return getMenuItemById(id);
    }

    public void updateAvailability(Long itemId, int isAvailable) {
        if (isAvailable != 0 && isAvailable != 1) {
            throw new BusinessRuleViolationException("Availability must be 0 (unavailable) or 1 (available)");
        }
        menuItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + itemId));
        menuItemRepository.updateAvailability(itemId, isAvailable);
    }

    public void updatePrice(Long itemId, BigDecimal price) {
        if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessRuleViolationException("Price must be greater than 0");
        }
        menuItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + itemId));
        menuItemRepository.updatePrice(itemId, price);
    }

    private MenuItemDto toDto(MenuItem m) {
        return new MenuItemDto(
                m.itemId(),
                m.restaurantId(),
                m.itemName(),
                m.category(),
                m.currentPrice(),
                m.isAvailable()
        );
    }
}
