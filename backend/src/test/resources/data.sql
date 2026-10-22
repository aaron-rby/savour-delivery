INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (1, 'Priyansh Asati', 'priyansh.asati@vitstudent.ac.in', '+91 98765 43210');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (2, 'Aarav Patel', 'aarav.patel@gmail.com', '+91 98111 22334');
INSERT INTO APP_USER (user_id, full_name, email, phone) VALUES (5, 'Vikram Sharma', 'vikram.delivery@savour.in', '+91 98444 55667');

INSERT INTO CUSTOMER (user_id, customer_since) VALUES (1, CURRENT_DATE);
INSERT INTO CUSTOMER (user_id, customer_since) VALUES (2, CURRENT_DATE);

INSERT INTO DELIVERY_PARTNER (user_id, transport_mode, availability_status) VALUES (5, 'BIKE', 'AVAILABLE');

INSERT INTO RESTAURANT (restaurant_id, restaurant_name, address_line, city, postal_code, contact_phone) 
VALUES (1, 'Bukhara - ITC Maurya', 'Diplomatic Enclave, Sardar Patel Marg', 'New Delhi', '110021', '+91 11 2611 2233');

INSERT INTO RESTAURANT (restaurant_id, restaurant_name, address_line, city, postal_code, contact_phone) 
VALUES (2, 'Karavalli - The Gateway', '66 Residency Road', 'Bengaluru', '560025', '+91 80 6660 4545');

INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) 
VALUES (101, 1, 'Dal Bukhara (Slow Cooked 18h)', 'Mains', 650.00, 1);

INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) 
VALUES (102, 1, 'Murgh Malai Kebab', 'Starters', 795.00, 1);

INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available) 
VALUES (105, 1, 'Tandoori Jhinga (Jumbo Prawns)', 'Starters', 1250.00, 0); -- Sold out

INSERT INTO FOOD_ORDER (order_id, customer_id, restaurant_id, ordered_at, order_status, dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee)
VALUES (1001, 1, 1, CURRENT_TIMESTAMP, 'PLACED', 'Flat 402, Shanti Niketan Apts', 'New Delhi', '110021', 50.00);

INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price) VALUES (1001, 101, 2, 650.00);

INSERT INTO PAYMENT (payment_id, order_id, payment_method, payment_amount, payment_status, paid_at)
VALUES (5001, 1001, 'UPI', 1350.00, 'COMPLETED', CURRENT_TIMESTAMP);
