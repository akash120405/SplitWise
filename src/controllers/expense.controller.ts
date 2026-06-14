import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createExpense = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      title,
      amount,
      groupId,
      paidById,
      splitType,
    } = req.body;

    const expense = await prisma.expense.create({
      data: {
        title,
        amount,
        groupId,
        paidById,
        splitType,
      },
    });

    const members = await prisma.groupMember.findMany({
      where: {
        groupId,
        leftAt: null,
      },
    });

    const shareAmount =
      Number(amount) / members.length;

    await prisma.expenseParticipant.createMany({
      data: members.map((member) => ({
        expenseId: expense.id,
        userId: member.userId,
        owedAmount: shareAmount,
      })),
    });

    return res.status(201).json({
      success: true,
      expense,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error?.message,
    });
  }
};

export const getBalances = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const groupId = req.params.groupId as string;

    const participants =
      await prisma.expenseParticipant.findMany({
        where: {
          expense: {
            groupId,
          },
        },
        include: {
          expense: true,
        },
      });

    return res.json({
      success: true,
      participants,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error?.message,
    });
  }
};