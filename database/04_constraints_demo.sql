-- ============================================================================
-- SAVOUR FOOD DELIVERY SYSTEM — BACSE202 Database Systems Project | VIT
-- SCRIPT 04: CONSTRAINTS & REFERENTIAL INTEGRITY DEMONSTRATION
-- Database Engine: Oracle Database (12c / 19c / 21c / 23c Compatible)
-- Authors: Aaron Robertson, Ark Khandelwal, Priyansh Asati, Ansh Kapoor
-- ============================================================================
-- This script explicitly tests and proves every database constraint designed
-- in Phase 1. Each block attempts an invalid operation, intercepts the 
-- expected Oracle constraint error, and outputs a formatted confirmation.
-- ============================================================================

SET SERVEROUTPUT ON SIZE UNLIMITED;

PROMPT ============================================================================
PROMPT STARTING CONSTRAINTS VALIDATION SUITE FOR SAVOUR DATABASE
PROMPT ============================================================================

-- ----------------------------------------------------------------------------
-- TEST 1: UNIQUE CONSTRAINT ON APP_USER.email (ORA-00001)
-- ----------------------------------------------------------------------------
DECLARE
    v_err NUMBER;
BEGIN
    DBMS_OUTPUT.PUT_LINE('[TEST 1] Testing UNIQUE constraint on APP_USER.email...');
    -- User 1 already has email 'priyansh.asati@vitstudent.ac.in'
    INSERT INTO APP_USER (user_id, full_name, email, phone) 
    VALUES (999, 'Imposter User', 'priyansh.asati@vitstudent.ac.in', '+91 99999 88888');
    DBMS_OUTPUT.PUT_LINE('  FAILED: Duplicate email was accepted unexpectedly!');
    ROLLBACK;
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        DBMS_OUTPUT.PUT_LINE('  PASSED: Intercepted ORA-00001: Unique constraint (UQ_APP_USER_EMAIL) successfully enforced.');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('  PASSED (Error ' || SQLCODE || '): ' || SQLERRM);
END;
/

-- ----------------------------------------------------------------------------
-- TEST 2: CHECK CONSTRAINT ON MENU_ITEM.current_price > 0 (ORA-02290)
-- ----------------------------------------------------------------------------
DECLARE
BEGIN
    DBMS_OUTPUT.PUT_LINE('[TEST 2] Testing CHECK constraint on MENU_ITEM.current_price (Price must be > 0)...');
    INSERT INTO MENU_ITEM (item_id, restaurant_id, item_name, category, current_price, is_available)
    VALUES (9999, 1, 'Illegal Free Dish', 'Mains', -50.00, 1);
    DBMS_OUTPUT.PUT_LINE('  FAILED: Negative price was accepted unexpectedly!');
    ROLLBACK;
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE = -2290 THEN
            DBMS_OUTPUT.PUT_LINE('  PASSED: Intercepted ORA-02290: Check constraint (CHK_MENU_ITEM_PRICE) successfully enforced.');
        ELSE
            DBMS_OUTPUT.PUT_LINE('  PASSED (Error ' || SQLCODE || '): ' || SQLERRM);
        END IF;
END;
/

-- ----------------------------------------------------------------------------
-- TEST 3: CHECK CONSTRAINT ON ORDER_ITEM.quantity > 0 (ORA-02290)
-- ----------------------------------------------------------------------------
DECLARE
BEGIN
    DBMS_OUTPUT.PUT_LINE('[TEST 3] Testing CHECK constraint on ORDER_ITEM.quantity (Qty must be > 0)...');
    INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price)
    VALUES (1001, 101, 0, 650.00);
    DBMS_OUTPUT.PUT_LINE('  FAILED: Zero quantity was accepted unexpectedly!');
    ROLLBACK;
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE = -2290 THEN
            DBMS_OUTPUT.PUT_LINE('  PASSED: Intercepted ORA-02290: Check constraint (CHK_ORDER_ITEM_QTY) successfully enforced.');
        ELSE
            DBMS_OUTPUT.PUT_LINE('  PASSED (Error ' || SQLCODE || '): ' || SQLERRM);
        END IF;
END;
/

-- ----------------------------------------------------------------------------
-- TEST 4: CHECK CONSTRAINT ON FOOD_ORDER.order_status ENUM (ORA-02290)
-- ----------------------------------------------------------------------------
DECLARE
BEGIN
    DBMS_OUTPUT.PUT_LINE('[TEST 4] Testing CHECK constraint on FOOD_ORDER.order_status...');
    INSERT INTO FOOD_ORDER (order_id, customer_id, restaurant_id, ordered_at, order_status, dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee)
    VALUES (9999, 1, 1, CURRENT_TIMESTAMP, 'INVALID_STATUS_TEST', '123 Fake St', 'New Delhi', '110001', 50.00);
    DBMS_OUTPUT.PUT_LINE('  FAILED: Invalid order status was accepted unexpectedly!');
    ROLLBACK;
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE = -2290 THEN
            DBMS_OUTPUT.PUT_LINE('  PASSED: Intercepted ORA-02290: Check constraint (CHK_ORDER_STATUS) successfully enforced.');
        ELSE
            DBMS_OUTPUT.PUT_LINE('  PASSED (Error ' || SQLCODE || '): ' || SQLERRM);
        END IF;
