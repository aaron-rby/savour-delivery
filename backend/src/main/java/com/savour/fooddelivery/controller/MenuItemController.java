package com.savour.fooddelivery.controller;

import com.savour.fooddelivery.dto.MenuItemDto;
import com.savour.fooddelivery.model.MenuItem;
import com.savour.fooddelivery.service.MenuService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/menu-items")
public class MenuItemController {

    private final MenuService menuService;

    public MenuItemController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItemDto> getMenuItem(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getMenuItemById(id));
    }

    @PostMapping
    public ResponseEntity<MenuItemDto> createMenuItem(@Valid @RequestBody MenuItem item) {
        MenuItemDto created = menuService.createMenuItem(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<Void> updateAvailability(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        Integer isAvailable = body.get("isAvailable");
        if (isAvailable == null) {
            return ResponseEntity.badRequest().build();
        }
        menuService.updateAvailability(id, isAvailable);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/price")
    public ResponseEntity<Void> updatePrice(@PathVariable Long id, @RequestBody Map<String, BigDecimal> body) {
        BigDecimal price = body.get("price");
        if (price == null) {
            return ResponseEntity.badRequest().build();
        }
        menuService.updatePrice(id, price);
        return ResponseEntity.noContent().build();
    }
}
