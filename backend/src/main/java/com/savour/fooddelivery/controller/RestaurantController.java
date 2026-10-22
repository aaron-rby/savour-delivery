package com.savour.fooddelivery.controller;

import com.savour.fooddelivery.dto.MenuItemDto;
import com.savour.fooddelivery.dto.RestaurantDto;
import com.savour.fooddelivery.model.Restaurant;
import com.savour.fooddelivery.service.MenuService;
import com.savour.fooddelivery.service.RestaurantService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final MenuService menuService;

    public RestaurantController(RestaurantService restaurantService, MenuService menuService) {
        this.restaurantService = restaurantService;
        this.menuService = menuService;
    }

    @GetMapping
    public ResponseEntity<List<RestaurantDto>> getRestaurants(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(restaurantService.getAllRestaurants(search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantDto> getRestaurant(@PathVariable Long id) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }

    @GetMapping("/{id}/menu")
    public ResponseEntity<List<MenuItemDto>> getRestaurantMenu(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean onlyAvailable) {
        return ResponseEntity.ok(menuService.getMenuByRestaurant(id, onlyAvailable));
    }

    @PostMapping
    public ResponseEntity<RestaurantDto> createRestaurant(@Valid @RequestBody Restaurant restaurant) {
        RestaurantDto created = restaurantService.createRestaurant(restaurant);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateRestaurant(@PathVariable Long id, @Valid @RequestBody Restaurant restaurant) {
        restaurantService.updateRestaurant(id, restaurant);
        return ResponseEntity.noContent().build();
    }
}
