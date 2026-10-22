## Slide 1: Food delivery backed by a relational database

Opening pitch: SAVOUR connects the customer order journey to a relational database. Our strongest evidence is the transaction behind checkout: the order header, item prices and payment record commit together. This presentation covers every requirement in the Phase 2 and Phase 3 rubric.

## Slide 2: One order needs a consistent record

Pitch: An attractive ordering screen is only the beginning. If the menu changes after checkout, the customer still needs the original invoice. If a write fails, the system must avoid a partial order. SAVOUR uses relational keys, server validation and transactions to address these problems.

## Slide 3: Every rubric item has an evidence path

Course overview pages 8–9: Phase 2 awards 2 marks each to DDL, DML, frontend, business logic and initial connectivity (the latter appears in the stage-wise rubric on page 6). Phase 3 awards 2 for complete connectivity, 3 for testing and 5 for demonstration/documentation. The 80% and 100% figures are course milestones, not measured claims about this code.

## Slide 4: The browser reaches the database through JDBC

Explain the request path in that order. Java 21 is the project target, while the verified Windows run uses Java 26. Spring Boot is 3.3.4 and Next.js is 16.4.0. The current dev profile uses H2 in Oracle compatibility mode. Oracle JDBC is included as a dependency, but this run does not establish an Oracle connection. Source: backend/pom.xml, application.properties, application-dev.properties, frontend/package.json.

## Slide 5: Nine tables represent the order lifecycle

Use the actual schema names. CUSTOMER and DELIVERY_PARTNER share their primary key with APP_USER as subtype tables. RESTAURANT has many MENU_ITEM and FOOD_ORDER records. FOOD_ORDER has many ORDER_ITEM records. PAYMENT.order_id is unique. DELIVERY.order_id is its primary key. ORDER_ITEM uses the composite primary key (order_id, item_id). Source: backend/src/main/resources/schema.sql.

## Slide 6: Keys and checks enforce valid records

Additional constraints: is_available IN (0,1), delivery_fee >= 0, PAYMENT.payment_amount > 0. Selected children cascade on deletion, while references such as FOOD_ORDER.customer_id restrict parent deletion by default. The running DDL does not define status-domain CHECK constraints or a REVIEWS table. Avoid claiming those are present. Source: schema.sql.

## Slide 7: ORDER_ITEM preserves the agreed price

Abbreviated from the executable DDL: both foreign key columns are NOT NULL, and order_id includes ON DELETE CASCADE in the source. The composite key permits one row per dish per order. A quantity represents multiple units. The snapshot is intentional historical data, distinct from the current menu price.

## Slide 8: Separate identities, catalogue and order history

Explain the distinction between current_price and agreed_unit_price: the same dish may have different agreed prices across different orders. Do not claim that surrogate keys alone prove normalization. A complete BCNF proof needs declared functional dependencies for every relation. The supplied narrative documentation describes a different schema, so this slide uses the executable schema.

## Slide 9: Sample records support a complete order journey

Executable data.sql contains realistic Indian restaurant names and rupee prices. Show INSERT examples from data.sql and query the resulting tables. Parent-first loading prevents foreign-key failures. These are demonstration records, not real customers or operational business data.

## Slide 10: A menu record connects a dish to its restaurant

Illustrative SQL using the implemented columns. Run against a disposable demo database, since this insert adds a record. restaurant_id=1 must exist. After the insert, read the generated item ID before using it in an order. The project seed script provides the full population dataset.

## Slide 11: The interface follows each user’s task

Routes: /restaurants, /cart, /checkout, /orders, /operator, /delivery and /admin. Demonstrate the product in the browser. Persona switching supports demonstration and should not be described as production authentication. Frontend API functions fall back to a local dbStore on several failures. Therefore visible UI changes alone do not prove JDBC writes. Source: frontend/src/lib/api.ts and frontend/src/app.

## Slide 12: The server validates an order before insertion

OrderService.placeOrder performs these validations. It checks user and restaurant existence, while the CUSTOMER foreign key ultimately enforces customer subtype membership. The backend does not currently calculate the frontend’s optional tax/tip values. Non-COD payment status is recorded as COMPLETED without a payment-gateway integration. Source: OrderService.java.

