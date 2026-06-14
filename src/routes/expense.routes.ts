import { Router } from "express";

import {
  createExpense,
  getBalances,
} from "../controllers/expense.controller";

import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/", protect, createExpense);

router.get(
  "/balances/:groupId",
  protect,
  getBalances
);

export default router;