-- ============================================================================
-- SAVOUR FOOD DELIVERY SYSTEM — BACSE202 Database Systems Project | VIT
-- SCRIPT 03: USEFUL ANALYTICAL & REPORTING QUERIES
-- Database Engine: Oracle Database (12c / 19c / 21c / 23c Compatible)
-- Authors: Aaron Robertson, Ark Khandelwal, Priyansh Asati, Ansh Kapoor
-- ============================================================================

-- ----------------------------------------------------------------------------
-- QUERY 1: CORE BUSINESS LOGIC — DYNAMIC ORDER TOTAL CALCULATION
-- Proves Phase 1 rule: Storing derived order total violates 3NF.
-- Total = SUM(quantity * agreed_unit_price) + delivery_fee
-- ----------------------------------------------------------------------------
SELECT 
    fo.order_id,
    fo.ordered_at,
    fo.order_status,
    c_u.full_name AS customer_name,
    r.restaurant_name,
    fo.delivery_fee,
    NVL(SUM(oi.quantity * oi.agreed_unit_price), 0) AS items_subtotal,
    NVL(SUM(oi.quantity * oi.agreed_unit_price), 0) + fo.delivery_fee AS calculated_order_total,
    p.payment_status,
    p.payment_amount AS recorded_payment_amount
FROM FOOD_ORDER fo
JOIN CUSTOMER c ON fo.customer_id = c.user_id
JOIN APP_USER c_u ON c.user_id = c_u.user_id
JOIN RESTAURANT r ON fo.restaurant_id = r.restaurant_id
LEFT JOIN ORDER_ITEM oi ON fo.order_id = oi.order_id
LEFT JOIN PAYMENT p ON fo.order_id = p.order_id
GROUP BY 
    fo.order_id, fo.ordered_at, fo.order_status, c_u.full_name, 
    r.restaurant_name, fo.delivery_fee, p.payment_status, p.payment_amount
ORDER BY fo.order_id DESC;

-- ----------------------------------------------------------------------------
-- QUERY 2: DETAILED ITEM-LEVEL BREAKDOWN FOR A SPECIFIC ORDER (Receipt View)
-- Demonstrates preservation of agreed historical prices vs current catalog prices
-- ----------------------------------------------------------------------------
SELECT 
    fo.order_id,
    r.restaurant_name,
    mi.item_name,
    mi.category,
    oi.quantity,
    oi.agreed_unit_price AS purchased_at_price,
    mi.current_price AS present_catalog_price,
    (oi.quantity * oi.agreed_unit_price) AS line_item_subtotal
FROM FOOD_ORDER fo
JOIN RESTAURANT r ON fo.restaurant_id = r.restaurant_id
JOIN ORDER_ITEM oi ON fo.order_id = oi.order_id
JOIN MENU_ITEM mi ON oi.item_id = mi.item_id
WHERE fo.order_id = 1001
ORDER BY mi.category, mi.item_name;

-- ----------------------------------------------------------------------------
-- QUERY 3: RESTAURANT PERFORMANCE & REVENUE AGGREGATION
-- Demonstrates aggregate functions, GROUP BY, and revenue metrics
-- ----------------------------------------------------------------------------
SELECT 
    r.restaurant_id,
    r.restaurant_name,
    r.city,
    COUNT(DISTINCT fo.order_id) AS total_orders_placed,
    COUNT(DISTINCT CASE WHEN fo.order_status = 'DELIVERED' THEN fo.order_id END) AS completed_orders,
    NVL(SUM(CASE WHEN fo.order_status != 'CANCELLED' THEN (oi.quantity * oi.agreed_unit_price) ELSE 0 END), 0) AS gross_item_revenue,
    NVL(AVG(CASE WHEN fo.order_status != 'CANCELLED' THEN (oi.quantity * oi.agreed_unit_price) END), 0) AS avg_item_order_value
FROM RESTAURANT r
LEFT JOIN FOOD_ORDER fo ON r.restaurant_id = fo.restaurant_id
LEFT JOIN ORDER_ITEM oi ON fo.order_id = oi.order_id
GROUP BY r.restaurant_id, r.restaurant_name, r.city
ORDER BY gross_item_revenue DESC;

