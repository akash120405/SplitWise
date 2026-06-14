import { Request, Response } from "express";
import { generateSettlements } from "../services/settlement.service";

export const getSettlements = async (
  req: Request,
  res: Response
) => {
  try {
    const { groupId } = req.params;

    const settlements =
      await generateSettlements(groupId);

    return res.json({
      success: true,
      settlements,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate settlements",
    });
  }
};