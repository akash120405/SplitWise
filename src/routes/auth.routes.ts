import { Router } from "express";

import {
  createGroup,
  addMember,
  leaveGroup,
} from "../controllers/group.controller";

import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/", protect, createGroup);

router.post(
  "/:groupId/members",
  protect,
  addMember
);

router.patch(
  "/:groupId/members/:userId/leave",
  protect,
  leaveGroup
);

export default router;