"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettlements = void 0;
const settlement_service_1 = require("../services/settlement.service");
const getSettlements = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const settlements = await (0, settlement_service_1.generateSettlements)(groupId);
        return res.json({
            success: true,
            settlements,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate settlements",
        });
    }
};
exports.getSettlements = getSettlements;
