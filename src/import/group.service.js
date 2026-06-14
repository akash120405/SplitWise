"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImportGroup = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getImportGroup = async () => {
    let group = await prisma_1.default.group.findFirst({
        where: {
            name: "Imported CSV Group",
        },
    });
    if (!group) {
        group = await prisma_1.default.group.create({
            data: {
                name: "Imported CSV Group",
            },
        });
    }
    return group;
};
exports.getImportGroup = getImportGroup;
