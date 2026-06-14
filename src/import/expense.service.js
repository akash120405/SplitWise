"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExpense = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createExpense = async (row, payerId, groupId) => {
    const amount = Number(String(row.amount).replace(/,/g, ""));
    return prisma_1.default.expense.create({
        data: {
            title: row.description,
            amount,
            splitType: "EQUAL",
            paidBy: {
                connect: {
                    id: payerId,
                },
            },
            group: {
                connect: {
                    id: groupId,
                },
            },
        },
    });
};
exports.createExpense = createExpense;
