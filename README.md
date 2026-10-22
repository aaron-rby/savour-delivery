# SAVOUR: Food Delivery System

BACSE202 Database Systems course project. Next.js frontend, Spring Boot backend,
SQL repositories through Spring JDBC, and an embedded H2 development database.

## Run on your own laptop

Install these first and reopen your terminal:

- Git
- Java JDK **21 or newer** (`java -version`)
- Maven **3.8 or newer** (`mvn -version`)
- Node.js **22 or newer** and npm (`node --version`, `npm --version`)

Set `JAVA_HOME` to your JDK directory if Maven cannot find Java.
The convenience `backend/mvnw` uses installed Maven and does not download it.

```text
git clone https://github.com/aaron-rby/savour-delivery.git
cd savour-delivery
```

### Windows PowerShell

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\start.ps1
```

This installs frontend dependencies on first use and opens two server terminals.
Wait for the backend's `Started SavourApplication` and frontend's `Ready` messages.
Stop with Ctrl+C in each server terminal. The execution-policy option applies
only to this PowerShell process.

### macOS or Linux

```bash
bash start.sh
```

Both server logs appear in the terminal. Press Ctrl+C to stop.

### Local links

- Application: **http://localhost:3000**
- Backend: **http://localhost:8081/api/health**
- Database connectivity: **http://localhost:8081/api/health/db**

**Localhost means the laptop opening the link.** Your friends must run the app
on their laptops before opening these links. GitHub distributes the source code
and does not host the Java backend. A remote shared app needs a separate
deployment or tunnel. Each laptop has its own independent demo database.

## Manual startup

In the first Windows terminal:

```powershell
cd backend
$env:SERVER_PORT='8081'
$env:APP_PROFILE='dev'
mvn spring-boot:run
```

In the second Windows terminal:

```powershell
cd frontend
$env:NEXT_PUBLIC_API_URL='http://localhost:8081/api'
npm ci
npm run dev
```

On macOS/Linux use `export SERVER_PORT=8081 APP_PROFILE=dev` and
`export NEXT_PUBLIC_API_URL=http://localhost:8081/api` instead of `$env:...`.
Use available ports if 3000 or 8081 is occupied, and change the frontend API URL
to match. Default CORS permits localhost:3000 and 127.0.0.1:3000.
Internet access is required for the first dependency installation.

## Database and course evidence

The dev profile initializes these nine tables from
`backend/src/main/resources/schema.sql` and `data.sql`:

`APP_USER`, `CUSTOMER`, `DELIVERY_PARTNER`, `RESTAURANT`, `MENU_ITEM`,
`FOOD_ORDER`, `ORDER_ITEM`, `PAYMENT`, `DELIVERY`.

- Primary/foreign keys, unique email/payment constraints and numeric checks.
- Composite `ORDER_ITEM(order_id, item_id)` primary key.
- Server validation for availability, positive quantity and single-restaurant orders.
- Frozen `agreed_unit_price` and server-calculated Rs 50 delivery fee.
- Transactional order header, order lines and payment insertion.

The database is **in memory**. Restarting the backend resets it to seed data.
H2 Oracle compatibility mode is not an Oracle server. Some UI badges and legacy
documentation still say Oracle, so identify the engine from datasource
configuration. The health endpoint's engine label alone is not Oracle evidence.

## Tests

```text
cd backend
mvn test
```

Verified on 22 October 2026: **12 tests, 0 failures, 0 errors, 0 skipped**
on Windows with Java 26 and Maven 3.9.9 using the H2 test profile.
This does not establish browser end-to-end coverage or Oracle compatibility.

## Presentation

`presentation/` contains the Phase 2/3 pitch and speaking script.
The PDF course overview is included at the repository root.

## Current limitations

- No backend delete endpoint, so complete application CRUD still needs work.
- Some frontend API failures fall back to a local browser store. Confirm writes
  through the API/database when demonstrating JDBC integration.
- The frontend availability update route differs from the backend PATCH route.
- Reviews and several display fields are local/demo features, not in the current
  JDBC schema. Payments are demo records, not real gateway transactions.
- Persona switching is for demonstrations, not production authentication.
- Legacy `docs/` and `database/` files may describe an earlier schema. Use
  `backend/src/main/resources/` as the running dev application's source of truth.

## Optional Oracle setup

The Oracle JDBC driver is included. Provision Oracle, apply compatible schema
and seed scripts, set `APP_PROFILE=oracle`, `ORACLE_URL`, `ORACLE_USER` and
`ORACLE_PASSWORD`, then verify CRUD against that database. The dev DDL has
H2-specific drop syntax and should not be run unchanged on Oracle.
Do not commit real credentials. The `.env.example` documents environment
variables; Spring Boot does not automatically load that file.
