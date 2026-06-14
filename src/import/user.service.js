"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrCreateUser = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const findOrCreateUser = async (name) => {
    const cleanName = name.trim();
    const email = `${cleanName.toLowerCase()}@import.local`;
    let user = await prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        user = await prisma_1.default.user.create({
            data: {
                name: cleanName,
                email,
                password: "imported-user",
            },
        });
    }
    return user;
};
exports.findOrCreateUser = findOrCreateUser;
