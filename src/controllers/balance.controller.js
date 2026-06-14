"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalances = void 0;
const balance_service_1 = require("../services/balance.service");
const getBalances = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const balances = await (0, balance_service_1.calculateGroupBalances)(groupId);
        return res.status(200).json({
            success: true,
            balances,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to calculate balances",
        });
    }
};
exports.getBalances = getBalances;