-- ----------------------------------------------------------------------------
-- QUERY 4: ACTIVE DELIVERY FLEET WORKLOAD & FULFILLMENT AUDIT
-- Demonstrates LEFT JOIN with DELIVERY and status tracking
-- ----------------------------------------------------------------------------
SELECT 
    dp.user_id AS partner_id,
    u.full_name AS partner_name,
    dp.transport_mode,
    dp.availability_status,
    COUNT(d.order_id) AS total_assigned_deliveries,
    COUNT(CASE WHEN d.delivered_at IS NOT NULL THEN 1 END) AS successful_deliveries,
    COUNT(CASE WHEN d.picked_up_at IS NOT NULL AND d.delivered_at IS NULL THEN 1 END) AS active_in_transit_deliveries
FROM DELIVERY_PARTNER dp
JOIN APP_USER u ON dp.user_id = u.user_id
LEFT JOIN DELIVERY d ON dp.user_id = d.partner_id
GROUP BY dp.user_id, u.full_name, dp.transport_mode, dp.availability_status
ORDER BY total_assigned_deliveries DESC;

-- ----------------------------------------------------------------------------
-- QUERY 5: RESTAURANT MENU CATALOG INVENTORY & AVAILABILITY AUDIT
-- Categorizes active vs sold-out items
-- ----------------------------------------------------------------------------
SELECT 
    r.restaurant_name,
    mi.category,
    COUNT(mi.item_id) AS total_menu_items,
    SUM(CASE WHEN mi.is_available = 1 THEN 1 ELSE 0 END) AS available_items_count,
    SUM(CASE WHEN mi.is_available = 0 THEN 1 ELSE 0 END) AS out_of_stock_items_count,
    MIN(mi.current_price) AS min_dish_price,
    MAX(mi.current_price) AS max_dish_price,
    ROUND(AVG(mi.current_price), 2) AS avg_dish_price
FROM RESTAURANT r
JOIN MENU_ITEM mi ON r.restaurant_id = mi.restaurant_id
GROUP BY r.restaurant_name, mi.category
ORDER BY r.restaurant_name, mi.category;

-- ----------------------------------------------------------------------------
-- QUERY 6: 9-TABLE FULL JOURNEY QUERY (The Ultimate Academic Demonstration)
-- Joins every relation in the normalized schema in a single coherent report
-- ----------------------------------------------------------------------------
SELECT 
    fo.order_id,
    c_user.full_name AS customer_name,
    c_user.phone AS customer_phone,
    r.restaurant_name,
    r.city AS restaurant_city,
    LISTAGG(mi.item_name || ' (x' || oi.quantity || ')', ', ') WITHIN GROUP (ORDER BY mi.item_name) AS items_ordered,
    SUM(oi.quantity * oi.agreed_unit_price) + fo.delivery_fee AS total_amount_due,
    fo.order_status,
    p.payment_method,
    p.payment_status,
    dp_user.full_name AS delivery_partner_name,
    dp.transport_mode AS delivery_vehicle,
    d.assigned_at,
    d.picked_up_at,
    d.delivered_at
FROM FOOD_ORDER fo
JOIN CUSTOMER c ON fo.customer_id = c.user_id
JOIN APP_USER c_user ON c.user_id = c_user.user_id
JOIN RESTAURANT r ON fo.restaurant_id = r.restaurant_id
JOIN ORDER_ITEM oi ON fo.order_id = oi.order_id
JOIN MENU_ITEM mi ON oi.item_id = mi.item_id
LEFT JOIN PAYMENT p ON fo.order_id = p.order_id
LEFT JOIN DELIVERY d ON fo.order_id = d.order_id
LEFT JOIN DELIVERY_PARTNER dp ON d.partner_id = dp.user_id
LEFT JOIN APP_USER dp_user ON dp.user_id = dp_user.user_id
GROUP BY 
    fo.order_id, c_user.full_name, c_user.phone, r.restaurant_name, r.city,
    fo.delivery_fee, fo.order_status, p.payment_method, p.payment_status,
    dp_user.full_name, dp.transport_mode, d.assigned_at, d.picked_up_at, d.delivered_at
ORDER BY fo.order_id;
