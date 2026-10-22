-- ============================================================================
-- SAVOUR FOOD DELIVERY SYSTEM — Comprehensive Relational Seed Data
-- BACSE202 Database Systems Project | VIT Vellore
-- ============================================================================

-- 1. APP_USER (Customers, Operators, Delivery Partners, Admins)
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (1, 'Priyansh Asati', 'priyansh.asati@vitstudent.ac.in', '+91 98765 43210');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (2, 'Aarav Patel', 'aarav.patel@gmail.com', '+91 98111 22334');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (3, 'Ananya Sharma', 'ananya.sharma@yahoo.com', '+91 98222 33445');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (4, 'Rohan Verma', 'rohan.verma@outlook.com', '+91 98333 44556');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (5, 'Vikram Sharma', 'vikram.delivery@savour.in', '+91 98444 55667');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (6, 'Kavita Nair', 'kavita.nair@rediffmail.com', '+91 98555 66778');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (7, 'Chef Sanjeev Kapoor', 'bukhara.ops@itc.in', '+91 98666 77889');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (8, 'Aaron Robertson', 'aaron.r@vitstudent.ac.in', '+91 98777 88990');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (9, 'Ark Khandelwal', 'ark.k@vitstudent.ac.in', '+91 98888 99001');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (10, 'Ansh Kapoor', 'ansh.k@vitstudent.ac.in', '+91 98999 00112');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (11, 'Suresh Kumar', 'suresh.delivery@savour.in', '+91 97111 12345');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (12, 'Dinesh Karthik', 'dinesh.delivery@savour.in', '+91 97222 23456');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (13, 'Rajesh Pillai', 'rajesh.delivery@savour.in', '+91 97333 34567');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (14, 'Chef Sabyasachi', 'ballygunge.ops@6ballygunge.in', '+91 97444 45678');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (15, 'Manoj Tiwari', 'manoj.delivery@savour.in', '+91 97555 56789');

-- 2. CUSTOMER
INSERT INTO CUSTOMER (user_id, customer_since) VALUES (1, DATE '2024-01-15');
INSERT INTO CUSTOMER (user_id, customer_since) VALUES (2, DATE '2024-03-22');
INSERT INTO CUSTOMER (user_id, customer_since) VALUES (3, DATE '2024-06-10');
INSERT INTO CUSTOMER (user_id, customer_since) VALUES (4, DATE '2024-08-01');
INSERT INTO CUSTOMER (user_id, customer_since) VALUES (8, DATE '2024-09-12');
INSERT INTO CUSTOMER (user_id, customer_since) VALUES (9, DATE '2024-09-18');
INSERT INTO CUSTOMER (user_id, customer_since) VALUES (10, DATE '2024-10-02');
INSERT INTO CUSTOMER (user_id, customer_since) VALUES (14, DATE '2024-10-05');

-- 3. DELIVERY_PARTNER
INSERT INTO DELIVERY_PARTNER (user_id, transport_mode, availability_status) VALUES (5, 'BIKE', 'AVAILABLE');
INSERT INTO DELIVERY_PARTNER (user_id, transport_mode, availability_status) VALUES (6, 'SCOOTER', 'BUSY');
INSERT INTO DELIVERY_PARTNER (user_id, transport_mode, availability_status) VALUES (11, 'BIKE', 'AVAILABLE');
INSERT INTO DELIVERY_PARTNER (user_id, transport_mode, availability_status) VALUES (12, 'EV_SCOOTER', 'BUSY');
INSERT INTO DELIVERY_PARTNER (user_id, transport_mode, availability_status) VALUES (13, 'BICYCLE', 'AVAILABLE');
INSERT INTO DELIVERY_PARTNER (user_id, transport_mode, availability_status) VALUES (15, 'ELECTRIC_VEHICLE', 'AVAILABLE');

-- 4. RESTAURANT
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