## Slide 13: Checkout commits the header, lines and payment together

Explain atomicity: an unhandled runtime exception rolls back the transaction. The service retrieves current menu prices and stores them on each order line. For concurrency hardening, read/lock or version menu prices consistently rather than repeatedly reading them during checkout. The existing rollback test rejects invalid input before writes, so it does not yet prove rollback after a partially completed insert sequence.

## Slide 14: A prepared query retrieves restaurant menu items

MenuItemRepository passes restaurantId separately to JdbcTemplate.query. RowMapper converts ResultSet columns into MenuItem. Prepared statements bind values instead of concatenating user input. For an initial write, show POST /api/menu-items and its repository INSERT with generated-key retrieval. Source: MenuItemRepository.java and MenuItemController.java.

## Slide 15: Create, read and update have backend endpoints

Full CRUD is a Phase 3 requirement. The current code does not satisfy the delete part through the application. A suitable completion task is a constrained delete for an unused menu item, while preserving items referenced by order history. Do not delete business records during the presentation without a dedicated demo dataset. Source: controller and repository inspection.

## Slide 16: A successful page load is only the first check

The database health endpoint executes SELECT 1 FROM DUAL, which H2 Oracle mode also supports. Its engine label is hard-coded to Oracle and is not proof of Oracle use. The current application-dev.properties selects jdbc:h2:mem:savour_dev. In-memory records disappear when the backend restarts. For Oracle verification, configure the base datasource, disable the dev override and run schema/data plus CRUD checks on Oracle.

## Slide 17: 12 tests passed in the current backend run

Verified on 22 October 2026 in Windows, using Java 26 and Maven 3.9.9. Tests use SpringBootTest, JUnit and H2 in Oracle mode. The source labels scenarios up to 13 because one method combines scenarios 3 and 4. Report the actual Maven count of 12. This is backend integration coverage, not a browser end-to-end suite or Oracle certification. Source: savour-test.log and SavourBackendTests.java.

## Slide 18: Invalid requests produce structured responses

GlobalExceptionHandler returns timestamp, status, error and message. Field-validation responses also contain an errors map. Demonstrate a duplicate email or repeated payment directly against the backend test environment. Oracle ORA codes differ from H2 errors. The frontend currently catches several backend failures and uses local state, so verify the network response and database state as well.

## Slide 19: A seven-minute demonstration follows one order

Keep an order ID visible. Show the backend response, then query FOOD_ORDER, ORDER_ITEM and PAYMENT. Use a permitted path: PLACED, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED. ACCEPTED and READY are additional allowed states in the service. Cancellation is allowed from several early states. The service rejects changes after DELIVERED or CANCELLED. For the price snapshot demonstration, modify the current menu price and retrieve the old order, then restore the demo price.

## Slide 20: The report ties requirements to evidence

The course requires Final PPT plus complete project report via VTOP, alongside a live demonstration and viva. This deck supports that submission but is not the separate project report. Existing docs include architecture.md, database-design.md, testing.md and phase2-demo-guide.md. Reconcile their table names and claims with the executable code before submitting. Do not submit passwords or sensitive environment values.

## Slide 21: Four gaps need evidence or implementation

Specific route mismatch: frontend toggleMenuItemAvailability sends PUT /restaurants/{restaurantId}/menu/{itemId}/availability, while the backend exposes PATCH /menu-items/{id}/availability with a JSON body. Reviews are available in the local store but no matching backend controller/table appears in the running schema. Add browser-to-database CRUD tests and a rollback test that fails after writes begin. These are completion tasks, not claims of completed features.

## Slide 22: The database choices have concrete reasons

Additional viva answers: A foreign key prevents an orphan record. A unique order_id in PAYMENT restricts each order to one payment row. The composite order-item primary key prevents duplicate lines for the same dish. Updates to menu prices must not alter agreed_unit_price. H2 compatibility mode helps local development but does not replace testing on Oracle.

## Slide 23: A working order flow with verifiable database rules

Closing pitch: SAVOUR demonstrates how database design supports the application journey. We can show server-calculated pricing, relational integrity and an atomic checkout. For final delivery, we will complete delete integration, verify the selected database deployment and ensure the UI and report reflect the same implementation. Invite questions and open the live application.
