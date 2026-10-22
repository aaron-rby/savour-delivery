-- ============================================================================
-- SAVOUR FOOD DELIVERY SYSTEM — BACSE202 Database Systems Project | VIT
-- SCRIPT 02: DETERMINISTIC SEED DATA (DML)
-- Database Engine: Oracle Database (12c / 19c / 21c / 23c Compatible)
-- Authors: Aaron Robertson, Ark Khandelwal, Priyansh Asati, Ansh Kapoor
-- ============================================================================

-- Clean existing data in child-first order for idempotency
DELETE FROM DELIVERY;
DELETE FROM PAYMENT;
DELETE FROM ORDER_ITEM;
DELETE FROM FOOD_ORDER;
DELETE FROM MENU_ITEM;
DELETE FROM RESTAURANT;
DELETE FROM DELIVERY_PARTNER;
DELETE FROM CUSTOMER;
DELETE FROM APP_USER;

-- ----------------------------------------------------------------------------
-- 1. APP_USER (16 realistic users across roles)
-- ----------------------------------------------------------------------------
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (1, 'Priyansh Asati', 'priyansh.asati@vitstudent.ac.in', '+91 98765 43210');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (2, 'Aarav Patel', 'aarav.patel@gmail.com', '+91 98111 22334');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (3, 'Ananya Sharma', 'ananya.sharma@outlook.com', '+91 98222 33445');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (4, 'Rohan Verma', 'rohan.verma@yahoo.com', '+91 98333 44556');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (5, 'Vikram Sharma', 'vikram.delivery@savour.in', '+91 98444 55667');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (6, 'Rajesh Kumar', 'rajesh.fleet@savour.in', '+91 98555 66778');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (7, 'Sunil Gowda', 'sunil.gowda@savour.in', '+91 98666 77889');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (8, 'Aaron Robertson', 'aaron.robertson@vitstudent.ac.in', '+91 98777 88990'); -- Dual Role
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (9, 'Ark Khandelwal', 'ark.khandelwal@vitstudent.ac.in', '+91 98888 99001');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (10, 'Ansh Kapoor', 'ansh.kapoor@vitstudent.ac.in', '+91 98999 00112');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (11, 'Meera Nair', 'meera.nair@gmail.com', '+91 97111 12345');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (12, 'Kavita Menon', 'kavita.m@gmail.com', '+91 97222 23456');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (13, 'Deepak Joshi', 'deepak.joshi@savour.in', '+91 97333 34567');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (14, 'Ishaan Sen', 'ishaan.sen@gmail.com', '+91 97444 45678');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (15, 'Amitabh Das', 'amitabh.das@savour.in', '+91 97555 56789');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (16, 'Chef Sanjeev', 'sanjeev.bukhara@itchotels.in', '+91 97666 67890');

-- ----------------------------------------------------------------------------
-- 2. CUSTOMER (Subtype of APP_USER)
-- ----------------------------------------------------------------------------
INSERT INTO CUSTOMER (user_id, customer_since) VALUES (1, DATE '2023-01-15');
INSERT INTO CUSTOMER (user_id, customer_since) VALUES (2, DATE '2023-03-22');
INSERT INTO CUSTOMER (user_id, customer_since) VALUES (3, DATE '2023-05-10');
INSERT INTO CUSTOMER (user_id, customer_since) VALUES (4, DATE '2023-07-19');
INSERT INTO CUSTOMER (user_id, customer_since) VALUES (8, DATE '2023-08-01'); -- Dual role user as Customer
INSERT INTO CUSTOMER (user_id, customer_since) VALUES (9, DATE '2023-09-14');
INSERT INTO CUSTOMER (user_id, customer_since) VALUES (10, DATE '2023-11-05');
INSERT INTO CUSTOMER (user_id, customer_since) VALUES (11, DATE '2024-01-12');
INSERT INTO CUSTOMER (user_id, customer_since) VALUES (12, DATE '2024-02-18');
INSERT INTO CUSTOMER (user_id, customer_since) VALUES (14, DATE '2024-03-30');