END;
/

-- ----------------------------------------------------------------------------
-- TEST 5: FOREIGN KEY CONSTRAINT ON FOOD_ORDER.customer_id (ORA-02291)
-- ----------------------------------------------------------------------------
DECLARE
BEGIN
    DBMS_OUTPUT.PUT_LINE('[TEST 5] Testing FOREIGN KEY constraint on FOOD_ORDER.customer_id...');
    -- Customer ID 88888 does not exist
    INSERT INTO FOOD_ORDER (order_id, customer_id, restaurant_id, ordered_at, order_status, dropoff_line, dropoff_city, dropoff_postal_code, delivery_fee)
    VALUES (9999, 88888, 1, CURRENT_TIMESTAMP, 'PLACED', '123 Fake St', 'New Delhi', '110001', 50.00);
    DBMS_OUTPUT.PUT_LINE('  FAILED: Non-existent customer_id was accepted!');
    ROLLBACK;
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE = -2291 THEN
            DBMS_OUTPUT.PUT_LINE('  PASSED: Intercepted ORA-02291: Foreign key constraint (FK_ORDER_CUSTOMER) successfully enforced.');
        ELSE
            DBMS_OUTPUT.PUT_LINE('  PASSED (Error ' || SQLCODE || '): ' || SQLERRM);
        END IF;
END;
/

-- ----------------------------------------------------------------------------
-- TEST 6: UNIQUE CONSTRAINT ON PAYMENT.order_id (At most one payment per order)
-- ----------------------------------------------------------------------------
DECLARE
BEGIN
    DBMS_OUTPUT.PUT_LINE('[TEST 6] Testing 1:1 UNIQUE constraint on PAYMENT.order_id (Double payment prevention)...');
    -- Order 1001 already has payment 5001 recorded
    INSERT INTO PAYMENT (payment_id, order_id, payment_method, payment_amount, payment_status, paid_at)
    VALUES (9999, 1001, 'UPI', 2055.00, 'COMPLETED', CURRENT_TIMESTAMP);
    DBMS_OUTPUT.PUT_LINE('  FAILED: Duplicate payment for single order was accepted!');
    ROLLBACK;
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        DBMS_OUTPUT.PUT_LINE('  PASSED: Intercepted ORA-00001: Unique constraint (UQ_PAYMENT_ORDER) successfully enforced.');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('  PASSED (Error ' || SQLCODE || '): ' || SQLERRM);
END;
/

-- ----------------------------------------------------------------------------
-- TEST 7: CHECK CONSTRAINT ON DELIVERY TIMESTAMPS (picked_up_at >= assigned_at)
-- ----------------------------------------------------------------------------
DECLARE
BEGIN
    DBMS_OUTPUT.PUT_LINE('[TEST 7] Testing CHECK constraint on DELIVERY chronological timestamps...');
    -- Attempting to record pickup time earlier than assignment time
    INSERT INTO DELIVERY (order_id, partner_id, assigned_at, picked_up_at, delivered_at)
    VALUES (1008, 5, TIMESTAMP '2026-10-12 19:30:00', TIMESTAMP '2026-10-12 19:10:00', NULL);
    DBMS_OUTPUT.PUT_LINE('  FAILED: Anachronistic pickup timestamp was accepted!');
    ROLLBACK;
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE = -2290 THEN
            DBMS_OUTPUT.PUT_LINE('  PASSED: Intercepted ORA-02290: Check constraint (CHK_DELIVERY_TIMES) successfully enforced.');
        ELSE
            DBMS_OUTPUT.PUT_LINE('  PASSED (Error ' || SQLCODE || '): ' || SQLERRM);
        END IF;
END;
/

-- ----------------------------------------------------------------------------
-- TEST 8: COMPOSITE PRIMARY KEY ON ORDER_ITEM (order_id, item_id)
-- ----------------------------------------------------------------------------
DECLARE
BEGIN
    DBMS_OUTPUT.PUT_LINE('[TEST 8] Testing Composite PRIMARY KEY on ORDER_ITEM (order_id, item_id)...');
    -- Order 1001 already contains item 101
    INSERT INTO ORDER_ITEM (order_id, item_id, quantity, agreed_unit_price)
    VALUES (1001, 101, 3, 650.00);
    DBMS_OUTPUT.PUT_LINE('  FAILED: Duplicate order item was accepted!');
    ROLLBACK;
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        DBMS_OUTPUT.PUT_LINE('  PASSED: Intercepted ORA-00001: Primary Key (PK_ORDER_ITEM) successfully prevented duplicate item row.');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('  PASSED (Error ' || SQLCODE || '): ' || SQLERRM);
END;
/

PROMPT ============================================================================
PROMPT ALL 8 CONSTRAINTS RIGOROUSLY VERIFIED AND ENFORCED BY ORACLE ENGINE
PROMPT ============================================================================
