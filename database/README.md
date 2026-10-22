# SAVOUR Database Tier — Oracle SQL Guide

This directory houses the complete Oracle SQL DDL, DML, Analytical Queries, and Constraints Demonstration scripts for the **SAVOUR Food Delivery System** (BACSE202 Database Systems Project, VIT).

---

## 1. Relational Schema Summary (Phase 1 Preserved)

The system implements the 9 normalized relations directly mapped from the approved Phase 1 EER diagram:

```
+---------------------------------------------------------------------------------+
|                                 APP_USER                                        |
|        (user_id [PK], full_name, email [UQ], phone [CHK len>=10])               |
+---------------------------------------+-----------------------------------------+
                                        | (Specialization / Subtypes)
                   +--------------------+--------------------+
                   |                                         |
         +---------v---------+                     +---------v---------+
         |     CUSTOMER      |                     |  DELIVERY_PARTNER |
         | (user_id [PK/FK], |                     | (user_id [PK/FK], |
         |  customer_since)  |                     |  transport_mode,  |
         +---------+---------+                     |  availability)    |
                   |                               +---------+---------+
                   | places (1:N)                            | handles (0:N)
         +---------v---------+                     +---------v---------+
         |    FOOD_ORDER     |                     |     DELIVERY      |
         | (order_id [PK],   |                     | (order_id [PK/FK],|
         |  customer_id [FK],|                     |  partner_id [FK], |
         |  restaurant_id,   |                     |  assigned_at,     |
         |  ordered_at,      |                     |  picked_up_at,    |
         |  order_status,    |                     |  delivered_at)    |
         |  dropoff_address, |                     +---------^---------+
         |  delivery_fee)    |                               |
         +---+-----------+---+                               |
             |           |                                   |
             |           | has delivery (0:1) ---------------+
             |           | has payment (0:1)
             |           +-----------------> +-------------------------+
             |                               |        PAYMENT          |
             |                               | (payment_id [PK],       |
             | contains (1:N)                |  order_id [FK, UQ],     |
             |                               |  method, amount, status)|
             |                               +-------------------------+
             |
   +---------v---------+                     +-------------------------+
   |    ORDER_ITEM     | offers (1:N)        |       RESTAURANT        |
   | (order_id [PK/FK],|<--------------------+ (restaurant_id [PK],   |
   |  item_id [PK/FK], |                     |  name, address, city,   |
   |  quantity,        |                     |  postal_code, phone)    |
   |  agreed_price)    |                     +------------+------------+
   +---------^---------+                                  | offers (1:N)
             |                               +------------v------------+
             +-------------------------------+        MENU_ITEM        |
                                             | (item_id [PK],          |
                                             |  restaurant_id [FK],    |
                                             |  name, category, price, |
                                             |  is_available)          |
                                             +-------------------------+
```

---

## 2. Script Execution Order

Run the scripts in Oracle SQL Developer, SQL*Plus, or DBeaver in exact numerical sequence:

1. **`01_create_tables.sql`**:
   - Drops any pre-existing tables in clean reverse dependency order.
   - Creates the 9 tables with identity columns (`START WITH 1 INCREMENT BY 1`).
   - Implements `PRIMARY KEY`, `FOREIGN KEY` (`ON DELETE CASCADE` where appropriate), `UNIQUE`, and `CHECK` constraints.
   - Creates 6 performance indexes for foreign key lookups.

2. **`02_seed_data.sql`**:
   - Idempotently deletes existing rows.
   - Inserts 16 users (including dual-role personas), 6 top-tier Indian restaurants, 42 regional dishes, 12 orders spanning all lifecycle stages, 12 payment rows, and delivery fulfillment assignments.

3. **`03_useful_queries.sql`**:
   - Computes dynamic order totals: `Order Total = SUM(quantity * agreed_unit_price) + delivery_fee`.
   - Generates restaurant revenue summaries, delivery fleet workload, and a full 9-table unified join.

4. **`04_constraints_demo.sql`**:
   - Automated PL/SQL test suite verifying all 8 constraints and demonstrating Oracle constraint exception codes (`ORA-00001`, `ORA-02290`, `ORA-02291`).

---

## 3. Running via SQL*Plus or SQL Developer

### Option A: Oracle SQL Developer
1. Open SQL Developer and connect to your Oracle database connection (e.g. `system` or `savour_db`).
2. Open each `.sql` file in tab order.
3. Click **Run Script (F5)** for each file.

### Option B: Terminal via SQL*Plus
```bash
sqlplus username/password@localhost:1521/XEPDB1 @database/01_create_tables.sql
sqlplus username/password@localhost:1521/XEPDB1 @database/02_seed_data.sql
sqlplus username/password@localhost:1521/XEPDB1 @database/03_useful_queries.sql
sqlplus username/password@localhost:1521/XEPDB1 @database/04_constraints_demo.sql
```

---

## 4. Connection Details for Spring Boot Backend

Set the following environment variables in `backend/.env` or export them before starting the backend:

```bash
export ORACLE_URL=jdbc:oracle:thin:@localhost:1521/XEPDB1
export ORACLE_USERNAME=savour_user
export ORACLE_PASSWORD=your_password
```
