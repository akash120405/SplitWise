import { Request, Response } from "express";

import { parseCsv } from "./import.service";
import { validateRow } from "./validators";
import { detectDuplicates } from "./detectDuplicates";

import { findOrCreateUser } from "./user.service";
import { getImportGroup } from "./group.service";
import { createExpense } from "./expense.service";
import { createParticipants } from "./participant.service";
import { saveAnomaly } from "./anomaly.service";
import { addUserToGroup }
from "./groupMember.service";
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

    // ----------------------------
    // Parse CSV
    // ----------------------------

    const rows = await parseCsv(req.file.path);

    const importGroup =
      await getImportGroup();

    // ----------------------------
    // Create Users
    // ----------------------------

    const users = new Set<string>();

    rows.forEach((row) => {
      if (row.paid_by) {
        users.add(row.paid_by.trim());
      }

      if (row.split_with) {
        row.split_with
          .split(";")
          .forEach((name: string) => {
            users.add(name.trim());
          });
      }
    });

    for (const userName of users) {
  const user =
    await findOrCreateUser(userName);

  await addUserToGroup(
    user.id,
    importGroup.id
  );
}

    // ----------------------------
    // Create Expenses + Participants
    // ----------------------------

    let expensesCreated = 0;

    for (const row of rows) {
      const rowAnomalies = validateRow(
        row,
        0
      );

      const hasError =
        rowAnomalies.some(
          (a) => a.severity === "ERROR"
        );

      if (hasError) {
        continue;
      }

      try {
        const payer =
          await findOrCreateUser(
            row.paid_by
          );

        const expense =
          await createExpense(
            row,
            payer.id,
            importGroup.id
          );

        const amount = Number(
          String(row.amount).replace(
            /,/g,
            ""
          )
        );

        await createParticipants(
          expense.id,
          row.split_with,
          amount
        );

        expensesCreated++;
      } catch (err) {
        console.error(
          "❌ Failed expense:",
          row.description
        );

        console.error(err);
      }
    }

    // ----------------------------
    // Build Report
    // ----------------------------

    const report = {
      processed: rows.length,
      imported: 0,
      warnings: 0,
      errors: 0,
      anomalies: [] as any[],
    };

    // Duplicate Detection

    const duplicates =
      detectDuplicates(rows);

    report.anomalies.push(
      ...duplicates
    );

    report.warnings +=
      duplicates.length;

    for (const anomaly of duplicates) {
      await saveAnomaly(anomaly);
    }

    // Row Validation

    for (
      let index = 0;
      index < rows.length;
      index++
    ) {
      const row = rows[index];

      const rowAnomalies =
        validateRow(
          row,
          index + 1
        );

      report.anomalies.push(
        ...rowAnomalies
      );

      for (const anomaly of rowAnomalies) {
        await saveAnomaly(anomaly);
      }

      rowAnomalies.forEach(
        (anomaly) => {
          if (
            anomaly.severity ===
            "ERROR"
          ) {
            report.errors++;
          } else {
            report.warnings++;
          }
        }
      );

      const hasError =
        rowAnomalies.some(
          (a) =>
            a.severity ===
            "ERROR"
        );

      if (!hasError) {
        report.imported++;
      }
    }

    return res.status(200).json({
      success: true,
      usersImported: users.size,
      expensesCreated,
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