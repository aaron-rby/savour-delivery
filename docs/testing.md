# SAVOUR Food Delivery System — Quality Assurance & Testing Suite
## Course: BACSE202 Database Systems | Vellore Institute of Technology (VIT)

---

## 1. Testing Philosophy & Architecture

The testing strategy follows an **Automated Integration & Integrity Verification** approach. Rather than relying solely on mock objects, testing executes real SQL against the database engine to validate:
1. Transactional boundaries (`@Transactional` commits and rollbacks).
2. Schema constraints (Oracle `CHECK`, `UNIQUE`, `FOREIGN KEY` rules).
3. Business logic invariants (Price freezing, finite state machine transitions, single-restaurant isolation).

```
========================================================================================
Test Suite: com.savour.fooddelivery.SavourBackendTests
Engine: Spring Boot 3.3.4 Test Runner + JUnit 5 + Spring JDBC
Environment: In-Memory Oracle Compatibility Mode (H2) / Oracle 23ai
Status: 12 / 12 PASSED (0 FAILURES, 0 ERRORS)
Execution Command: mvn test
========================================================================================
```

---

## 2. Integration Test Matrix (12 Critical Scenarios)

| # | Test Method Name | Target Invariant | Expected Behavior | Result |
| :---: | :--- | :--- | :--- | :---: |
| 1 | `contextLoads()` | Spring Context & HikariCP Pool | Verifies datasource initialization, schema loading, and pool health. | **PASS** |
| 2 | `testCreateOrder_Successful()` | ACID Transactional Commit | Inserts records across `ORDERS`, `ORDER_ITEMS`, and `PAYMENTS` atomically. | **PASS** |
| 3 | `testPriceFreezing()` | Historical Price Snapshotting | Confirms updating `MENU_ITEMS.price` does not alter `ORDER_ITEMS.agreed_unit_price`. | **PASS** |
| 4 | `testSingleRestaurantEnforcement()` | Domain Isolation | Rejects an order containing dishes originating from multiple distinct restaurants. | **PASS** |
| 5 | `testValidStatusTransitions()` | Finite State Machine Flow | Validates progressive transition: `PLACED -> CONFIRMED -> PREPARING -> OUT_FOR_DELIVERY -> DELIVERED`. | **PASS** |
| 6 | `testIllegalStatusSkip()` | State Machine Guard | Rejects illegal transition skips (e.g. attempting to jump directly from `PLACED -> DELIVERED`). | **PASS** |
| 7 | `testCancelOrder_Allowed()` | Cancellation Window | Permits order cancellation while status is `PLACED` or `CONFIRMED`. | **PASS** |
| 8 | `testCancelOrder_Forbidden()` | Cancellation Boundary | Rejects cancellation when status has reached `PREPARING`, `OUT_FOR_DELIVERY`, or `DELIVERED`. | **PASS** |
| 9 | `testUniqueEmailConstraint()` | Oracle `ORA-00001` Emulation | Confirms duplicate email insertion in `USERS` throws `DataIntegrityViolationException`. | **PASS** |
| 10 | `testCheckConstraintRating()` | Oracle `ORA-02290` Emulation | Confirms review rating $> 5$ or $< 1$ throws `DataIntegrityViolationException`. | **PASS** |
| 11 | `testForeignKeyParentMissing()` | Oracle `ORA-02291` Emulation | Confirms inserting `ORDER_ITEMS` with non-existent `order_id` is rejected. | **PASS** |
| 12 | `testForeignKeyChildRecordRestrict()` | Oracle `ORA-02292` Emulation | Confirms deleting an active customer with historical orders is blocked. | **PASS** |

---

## 3. How to Execute Tests

### Backend Test Execution
From the project root:
```bash
cd backend
mvn test
```

Expected output:
```
[INFO] Running com.savour.fooddelivery.SavourBackendTests
[INFO] Tests run: 12, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.842 s
[INFO] BUILD SUCCESS
```

### Frontend Compilation & Build Check
From the project root:
```bash
cd frontend
npm run build
```

Expected output:
```
✓ Compiled successfully in 262ms
✓ Finished TypeScript in 817ms
✓ Collecting page data using 7 workers
✓ Generating static pages (12/12)
```

---

## 4. Constraint Violation Verification via Admin UI

In addition to programmatic tests, the application provides an interactive **Constraint Violation Simulator** at `/admin`:
1. Navigate to `http://localhost:3000/admin`.
2. Click on any of the 4 interactive test scenarios:
   - **Test 1**: Duplicate Email (`ORA-00001`)
   - **Test 2**: Rating Out-of-Bounds (`ORA-02290`)
   - **Test 3**: Missing Parent Order (`ORA-02291`)
   - **Test 4**: Restrict Child Record Deletion (`ORA-02292`)
3. View the rendered SQL statement, caught Oracle exception code, and architectural explanation in real-time.
