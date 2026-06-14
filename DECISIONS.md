# DECISIONS.md

## Decision 1: Use PostgreSQL

### Options Considered

1. PostgreSQL
2. MySQL
3. MongoDB

### Chosen

PostgreSQL

### Reason

The project requires a strongly relational data model with users, groups, expenses, participants, settlements, and anomalies.

---

## Decision 2: Use Prisma ORM

### Options Considered

1. Raw SQL
2. Sequelize
3. Prisma

### Chosen

Prisma

### Reason

Provides type safety, schema management, migrations, and easier database access from TypeScript.

---

## Decision 3: Use JWT Authentication

### Options Considered

1. Session-based authentication
2. JWT

### Chosen

JWT

### Reason

Stateless authentication simplifies API development and deployment.

---

## Decision 4: Store Anomalies in Database

### Options Considered

1. Log anomalies only
2. Store anomalies in database

### Chosen

Store anomalies

### Reason

Allows later review, reporting, and auditing.

---

## Decision 5: Automatically Create Users During Import

### Options Considered

1. Reject unknown users
2. Automatically create users

### Chosen

Automatically create users

### Reason

CSV imports may contain participants who do not yet exist in the system.

---

## Decision 6: Automatically Create Group Memberships

### Options Considered

1. Manual membership creation
2. Automatic membership creation

### Chosen

Automatic membership creation

### Reason

Reduces manual work and ensures imported expenses can be linked immediately.

---

## Decision 7: Skip Expenses With Missing Payer

### Options Considered

1. Import anyway
2. Skip row

### Chosen

Skip row

### Reason

An expense without a payer cannot be balanced correctly.

---

## Decision 8: Import Refunds but Flag Them

### Options Considered

1. Reject refunds
2. Import and flag

### Chosen

Import and flag

### Reason

Refunds may represent valid financial events.

---

## Decision 9: Import Potential Duplicates but Flag Them

### Options Considered

1. Reject duplicates
2. Import and flag

### Chosen

Import and flag

### Reason

Duplicate detection is heuristic and cannot be trusted fully.

---

## Decision 10: Generate Settlements Using Greedy Matching

### Options Considered

1. Pairwise debt settlement
2. Greedy creditor-debtor matching

### Chosen

Greedy matching

### Reason

Produces a small number of transactions and is easy to explain and maintain.

---

## Decision 11: Use ExpenseParticipant Table

### Options Considered

1. Store splits inside Expense
2. Separate participant table

### Chosen

ExpenseParticipant table

### Reason

Supports multiple participants per expense and simplifies balance calculations.

---

## Decision 12: Keep Ambiguous Dates as Warnings

### Options Considered

1. Reject ambiguous dates
2. Import and flag

### Chosen

Import and flag

### Reason

There is insufficient information to determine the correct format automatically.
