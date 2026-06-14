"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settlement_controller_1 = require("../controllers/settlement.controller");
const router = (0, express_1.Router)();
router.get("/:groupId/settlements", settlement_controller_1.getSettlements);
exports.default = router;
