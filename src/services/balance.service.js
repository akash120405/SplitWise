"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateGroupBalances = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const calculateGroupBalances = async (groupId) => {
    const expenses = await prisma_1.default.expense.findMany({
        where: { groupId },
        include: {
            participants: true,
        },
    });
    const balances = {};
    for (const expense of expenses) {
        const amount = Number(expense.amount);
        balances[expense.paidById] =
            (balances[expense.paidById] || 0) + amount;
        for (const participant of expense.participants) {
            balances[participant.userId] =
                (balances[participant.userId] || 0) -
                    Number(participant.owedAmount);
        }
    }
    return balances;
};
exports.calculateGroupBalances = calculateGroupBalances;