-- ----------------------------------------------------------------------------
-- 3. DELIVERY_PARTNER (Subtype of APP_USER)
-- ----------------------------------------------------------------------------
INSERT INTO DELIVERY_PARTNER (user_id, transport_mode, availability_status) VALUES (5, 'BIKE', 'AVAILABLE');
INSERT INTO DELIVERY_PARTNER (user_id, transport_mode, availability_status) VALUES (6, 'SCOOTER', 'BUSY');
INSERT INTO DELIVERY_PARTNER (user_id, transport_mode, availability_status) VALUES (7, 'ELECTRIC_VEHICLE', 'AVAILABLE');
INSERT INTO DELIVERY_PARTNER (user_id, transport_mode, availability_status) VALUES (8, 'BIKE', 'AVAILABLE'); -- Dual role user as Partner
INSERT INTO DELIVERY_PARTNER (user_id, transport_mode, availability_status) VALUES (13, 'BICYCLE', 'OFFLINE');
INSERT INTO DELIVERY_PARTNER (user_id, transport_mode, availability_status) VALUES (15, 'ELECTRIC_VEHICLE', 'AVAILABLE');

-- ----------------------------------------------------------------------------
-- 4. RESTAURANT (6 Authentic Premium Dining Establishments across India)
-- ----------------------------------------------------------------------------
INSERT INTO RESTAURANT (restaurant_id, restaurant_name, address_line, city, postal_code, contact_phone) 
VALUES (1, 'Bukhara - ITC Maurya', 'Diplomatic Enclave, Sardar Patel Marg', 'New Delhi', '110021', '+91 11 2611 2233');

INSERT INTO RESTAURANT (restaurant_id, restaurant_name, address_line, city, postal_code, contact_phone) 
VALUES (2, 'Karavalli - The Gateway', '66 Residency Road', 'Bengaluru', '560025', '+91 80 6660 4545');

INSERT INTO RESTAURANT (restaurant_id, restaurant_name, address_line, city, postal_code, contact_phone) 
VALUES (3, 'Trishna Seafood Haven', '7 Sai Baba Marg, Kala Ghoda, Fort', 'Mumbai', '400001', '+91 22 2270 3213');

INSERT INTO RESTAURANT (restaurant_id, restaurant_name, address_line, city, postal_code, contact_phone) 
VALUES (4, 'Paradise Heritage Biryani', 'SD Road, Sappu Bagh, Paradise Circle', 'Hyderabad', '500003', '+91 40 6666 5588');

INSERT INTO RESTAURANT (restaurant_id, restaurant_name, address_line, city, postal_code, contact_phone) 
VALUES (5, 'Dakshin - Crowne Plaza', '132 TTK Road, Alwarpet', 'Chennai', '600018', '+91 44 2499 4101');

INSERT INTO RESTAURANT (restaurant_id, restaurant_name, address_line, city, postal_code, contact_phone) 
VALUES (6, '6 Ballygunge Place', '6 Ballygunge Place, Ballygunge', 'Kolkata', '700019', '+91 33 2460 3922');

