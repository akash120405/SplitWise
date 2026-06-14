import express from "express";
import { getBalances } from "../controllers/balance.controller";

const router = express.Router();

router.get(
  "/:groupId/balances",
  getBalances
);

export default router;