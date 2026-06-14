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

  if (!row.amount || Number(row.amount) <= 0) {
    anomalies.push({
      row: rowNumber,
      type: "INVALID_AMOUNT",
      severity: "ERROR",
      message: "Amount must be greater than zero",
      action: "Skipped row",
    });
  }

  return anomalies;
};