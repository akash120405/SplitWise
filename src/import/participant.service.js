"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParticipants = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createParticipants = async (expenseId, splitWith, amount) => {
    const participants = splitWith
        .split(";")
        .map((name) => name.trim());
    const share = amount /
        participants.length;
    for (const participantName of participants) {
        const email = `${participantName.toLowerCase()}@import.local`;
        const user = await prisma_1.default.user.findUnique({
            where: {
                email,
            },
        });
        if (!user)
            continue;
        await prisma_1.default.expenseParticipant.create({
            data: {
                expenseId,
                userId: user.id,
                owedAmount: share,
            },
        });
    }
};
exports.createParticipants = createParticipants;
