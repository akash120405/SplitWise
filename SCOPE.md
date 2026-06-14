# SCOPE.md

## Project Scope

This project implements a Splitwise-style expense management backend capable of importing expense data from CSV files, detecting anomalies, calculating balances, and generating settlement recommendations.

---

# Database Schema

## User

Stores registered users.

Fields:

* id
* name
* email
* password
* createdAt
* updatedAt

---

## Group

Stores expense groups.

Fields:

* id
* name
* createdAt
* updatedAt

---

## GroupMember

Tracks group membership over time.

Fields:

* id
* groupId
* userId
* joinedAt
* leftAt
* isActive

---

## Expense

Stores imported expenses.

Fields:

* id
* title
* amount
* splitType
* groupId
* paidById
* createdAt
* updatedAt

---

## ExpenseParticipant

Stores how much each participant owes for an expense.

Fields:

* id
* expenseId
* userId
* owedAmount

---

## Settlement

Stores settlement recommendations and recorded settlements.

Fields:

* id
* payerId
* receiverId
* amount
* createdAt

---

## Anomaly

Stores anomalies detected during CSV import.

Fields:

* id
* expenseId
* type
* severity
* description
* actionTaken
* createdAt

---

# Anomaly Detection Strategy

The CSV import process validates every row and records anomalies.

---

## MISSING_PAYER

Problem:

Expense row has no payer.

Example:

```text
paid_by = ""
```

Action Taken:

* Mark as ERROR
* Skip expense import

Reason:

A valid expense must have a payer.

---

## MISSING_CURRENCY

Problem:

Currency field is empty.

Example:

```text
currency = ""
```

Action Taken:

* Mark as WARNING
* Import expense
* Flag for manual review

Reason:

Currency can sometimes be inferred later.

---

## INVALID_AMOUNT

Problem:

Amount is zero or invalid.

Example:

```text
amount = 0
```

Action Taken:

* Mark as ERROR
* Skip expense import

Reason:

Expenses must have a positive amount.

---

## REFUND

Problem:

Negative amount detected.

Example:

```text
amount = -300
```

Action Taken:

* Mark as WARNING
* Import expense
* Record anomaly

Reason:

Negative values often represent refunds.

---

## POTENTIAL_DUPLICATE

Problem:

Multiple expenses appear identical.

Detection:

Same payer + amount + description.

Action Taken:

* Mark as WARNING
* Import expense
* Flag for review

Reason:

Duplicates may be intentional or accidental.

---

## AMBIGUOUS_DATE

Problem:

Date format may be interpreted in multiple ways.

Example:

```text
04-05-2026
```

Could mean:

```text
DD-MM-YYYY
```

or

```text
MM-DD-YYYY
```

Action Taken:

* Mark as WARNING
* Import expense
* Flag for review

Reason:

Insufficient information to determine exact format.

---

## SETTLEMENT_TRANSACTION

Problem:

Expense description appears to represent debt settlement rather than a new expense.

Detection Keywords:

* paid back
* deposit
* settled

Action Taken:

* Mark as WARNING
* Import expense
* Store anomaly

Reason:

Settlement records should be reviewed separately.

---

# Import Assumptions

The following assumptions were used:

1. Missing payer is considered a fatal error.
2. Missing currency is allowed but flagged.
3. Duplicate expenses are imported but flagged.
4. Refunds are imported but flagged.
5. Settlement-like transactions are imported but flagged.
6. Equal split is used when participant information is available.
7. Users are automatically created if they do not already exist.
8. Group members are automatically added during import.

---

# Import Workflow

CSV Upload

→ Parse Rows

→ Validate Rows

→ Detect Anomalies

→ Create Users

→ Create Group Members

→ Create Expenses

→ Create Expense Participants

→ Calculate Balances

→ Generate Settlements

→ Store Anomalies

→ Generate Import Report

---

# Known Limitations

1. Ambiguous dates require manual review.
2. Duplicate detection is heuristic-based.
3. Settlement detection is keyword-based.
4. Refund handling may require business-specific rules.
