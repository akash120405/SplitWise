import { Router } from "express";

import {
  createGroup,
  addMember,
  leaveGroup,
  getGroupMembers,
} from "../controllers/group.controller";

import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/", protect, createGroup);

router.post(
  "/:groupId/members",
  protect,
  addMember
);

router.get(
  "/:groupId/members",
  protect,
  getGroupMembers
);

router.patch(
  "/:groupId/members/:userId/leave",
  protect,
  leaveGroup
);

export default router;