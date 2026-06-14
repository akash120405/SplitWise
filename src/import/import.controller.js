"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCsv = void 0;
const import_service_1 = require("./import.service");
const validators_1 = require("./validators");
const detectDuplicates_1 = require("./detectDuplicates");
const user_service_1 = require("./user.service");
const group_service_1 = require("./group.service");
const expense_service_1 = require("./expense.service");
const participant_service_1 = require("./participant.service");
const anomaly_service_1 = require("./anomaly.service");
const groupMember_service_1 = require("./groupMember.service");
const uploadCsv = async (req, res) => {
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
        const rows = await (0, import_service_1.parseCsv)(req.file.path);
        const importGroup = await (0, group_service_1.getImportGroup)();
        // ----------------------------
        // Create Users
        // ----------------------------
        const users = new Set();
        rows.forEach((row) => {
            if (row.paid_by) {
                users.add(row.paid_by.trim());
            }
            if (row.split_with) {
                row.split_with
                    .split(";")
                    .forEach((name) => {
                    users.add(name.trim());
                });
            }
        });
        for (const userName of users) {
            const user = await (0, user_service_1.findOrCreateUser)(userName);
            await (0, groupMember_service_1.addUserToGroup)(user.id, importGroup.id);
        }
        // ----------------------------
        // Create Expenses + Participants
        // ----------------------------
        let expensesCreated = 0;
        for (const row of rows) {
            const rowAnomalies = (0, validators_1.validateRow)(row, 0);
            const hasError = rowAnomalies.some((a) => a.severity === "ERROR");
            if (hasError) {
                continue;
            }
            try {
                const payer = await (0, user_service_1.findOrCreateUser)(row.paid_by);
                const expense = await (0, expense_service_1.createExpense)(row, payer.id, importGroup.id);
                const amount = Number(String(row.amount).replace(/,/g, ""));
                await (0, participant_service_1.createParticipants)(expense.id, row.split_with, amount);
                expensesCreated++;
            }
            catch (err) {
                console.error("❌ Failed expense:", row.description);
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
            anomalies: [],
        };
        // Duplicate Detection
        const duplicates = (0, detectDuplicates_1.detectDuplicates)(rows);
        report.anomalies.push(...duplicates);
        report.warnings +=
            duplicates.length;
        for (const anomaly of duplicates) {
            await (0, anomaly_service_1.saveAnomaly)(anomaly);
        }
        // Row Validation
        for (let index = 0; index < rows.length; index++) {
            const row = rows[index];
            const rowAnomalies = (0, validators_1.validateRow)(row, index + 1);
            report.anomalies.push(...rowAnomalies);
            for (const anomaly of rowAnomalies) {
                await (0, anomaly_service_1.saveAnomaly)(anomaly);
            }
            rowAnomalies.forEach((anomaly) => {
                if (anomaly.severity ===
                    "ERROR") {
                    report.errors++;
                }
                else {
                    report.warnings++;
                }
            });
            const hasError = rowAnomalies.some((a) => a.severity ===
                "ERROR");
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Import failed",
        });
    }
};
exports.uploadCsv = uploadCsv;
