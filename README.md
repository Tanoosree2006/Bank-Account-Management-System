# 🏦 Bank Account Management System

### Event Sourcing + CQRS Architecture

---

## 📌 Project Overview

This project implements a **Bank Account Management System API** using advanced backend architectural patterns:

* **Event Sourcing**
* **Command Query Responsibility Segregation (CQRS)**

Instead of storing only the current state, the system stores a **complete history of events**, enabling:

* Full auditability
* Historical state reconstruction (time-travel queries)
* High scalability
* Better debugging and traceability

---

## 🧠 Core Concepts

### 🔹 Event Sourcing

All state changes are stored as **immutable events**.

Example:

* Account creation
* Deposits
* Withdrawals
* Account closure

👉 The current state is **derived by replaying events**

---

### 🔹 CQRS (Command Query Responsibility Segregation)

| Side                | Responsibility                           |
| ------------------- | ---------------------------------------- |
| **Command (Write)** | Handles state changes → generates events |
| **Query (Read)**    | Fetches data from optimized projections  |

👉 Improves performance and scalability

---

## ⚙️ Tech Stack

| Layer            | Technology              |
| ---------------- | ----------------------- |
| Backend          | Node.js (Express)       |
| Database         | PostgreSQL              |
| Containerization | Docker & Docker Compose |

---

## 🏗️ System Architecture

```id="arch1"
Client → API → Command Handlers → Event Store (PostgreSQL)
                               ↓
                         Projections (Read Models)
                               ↓
                           Query APIs
```

---

## 📁 Project Structure

```id="arch2"
bank-system/
│
├── src/
│   ├── commands/        # Business logic (write side)
│   ├── events/          # Event store logic
│   ├── projections/     # Read model builders
│   ├── queries/         # Read operations
│   ├── routes/          # API endpoints
│   ├── snapshot/        # Snapshot optimization
│   ├── utils/           # Helper functions
│   ├── app.js           # Entry point
│   └── db.js            # Database connection
│
├── seeds/               # SQL schema
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── submission.json
└── README.md
```

---

## 🗄️ Database Design

### 🔹 Events Table (Event Store)

Stores all events:

* `event_id`
* `aggregate_id`
* `event_type`
* `event_data`
* `event_number`
* `timestamp`

---

### 🔹 Snapshots Table

Stores periodic snapshots to optimize performance.

---

### 🔹 account_summaries (Read Model)

* Current balance
* Account status
* Owner details

---

### 🔹 transaction_history (Read Model)

* Deposit & withdrawal history

---

## 🚀 Getting Started

### 1️⃣ Clone Repository

```id="step1"
git clone <your-repo-link>
cd bank-system
```

---

### 2️⃣ Setup Environment

Create `.env` file:

```id="step2"
API_PORT=8080
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=bank_db
DATABASE_URL=postgresql://postgres:postgres@db:5432/bank_db
```

---

### 3️⃣ Run Application

```id="step3"
docker-compose up --build
```

---

### 4️⃣ Verify System

```id="step4"
curl http://localhost:8080/health
```

---

## 📡 API Endpoints

### 🔹 Create Account

```id="api1"
POST /api/accounts
```

---

### 🔹 Deposit Money

```id="api2"
POST /api/accounts/{id}/deposit
```

---

### 🔹 Withdraw Money

```id="api3"
POST /api/accounts/{id}/withdraw
```

---

### 🔹 Close Account

```id="api4"
POST /api/accounts/{id}/close
```

---

### 🔹 Get Account

```id="api5"
GET /api/accounts/{id}
```

---

### 🔹 Get Transactions

```id="api6"
GET /api/accounts/{id}/transactions
```

---

### 🔹 Get Events

```id="api7"
GET /api/accounts/{id}/events
```

---

### 🔹 Time Travel Query

```id="api8"
GET /api/accounts/{id}/balance-at/{timestamp}
```

---

### 🔹 Projection Status

```id="api9"
GET /api/projections/status
```

---

### 🔹 Rebuild Projections

```id="api10"
POST /api/projections/rebuild
```

---

## 🧪 Example Workflow

1. Create account
2. Deposit money
3. Withdraw money
4. Check balance
5. View transaction history
6. Query past balance using time-travel

---

## ⏳ Time Travel Feature

The system allows querying balance at any point in time:

```id="example1"
GET /api/accounts/acc-1/balance-at/2026-04-16T06:05:21.000Z
```

👉 Uses event replay to reconstruct historical state

---

## ⚡ Snapshot Optimization

* Snapshot created every **50 events**
* Reduces replay time
* Improves performance

---

## 🔁 Projection Rebuild

If projections become inconsistent:

```id="example2"
POST /api/projections/rebuild
```

👉 Rebuilds read models from event store

---

## 🛡️ Error Handling

| Status Code | Meaning                 |
| ----------- | ----------------------- |
| 400         | Invalid request         |
| 404         | Not found               |
| 409         | Business rule violation |

---

## 💡 Key Features

* ✅ Immutable event store
* ✅ CQRS architecture
* ✅ Time-travel queries
* ✅ Snapshot optimization
* ✅ Idempotent transactions
* ✅ Projection rebuild support
* ✅ Dockerized deployment

---

## 🧠 What This Project Demonstrates

* Advanced backend architecture
* Event-driven systems
* Distributed system design
* Data consistency handling
* Real-world financial system design

---

## 📦 Submission Checklist

✔ docker-compose.yml
✔ Dockerfile
✔ .env.example
✔ submission.json
✔ Source code
✔ README.md

---

## 🎯 Conclusion

This project showcases a **production-level backend system** built with modern design patterns used in:

* FinTech systems
* Distributed applications
* Event-driven architectures

---

## 👨‍💻 Author

Your Name
