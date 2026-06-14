export const detectDuplicates = (rows: any[]) => {
  const duplicates: any[] = [];
  const seen = new Map();

  rows.forEach((row, index) => {
    const key = `${row.date}-${row.amount}-${row.paid_by}`.toLowerCase();

    if (seen.has(key)) {
      duplicates.push({
        row: index + 1,
        type: "POTENTIAL_DUPLICATE",
        severity: "WARNING",
        message: "Possible duplicate expense",
        action: "Manual review",
      });
    } else {
      seen.set(key, true);
    }
  });

  return duplicates;
};