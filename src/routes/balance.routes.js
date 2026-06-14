"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const balance_controller_1 = require("../controllers/balance.controller");
const router = express_1.default.Router();
router.get("/:groupId/balances", balance_controller_1.getBalances);
exports.default = router;