-- 5. MENU_ITEM
-- Restaurant 1: Bukhara
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (101, 1, 'Dal Bukhara (Slow Cooked 18h)', 'Mains', 650.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (102, 1, 'Murgh Malai Kebab', 'Starters', 795.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (103, 1, 'Sikandari Raan', 'Mains', 1450.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (104, 1, 'Bukhara Naan (Giant Tandoor)', 'Breads', 280.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (105, 1, 'Tandoori Jhinga (Jumbo Prawns)', 'Starters', 1250.00, 0);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (106, 1, 'Kulfi Falooda with Rose Petals', 'Desserts', 350.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (107, 1, 'Smoked Chaas with Cumin', 'Beverages', 180.00, 1);

-- Restaurant 2: Karavalli
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (201, 2, 'Mangalorean Anjal Fish Fry', 'Starters', 620.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (202, 2, 'Kori Gassi with Neer Dosa', 'Mains', 580.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (203, 2, 'Alleppey Fish Curry', 'Mains', 690.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (204, 2, 'Malabar Parotta (Pack of 3)', 'Breads', 160.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (205, 2, 'Tender Coconut Payasam', 'Desserts', 290.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (206, 2, 'Fresh Kokum Sharbath', 'Beverages', 150.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (207, 2, 'Tiger Prawn Ghee Roast', 'Starters', 890.00, 0);

-- Restaurant 3: Trishna
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (301, 3, 'Signature Butter Garlic Crab', 'Mains', 1350.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (302, 3, 'Squid Koliwada Fry', 'Starters', 520.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (303, 3, 'Kolambi (Prawn) Biryani', 'Biryani', 640.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (304, 3, 'Sol Kadhi (Digestive Berry Coconut)', 'Beverages', 120.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (305, 3, 'Steamed Appam (Set of 2)', 'Breads', 140.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (306, 3, 'Bombay Duck Crispy Fry', 'Starters', 440.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (307, 3, 'Lobster in Chettinad Masala', 'Mains', 1850.00, 0);

-- Restaurant 4: Paradise Heritage
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (401, 4, 'Royal Mutton Dum Biryani', 'Biryani', 480.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (402, 4, 'Special Chicken Biryani Pot', 'Biryani', 390.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (403, 4, 'Mirchi Ka Salan & Dahi Chutney', 'Sides', 120.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (404, 4, 'Pathar Ka Gosht (Stone Grilled Lamb)', 'Starters', 560.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (405, 4, 'Shahi Double Ka Meetha', 'Desserts', 220.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (406, 4, 'Irani Chai Flask (Serves 3)', 'Beverages', 160.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (407, 4, 'Haleem with Fried Onions & Cashews', 'Mains', 420.00, 0);

-- Restaurant 5: Dakshin (Including South Indian Staples: Masala Dosa, Idli, Pongal, Vada)
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (501, 5, 'Crispy Ghee Masala Dosa with Sambar & Chutneys', 'Tiffin', 220.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (502, 5, 'Steamed Thatte Idli with Coconut Chutney (Set of 2)', 'Tiffin', 140.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (503, 5, 'Traditional Ven Pongal with Ghee & Cashews', 'Tiffin', 190.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (504, 5, 'Crispy Medu Vada with Sambar (2 pcs)', 'Tiffin', 130.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (505, 5, 'Meen Polichathu in Banana Leaf', 'Mains', 680.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (506, 5, 'Chettinad Chicken Varuval', 'Starters', 490.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (507, 5, 'Bisibele Bath with Ghee & Boondi', 'Mains', 360.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (508, 5, 'Elaneer Souffle', 'Desserts', 280.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (509, 5, 'Mylapore Degree Filter Coffee', 'Beverages', 140.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (510, 5, 'Nandu Crab Pepper Fry', 'Starters', 750.00, 0);

-- Restaurant 6: 6 Ballygunge Place
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (601, 6, 'Daab Chingri (Prawns in Tender Coconut)', 'Mains', 780.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (602, 6, 'Kolkata Bhetki Fish Fry (2 pcs)', 'Starters', 460.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (603, 6, 'Kosha Mangsho (Spicy Slow Cooked Mutton)', 'Mains', 690.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (604, 6, 'Luchi with Chholar Dal (4 pcs)', 'Breads', 240.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (605, 6, 'Baked Rosogolla (2 pcs)', 'Desserts', 190.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (606, 6, 'Gondhoraj Lebur Ghol', 'Beverages', 130.00, 1);
INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) VALUES (607, 6, 'Ilish Bhapa (Steamed Hilsa in Mustard)', 'Mains', 950.00, 0);

-- 6. FOOD_ORDER
INSERT INTO FOOD_ORDER (order_id, customer_id, restaurant_id, ordered_at, order_status, dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee)
VALUES (1001, 1, 1, CURRENT_TIMESTAMP, 'PLACED', 'Flat 402, Shanti Niketan Apts, Chanakyapuri', 'New Delhi', '110021', 50.00);

INSERT INTO FOOD_ORDER (order_id, customer_id, restaurant_id, ordered_at, order_status, dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee)
VALUES (1002, 2, 2, CURRENT_TIMESTAMP, 'DELIVERED', 'Villa 12, Palm Meadows, Whitefield', 'Bengaluru', '560066', 60.00);

INSERT INTO FOOD_ORDER (order_id, customer_id, restaurant_id, ordered_at, order_status, dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee)
VALUES (1003, 3, 3, CURRENT_TIMESTAMP, 'DELIVERED', 'B-1401, Lodha Bellissimo, Mahalaxmi', 'Mumbai', '400011', 40.00);

INSERT INTO FOOD_ORDER (order_id, customer_id, restaurant_id, ordered_at, order_status, dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee)
VALUES (1004, 1, 1, CURRENT_TIMESTAMP, 'OUT_FOR_DELIVERY', 'Flat 402, Shanti Niketan Apts, Chanakyapuri', 'New Delhi', '110021', 50.00);

INSERT INTO FOOD_ORDER (order_id, customer_id, restaurant_id, ordered_at, order_status, dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee)
VALUES (1005, 4, 4, CURRENT_TIMESTAMP, 'PREPARING', 'Tower 3, Apt 804, My Home Bhooja, Hitec City', 'Hyderabad', '500081', 50.00);

INSERT INTO FOOD_ORDER (order_id, customer_id, restaurant_id, ordered_at, order_status, dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee)
VALUES (1006, 1, 5, CURRENT_TIMESTAMP, 'DELIVERED', 'Flat 402, Shanti Niketan Apts, Chanakyapuri', 'New Delhi', '110021', 50.00);

-- 7. ORDER_ITEM
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1001, 101, 2, 650.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1001, 104, 1, 280.00);

INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1002, 201, 1, 620.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1002, 202, 1, 580.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1002, 204, 2, 160.00);

INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1003, 301, 1, 1350.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1003, 304, 2, 120.00);

INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1004, 102, 2, 795.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1004, 106, 1, 350.00);

INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1005, 401, 2, 480.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1005, 403, 1, 120.00);

INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1006, 501, 2, 220.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1006, 502, 1, 140.00);
INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1006, 504, 1, 130.00);

-- 8. PAYMENT
INSERT INTO PAYMENT (payment_id, order_id, payment_method, payment_amount, payment_status, paid_at)
VALUES (5001, 1001, 'UPI', 1630.00, 'COMPLETED', CURRENT_TIMESTAMP);

INSERT INTO PAYMENT (payment_id, order_id, payment_method, payment_amount, payment_status, paid_at)
VALUES (5002, 1002, 'CARD', 1580.00, 'COMPLETED', CURRENT_TIMESTAMP);

INSERT INTO PAYMENT (payment_id, order_id, payment_method, payment_amount, payment_status, paid_at)
VALUES (5003, 1003, 'NET_BANKING', 1630.00, 'COMPLETED', CURRENT_TIMESTAMP);

INSERT INTO PAYMENT (payment_id, order_id, payment_method, payment_amount, payment_status, paid_at)
VALUES (5004, 1004, 'UPI', 1990.00, 'COMPLETED', CURRENT_TIMESTAMP);

INSERT INTO PAYMENT (payment_id, order_id, payment_method, payment_amount, payment_status, paid_at)
VALUES (5005, 1005, 'CARD', 1130.00, 'COMPLETED', CURRENT_TIMESTAMP);

INSERT INTO PAYMENT (payment_id, order_id, payment_method, payment_amount, payment_status, paid_at)
VALUES (5006, 1006, 'UPI', 760.00, 'COMPLETED', CURRENT_TIMESTAMP);

-- 9. DELIVERY
INSERT INTO DELIVERY (order_id, partner_id, assigned_at, picked_up_at, delivered_at)
VALUES (1002, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO DELIVERY (order_id, partner_id, assigned_at, picked_up_at, delivered_at)
VALUES (1003, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO DELIVERY (order_id, partner_id, assigned_at, picked_up_at, delivered_at)
VALUES (1004, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL);

INSERT INTO DELIVERY (order_id, partner_id, assigned_at, picked_up_at, delivered_at)
VALUES (1006, 11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
