import { Router } from "express";
import { getSettlements } from "../controllers/settlement.controller";

const router = Router();

router.get(
  "/:groupId/settlements",
  getSettlements
);

export default router;