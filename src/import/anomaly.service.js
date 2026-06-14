"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAnomaly = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const saveAnomaly = async (anomaly) => {
    return prisma_1.default.anomaly.create({
        data: {
            type: anomaly.type,
            severity: anomaly.severity,
            description: anomaly.message,
            actionTaken: anomaly.action,
        },
    });
};
exports.saveAnomaly = saveAnomaly;
