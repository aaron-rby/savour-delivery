# SAVOUR Food Delivery System — Evaluation & Demonstration Guide
## Course: BACSE202 Database Systems | Vellore Institute of Technology (VIT)

---

## 1. Project Information & Rubric Alignment

- **Project Title**: SAVOUR — Enterprise Food Delivery & Relational Database System
- **Course**: BACSE202 Database Systems
- **Institution**: Vellore Institute of Technology (VIT)
- **Technology Stack**:
  - **Database**: Oracle Database 23ai / Oracle SQL (DDL, DML, Constraints)
  - **Backend**: Java 21, Spring Boot 3.3.4, Spring JDBC (`JdbcTemplate`), HikariCP
  - **Frontend**: Next.js 16 (App Router), TypeScript, Vanilla CSS design tokens
  - **Testing**: JUnit 5, Spring Boot Test (12 Integration Scenarios)

---

## 2. 7-Minute Live Demonstration Script

Follow this step-by-step presentation script to demonstrate complete full-stack mastery and database rigor to the course instructor:

### Step 1: Architectural Introduction (1 Minute)
1. Open the Home Page: `http://localhost:3000`.
2. Point out the top badge: **Oracle 23ai • BACSE202 DBMS Project | VIT**.
3. Highlight the live database indicator in the navbar (green pulse for connected status).
4. Explain the 3-Tier Enterprise Architecture: Next.js frontend communicates with Spring Boot REST controllers, which execute raw SQL queries via `JdbcTemplate` on the normalized Oracle database schema.

### Step 2: Database Design & Schema Normalization (1.5 Minutes)
1. Open `docs/database-design.md` or the `/admin` page.
2. Present the **9 Normalized Relational Entities**:
   - `USERS`, `RESTAURANTS`, `MENU_ITEMS`, `ORDERS`, `ORDER_ITEMS`, `DELIVERY_PARTNERS`, `DELIVERIES`, `PAYMENTS`, `REVIEWS`.
3. Explain the normalization proofs:
   - **1NF**: Atomic scalar values, composite addresses decomposed into atomic fields.
   - **2NF**: Surrogate IDENTITY keys eliminate partial functional dependencies.
   - **3NF & BCNF**: Elimination of transitive dependencies; every determinant is a superkey.

### Step 3: Customer Order Placement & ACID Price Freezing (1.5 Minutes)
1. Use the **Persona Switcher** in the top-right corner to select **Alex Chen (Customer)**.
2. Navigate to **Explore Restaurants** (`/restaurants`) &rarr; select **Trattoria Bella**.
3. Add **Margherita Pizza** and **Truffle Tagliatelle** to cart.
4. Click **View Cart & Checkout** (`/cart`).
5. Explain the **Price Freezing Invariant**:
   - Show how unit prices are locked into `ORDER_ITEMS.agreed_unit_price` at checkout time.
   - Even if the restaurant operator later increases the dish price on the menu, this historical order remains completely unchanged!
6. Click **Proceed to Checkout** &rarr; select payment method &rarr; click **Place Order (Commit Oracle Transaction)**.
7. Observe the transactional commit animation: inserts into `ORDERS`, `ORDER_ITEMS`, and `PAYMENTS` execute atomically within an ACID transaction block.

### Step 4: Multi-Restaurant Conflict Rule (30 Seconds)
1. Go back to `/restaurants` and open **Spice Symphony**.
2. Try adding an item to the cart.
3. The **Multi-Restaurant Conflict Modal** appears, enforcing that an order header cannot reference multiple distinct restaurants.

### Step 5: Kitchen Operator & Delivery Lifecycle (1.5 Minutes)
1. Switch Persona to **Marco Rossi (Restaurant Operator - Trattoria Bella)**.
2. Navigate to **Operator Portal** (`/operator`).
3. View the live kitchen queue. Advance the customer's order:
   - Click **Accept Order &rarr; CONFIRMED**.
   - Click **Start Cooking &rarr; PREPARING**.
4. Switch to the **Menu Inventory** tab:
   - Toggle an item's availability switch to mark it "Sold Out" (executes `UPDATE MENU_ITEMS SET is_available = 0`).
5. Switch Persona to **Jake Morrison (Delivery Partner)** &rarr; navigate to **Delivery Hub** (`/delivery`).
6. Click **Pick Up Order &rarr; OUT_FOR_DELIVERY**.
7. Click **Complete Delivery &rarr; DELIVERED** to settle the order and credit the driver's tip.

### Step 6: Interactive Oracle Constraint Violation Demonstration (1 Minute)
1. Switch Persona to **System Admin** &rarr; navigate to **DB Admin** (`/admin`).
2. Point out the live table row count cards (reflecting real records across all 9 tables).
3. Scroll to the **Interactive Constraint Violation Simulator**:
   - Click **1. Duplicate Email Violation**: Observe caught exception **`ORA-00001`** (`UQ_USERS_EMAIL`).
   - Click **2. Check Constraint Rating Out-of-Bounds**: Observe caught exception **`ORA-02290`** (`CK_REVIEWS_RATING`).
   - Click **3. Foreign Key Missing Parent Order**: Observe caught exception **`ORA-02291`** (`FK_ORDER_ITEMS_ORDER`).
   - Click **4. Restrict Child Delete on Active User**: Observe caught exception **`ORA-02292`** (`FK_ORDERS_CUSTOMER`).
4. Scroll to the **SQL Query Sandbox**:
   - Select **Query 1: Recompute Order Totals vs Stored Invariant**.
   - Click **Run Query** to demonstrate real-time cross-checking of invoice line sums.

---

## 3. Quick Terminal Commands for Presentation

### Run Automated Backend Test Suite
```bash
cd backend
mvn test
```
*Demonstrates 12/12 passing integration tests with 0 failures.*

### Start Backend Server
```bash
cd backend
mvn spring-boot:run
```
*Starts Tomcat on port 8080 with embedded Oracle-mode database.*

### Start Frontend Server
```bash
cd frontend
npm run dev
```
*Starts Next.js on http://localhost:3000.*
