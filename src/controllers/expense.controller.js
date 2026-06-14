"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalances = exports.createExpense = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createExpense = async (req, res) => {
    try {
        const { title, amount, groupId, paidById, splitType, } = req.body;
        const expense = await prisma_1.default.expense.create({
            data: {
                title,
                amount,
                groupId,
                paidById,
                splitType,
            },
        });
        const members = await prisma_1.default.groupMember.findMany({
            where: {
                groupId,
                leftAt: null,
            },
        });
        const shareAmount = Number(amount) / members.length;
        await prisma_1.default.expenseParticipant.createMany({
            data: members.map((member) => ({
                expenseId: expense.id,
                userId: member.userId,
                owedAmount: shareAmount,
            })),
        });
        return res.status(201).json({
            success: true,
            expense,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error?.message,
        });
    }
};
exports.createExpense = createExpense;
const getBalances = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const participants = await prisma_1.default.expenseParticipant.findMany({
            where: {
                expense: {
                    groupId,
                },
            },
            include: {
                expense: true,
            },
        });
        return res.json({
            success: true,
            participants,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error?.message,
        });
    }
};
exports.getBalances = getBalances;
