import { Request, Response } from "express";

import { parseCsv } from "./import.service";
import { validateRow } from "./validators";
import { detectDuplicates } from "./detectDuplicates";

import { findOrCreateUser } from "./user.service";
import { getImportGroup } from "./group.service";
import { createExpense } from "./expense.service";
import { createParticipants } from "./participant.service";

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
      await findOrCreateUser(userName);
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

        console.log(
          "✅ Expense created:",
          expense.title
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

    const duplicates =
      detectDuplicates(rows);

    report.anomalies.push(
      ...duplicates
    );

    report.warnings +=
      duplicates.length;

    rows.forEach(
      (row, index) => {
        const rowAnomalies =
          validateRow(
            row,
            index + 1
          );

        report.anomalies.push(
          ...rowAnomalies
        );

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
    );

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