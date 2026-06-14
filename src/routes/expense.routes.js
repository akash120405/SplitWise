"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expense_controller_1 = require("../controllers/expense.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/", auth_middleware_1.protect, expense_controller_1.createExpense);
router.get("/balances/:groupId", auth_middleware_1.protect, expense_controller_1.getBalances);
exports.default = router;
