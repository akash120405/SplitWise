"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSettlements = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const balance_service_1 = require("./balance.service");
const generateSettlements = async (groupId) => {
    const balances = await (0, balance_service_1.calculateGroupBalances)(groupId);
    // Clear old settlements
    await prisma_1.default.settlement.deleteMany();
    const creditors = [];
    const debtors = [];
    Object.entries(balances).forEach(([userId, balance]) => {
        if (balance > 0.01) {
            creditors.push({
                userId,
                amount: Number(balance),
            });
        }
        else if (balance < -0.01) {
            debtors.push({
                userId,
                amount: Math.abs(Number(balance)),
            });
        }
    });
    const settlements = [];
    let i = 0;
    let j = 0;
    while (i < debtors.length &&
        j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];
        const amount = Math.min(debtor.amount, creditor.amount);
        const settlement = await prisma_1.default.settlement.create({
            data: {
                payerId: debtor.userId,
                receiverId: creditor.userId,
                amount: Number(amount.toFixed(2)),
            },
        });
        settlements.push(settlement);
        debtor.amount = Number((debtor.amount - amount).toFixed(2));
        creditor.amount = Number((creditor.amount - amount).toFixed(2));
        if (debtor.amount < 0.01) {
            i++;
        }
        if (creditor.amount < 0.01) {
            j++;
        }
    }
    return settlements;
};
exports.generateSettlements = generateSettlements;