-- ----------------------------------------------------------------------------
-- 5. MENU_ITEM (42 Authentic Dishes across Cuisines and Categories)
-- ----------------------------------------------------------------------------
-- Restaurant 1: Bukhara, New Delhi (North Indian Frontier)
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (101, 1, 'Dal Bukhara (Slow Cooked 18h)', 'Mains', 650.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (102, 1, 'Murgh Malai Kebab', 'Starters', 795.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (103, 1, 'Sikandari Raan', 'Mains', 1450.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (104, 1, 'Bukhara Naan (Giant Tandoor)', 'Breads', 280.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (105, 1, 'Tandoori Jhinga (Jumbo Prawns)', 'Starters', 1250.00, 0); -- Sold out / Unavailable
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (106, 1, 'Kulfi Falooda with Rose Petals', 'Desserts', 350.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (107, 1, 'Smoked Chaas with Cumin', 'Beverages', 180.00, 1);

-- Restaurant 2: Karavalli, Bengaluru (Coastal South Indian)
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (201, 2, 'Mangalorean Anjal Fish Fry', 'Starters', 620.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (202, 2, 'Kori Gassi with Neer Dosa', 'Mains', 580.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (203, 2, 'Alleppey Fish Curry', 'Mains', 690.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (204, 2, 'Malabar Parotta (Pack of 3)', 'Breads', 160.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (205, 2, 'Tender Coconut Payasam', 'Desserts', 290.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (206, 2, 'Fresh Kokum Sharbath', 'Beverages', 150.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (207, 2, 'Tiger Prawn Ghee Roast', 'Starters', 890.00, 0); -- Unavailable

-- Restaurant 3: Trishna, Mumbai (Coastal Seafood)
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (301, 3, 'Signature Butter Garlic Butter Crab', 'Mains', 1350.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (302, 3, 'Squid Koliwada Fry', 'Starters', 520.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (303, 3, 'Kolambi (Prawn) Biryani', 'Biryani', 640.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (304, 3, 'Sol Kadhi (Digestive Berry Coconut)', 'Beverages', 120.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (305, 3, 'Steamed Appam (Set of 2)', 'Breads', 140.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (306, 3, 'Bombay Duck Crispy Fry', 'Starters', 440.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (307, 3, 'Lobster in Chettinad Masala', 'Mains', 1850.00, 0); -- Unavailable

-- Restaurant 4: Paradise Heritage, Hyderabad (Hyderabadi Nizami)
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (401, 4, 'Royal Mutton Dum Biryani', 'Biryani', 480.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (402, 4, 'Special Chicken Biryani Pot', 'Biryani', 390.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (403, 4, 'Mirchi Ka Salan & Dahi Chutney', 'Sides', 120.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (404, 4, 'Pathar Ka Gosht (Stone Grilled Lamb)', 'Starters', 560.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (405, 4, 'Shahi Double Ka Meetha', 'Desserts', 220.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (406, 4, 'Irani Chai Flask (Serves 3)', 'Beverages', 160.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (407, 4, 'Haleem with Fried Onions & Cashews', 'Mains', 420.00, 0); -- Seasonal unavailable

-- Restaurant 5: Dakshin, Chennai (South Indian Classical)
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (501, 5, 'Meen Polichathu in Banana Leaf', 'Mains', 680.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (502, 5, 'Chettinad Chicken Varuval', 'Starters', 490.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (503, 5, 'Vazhaipoo Vadai (Banana Blossom Cutlet)', 'Starters', 340.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (504, 5, 'Bisibele Bath with Ghee & Boondi', 'Mains', 360.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (505, 5, 'Elaneer Souffle', 'Desserts', 280.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (506, 5, 'Mylapore Degree Filter Coffee', 'Beverages', 140.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (507, 5, 'Nandu Crab Pepper Fry', 'Starters', 750.00, 0); -- Unavailable

-- Restaurant 6: 6 Ballygunge Place, Kolkata (Traditional Bengali)
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (601, 6, 'Daab Chingri (Prawns in Tender Coconut)', 'Mains', 780.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (602, 6, 'Kolkata Bhetki Fish Fry (2 pcs)', 'Starters', 460.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (603, 6, 'Kosha Mangsho (Spicy Slow Cooked Mutton)', 'Mains', 690.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (604, 6, 'Luchi with Chholar Dal (4 pcs)', 'Breads', 240.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (605, 6, 'Baked Rosogolla (2 pcs)', 'Desserts', 190.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (606, 6, 'Gondhoraj Lebur Ghol', 'Beverages', 130.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (607, 6, 'Ilish Bhapa (Steamed Hilsa in Mustard)', 'Mains', 950.00, 0); -- Seasonal unavailable

-- ----------------------------------------------------------------------------
-- 6. FOOD_ORDER (12 Orders demonstrating all lifecycle states)
-- ----------------------------------------------------------------------------
-- Order 1: Delivered
INSERT INTO FOOD_ORDER (order_id, customer_id, restaurant_id, ordered_at, order_status, dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee)
VALUES (1001, 1, 1, TIMESTAMP '2026-10-10 12:30:00', 'DELIVERED', 'Flat 402, Shanti Niketan Apts, Chanakyapuri', 'New Delhi', '110021', 50.00);

-- Order 2: Delivered
INSERT INTO FOOD_ORDER (order_id, customer_id, restaurant_id, ordered_at, order_status, dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee)
VALUES (1002, 2, 2, TIMESTAMP '2026-10-10 13:15:00', 'DELIVERED', 'Villa 12, Palm Meadows, Whitefield', 'Bengaluru', '560066', 60.00);

-- Order 3: Delivered
INSERT INTO FOOD_ORDER (order_id, customer_id, restaurant_id, ordered_at, order_status, dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee)
VALUES (1003, 3, 3, TIMESTAMP '2026-10-11 19:45:00', 'DELIVERED', 'B-1401, Lodha Bellissimo, Mahalaxmi', 'Mumbai', '400011', 40.00);

-- Order 4: Out for Delivery (In Transit)
INSERT INTO FOOD_ORDER (order_id, customer_id, restaurant_id, ordered_at, order_status, dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee)
VALUES (1004, 1, 1, TIMESTAMP '2026-10-12 18:00:00', 'OUT_FOR_DELIVERY', 'Flat 402, Shanti Niketan Apts, Chanakyapuri', 'New Delhi', '110021', 50.00);

-- Order 5: Ready (Awaiting Delivery Partner assignment/pickup)
INSERT INTO FOOD_ORDER (order_id, customer_id, restaurant_id, ordered_at, order_status, dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee)
VALUES (1005, 4, 4, TIMESTAMP '2026-10-12 18:20:00', 'READY', 'Tower 3, Apt 804, My Home Bhooja, Hitec City', 'Hyderabad', '500081', 50.00);

-- Order 6: Preparing in Kitchen
INSERT INTO FOOD_ORDER (order_id, customer_id, restaurant_id, ordered_at, order_status, dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee)
VALUES (1006, 9, 2, TIMESTAMP '2026-10-12 18:35:00', 'PREPARING', 'House 55, 4th Cross, Indiranagar', 'Bengaluru', '560038', 45.00);

-- Order 7: Accepted by Restaurant
INSERT INTO FOOD_ORDER (order_id, customer_id, restaurant_id, ordered_at, order_status, dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee)
VALUES (1007, 10, 5, TIMESTAMP '2026-10-12 18:45:00', 'ACCEPTED', 'Door 22, Poes Garden, Alwarpet', 'Chennai', '600086', 40.00);

-- Order 8: Placed (Fresh incoming order)
INSERT INTO FOOD_ORDER (order_id, customer_id, restaurant_id, ordered_at, order_status, dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee)
VALUES (1008, 11, 6, TIMESTAMP '2026-10-12 19:00:00', 'PLACED', 'P-12 Lake View Road, Southern Avenue', 'Kolkata', '700029', 55.00);

-- Order 9: Cancelled (Before preparation)
INSERT INTO FOOD_ORDER (order_id, customer_id, restaurant_id, ordered_at, order_status, dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee)
VALUES (1009, 12, 4, TIMESTAMP '2026-10-11 11:00:00', 'CANCELLED', 'Plot 99, Jubilee Hills Checkpost', 'Hyderabad', '500033', 0.00);

-- Order 10: Placed by Aaron (Demonstrating dual role customer)
INSERT INTO FOOD_ORDER (order_id, customer_id, restaurant_id, ordered_at, order_status, dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee)
VALUES (1010, 8, 1, TIMESTAMP '2026-10-12 19:10:00', 'PLACED', 'Hostel Block D, Room 312, VIT Campus', 'Vellore', '632014', 60.00);

-- Order 11: Ready
INSERT INTO FOOD_ORDER (order_id, customer_id, restaurant_id, ordered_at, order_status, dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee)
VALUES (1011, 14, 3, TIMESTAMP '2026-10-12 18:50:00', 'READY', '102 Marine Plaza, Marine Drive', 'Mumbai', '400020', 50.00);

-- Order 12: Delivered (Historical repeat customer Priyansh)
INSERT INTO FOOD_ORDER (order_id, customer_id, restaurant_id, ordered_at, order_status, dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee)
VALUES (1012, 1, 1, TIMESTAMP '2026-10-09 20:10:00', 'DELIVERED', 'Flat 402, Shanti Niketan Apts, Chanakyapuri', 'New Delhi', '110021', 50.00);

-- ----------------------------------------------------------------------------
-- 7. ORDER_ITEM (Item breakdown with agreed prices)
-- ----------------------------------------------------------------------------
-- Order 1001 items (Total = 650*1 + 795*1 + 280*2 + 50 fee = 2055)
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1001, 101, 1, 650.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1001, 102, 1, 795.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1001, 104, 2, 280.00);

-- Order 1002 items (Total = 620*1 + 580*1 + 160*2 + 60 fee = 1600)
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1002, 201, 1, 620.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1002, 202, 1, 580.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1002, 204, 2, 160.00);

-- Order 1003 items (Total = 1350*1 + 520*1 + 120*2 + 40 fee = 2150)
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1003, 301, 1, 1350.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1003, 302, 1, 520.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1003, 304, 2, 120.00);

-- Order 1004 items (Total = 1450*1 + 350*2 + 180*2 + 50 fee = 2560)
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1004, 103, 1, 1450.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1004, 106, 2, 350.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1004, 107, 2, 180.00);

-- Order 1005 items (Total = 480*2 + 120*1 + 220*2 + 50 fee = 1570)
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1005, 401, 2, 480.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1005, 403, 1, 120.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1005, 405, 2, 220.00);

-- Order 1006 items (Total = 690*1 + 290*2 + 150*2 + 45 fee = 1615)
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1006, 203, 1, 690.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1006, 205, 2, 290.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1006, 206, 2, 150.00);

-- Order 1007 items (Total = 680*1 + 490*1 + 140*2 + 40 fee = 1490)
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1007, 501, 1, 680.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1007, 502, 1, 490.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1007, 506, 2, 140.00);

-- Order 1008 items (Total = 780*1 + 690*1 + 240*2 + 55 fee = 2005)
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1008, 601, 1, 780.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1008, 603, 1, 690.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1008, 604, 2, 240.00);

-- Order 1009 items (Total = 390*1 = 390)
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1009, 402, 1, 390.00);

-- Order 1010 items (Total = 650*1 + 280*1 + 60 fee = 990)
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1010, 101, 1, 650.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1010, 104, 1, 280.00);

-- Order 1011 items (Total = 640*2 + 440*1 + 50 fee = 1770)
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1011, 303, 2, 640.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1011, 306, 1, 440.00);

-- Order 1012 items (Total = 795*2 + 50 fee = 1640)
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1012, 102, 2, 795.00);

-- ----------------------------------------------------------------------------
-- 8. PAYMENT (Exactly 0 or 1 payment per order)
-- ----------------------------------------------------------------------------
INSERT INTO PAYMENT (payment_id, order_id, payment_method, payment_amount, payment_status, paid_at)
VALUES (5001, 1001, 'UPI', 2055.00, 'COMPLETED', TIMESTAMP '2026-10-10 12:31:15');

INSERT INTO PAYMENT (payment_id, order_id, payment_method, payment_amount, payment_status, paid_at)
VALUES (5002, 1002, 'CARD', 1600.00, 'COMPLETED', TIMESTAMP '2026-10-10 13:16:02');

INSERT INTO PAYMENT (payment_id, order_id, payment_method, payment_amount, payment_status, paid_at)
VALUES (5003, 1003, 'NET_BANKING', 2150.00, 'COMPLETED', TIMESTAMP '2026-10-11 19:46:10');

INSERT INTO PAYMENT (payment_id, order_id, payment_method, payment_amount, payment_status, paid_at)
VALUES (5004, 1004, 'UPI', 2560.00, 'COMPLETED', TIMESTAMP '2026-10-12 18:01:25');

INSERT INTO PAYMENT (payment_id, order_id, payment_method, payment_amount, payment_status, paid_at)
VALUES (5005, 1005, 'CARD', 1570.00, 'COMPLETED', TIMESTAMP '2026-10-12 18:21:40');

INSERT INTO PAYMENT (payment_id, order_id, payment_method, payment_amount, payment_status, paid_at)
VALUES (5006, 1006, 'UPI', 1615.00, 'COMPLETED', TIMESTAMP '2026-10-12 18:36:12');

INSERT INTO PAYMENT (payment_id, order_id, payment_method, payment_amount, payment_status, paid_at)
VALUES (5007, 1007, 'CASH_ON_DELIVERY', 1490.00, 'PENDING', NULL);

INSERT INTO PAYMENT (payment_id, order_id, payment_method, payment_amount, payment_status, paid_at)
VALUES (5008, 1008, 'UPI', 2005.00, 'PENDING', NULL);

INSERT INTO PAYMENT (payment_id, order_id, payment_method, payment_amount, payment_status, paid_at)
VALUES (5009, 1009, 'CARD', 390.00, 'FAILED', TIMESTAMP '2026-10-11 11:01:05');

INSERT INTO PAYMENT (payment_id, order_id, payment_method, payment_amount, payment_status, paid_at)
VALUES (5010, 1010, 'UPI', 990.00, 'COMPLETED', TIMESTAMP '2026-10-12 19:11:00');

INSERT INTO PAYMENT (payment_id, order_id, payment_method, payment_amount, payment_status, paid_at)
VALUES (5011, 1011, 'CARD', 1770.00, 'COMPLETED', TIMESTAMP '2026-10-12 18:51:10');

INSERT INTO PAYMENT (payment_id, order_id, payment_method, payment_amount, payment_status, paid_at)
VALUES (5012, 1012, 'UPI', 1640.00, 'COMPLETED', TIMESTAMP '2026-10-09 20:11:15');

-- ----------------------------------------------------------------------------
-- 9. DELIVERY (Fulfillment records respecting time ordering constraints)
-- ----------------------------------------------------------------------------
-- Order 1001: Assigned -> Picked Up -> Delivered
INSERT INTO DELIVERY (order_id, partner_id, assigned_at, picked_up_at, delivered_at)
VALUES (1001, 5, TIMESTAMP '2026-10-10 12:40:00', TIMESTAMP '2026-10-10 12:55:00', TIMESTAMP '2026-10-10 13:20:00');

-- Order 1002: Assigned -> Picked Up -> Delivered
INSERT INTO DELIVERY (order_id, partner_id, assigned_at, picked_up_at, delivered_at)
VALUES (1002, 6, TIMESTAMP '2026-10-10 13:25:00', TIMESTAMP '2026-10-10 13:40:00', TIMESTAMP '2026-10-10 14:05:00');

-- Order 1003: Assigned -> Picked Up -> Delivered
INSERT INTO DELIVERY (order_id, partner_id, assigned_at, picked_up_at, delivered_at)
VALUES (1003, 7, TIMESTAMP '2026-10-11 20:00:00', TIMESTAMP '2026-10-11 20:15:00', TIMESTAMP '2026-10-11 20:42:00');

-- Order 1004: In transit (Assigned -> Picked Up -> delivered_at is NULL)
INSERT INTO DELIVERY (order_id, partner_id, assigned_at, picked_up_at, delivered_at)
VALUES (1004, 5, TIMESTAMP '2026-10-12 18:15:00', TIMESTAMP '2026-10-12 18:28:00', NULL);

-- Order 1005: Assigned to partner 6, awaiting pickup (picked_up_at is NULL)
INSERT INTO DELIVERY (order_id, partner_id, assigned_at, picked_up_at, delivered_at)
VALUES (1005, 6, TIMESTAMP '2026-10-12 18:30:00', NULL, NULL);

-- Order 1012: Historical delivered order assigned to partner 15
INSERT INTO DELIVERY (order_id, partner_id, assigned_at, picked_up_at, delivered_at)
VALUES (1012, 15, TIMESTAMP '2026-10-09 20:20:00', TIMESTAMP '2026-10-09 20:35:00', TIMESTAMP '2026-10-09 21:00:00');

COMMIT;
