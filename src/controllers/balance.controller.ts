import { Request, Response } from "express";
import { calculateGroupBalances } from "../services/balance.service";

export const getBalances = async (
  req: Request,
  res: Response
) => {
  try {
    const { groupId } = req.params;

    const balances =
      await calculateGroupBalances(groupId);

    return res.status(200).json({
      success: true,
      balances,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to calculate balances",
    });
  }
};