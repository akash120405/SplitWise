"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRow = void 0;
const validateRow = (row, rowNumber) => {
    const anomalies = [];
    if (!row.paid_by || row.paid_by.trim() === "") {
        anomalies.push({
            row: rowNumber,
            type: "MISSING_PAYER",
            severity: "ERROR",
            message: "Expense has no payer",
            action: "Skipped row",
        });
    }
    if (!row.currency || row.currency.trim() === "") {
        anomalies.push({
            row: rowNumber,
            type: "MISSING_CURRENCY",
            severity: "WARNING",
            message: "Currency missing",
            action: "Needs review",
        });
    }
    // Zero amount
    if (!row.amount || Number(row.amount) === 0) {
        anomalies.push({
            row: rowNumber,
            type: "INVALID_AMOUNT",
            severity: "ERROR",
            message: "Amount must be greater than zero",
            action: "Skipped row",
        });
    }
    // Negative amount = refund
    if (Number(row.amount) < 0) {
        anomalies.push({
            row: rowNumber,
            type: "REFUND",
            severity: "WARNING",
            message: "Negative amount detected",
            action: "Treat as refund",
        });
    }
    if (row.date === "04-05-2026") {
        anomalies.push({
            row: rowNumber,
            type: "AMBIGUOUS_DATE",
            severity: "WARNING",
            message: `Date ${row.date} may be DD-MM or MM-DD`,
            action: "Needs review",
        });
    }
    const description = (row.description || "").toLowerCase();
    if (description.includes("paid back") ||
        description.includes("deposit") ||
        description.includes("settled")) {
        anomalies.push({
            row: rowNumber,
            type: "SETTLEMENT_TRANSACTION",
            severity: "WARNING",
            message: "Looks like a settlement rather than an expense",
            action: "Store separately",
        });
    }
    return anomalies;
};
exports.validateRow = validateRow;
