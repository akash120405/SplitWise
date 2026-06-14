import { Request, Response } from "express";
import { parseCsv } from "./import.service";
import { validateRow } from "./validators";
import { detectDuplicates } from "./detectDuplicates";

console.log("validateRow =", validateRow);
export const uploadCsv = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const rows = await parseCsv(req.file.path);

   const report = {
  processed: rows.length,
  imported: 0,
  warnings: 0,
  errors: 0,
  anomalies: [] as any[],
};
const duplicates = detectDuplicates(rows);

report.anomalies.push(...duplicates);
report.warnings += duplicates.length;

rows.forEach((row, index) => {
  const rowAnomalies = validateRow(row, index + 1);

  report.anomalies.push(...rowAnomalies);

  rowAnomalies.forEach((anomaly) => {
    if (anomaly.severity === "ERROR") {
      report.errors++;
    } else {
      report.warnings++;
    }
  });

  if (rowAnomalies.length === 0) {
    report.imported++;
  }
});

return res.status(200).json({
  success: true,
  report,
});
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Import failed",
    });
  }
};