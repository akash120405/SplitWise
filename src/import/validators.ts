export const validateRow = (
  row: any,
  rowNumber: number
) => {
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
  if (
  row.date &&
  /^\d{2}-\d{2}-\d{4}$/.test(row.date)
) {
  const [first, second] = row.date.split("-");

  if (
    Number(first) <= 12 &&
    Number(second) <= 12
  ) {
    anomalies.push({
      row: rowNumber,
      type: "AMBIGUOUS_DATE",
      severity: "WARNING",
      message: `Date ${row.date} may be DD-MM or MM-DD`,
      action: "Needs review",
    });
  }
}

  return anomalies;
};