import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createGroup = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Group name is required",
      });
    }

    const group = await prisma.group.create({
      data: {
        name,
      },
    });

    return res.status(201).json({
      success: true,
      group,
    });
  } catch (error: any) {
  console.error("GROUP ERROR:");
  console.error(error);

  return res.status(500).json({
    success: false,
    error: error?.message,
  });
}
};
export const addMember = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const groupId = req.params.groupId as string;
    const { userId } = req.body;

    const member = await prisma.groupMember.create({
      data: {
        groupId,
        userId,
      },
    });

    return res.status(201).json({
      success: true,
      member,
    });
  } catch (error: any) {
    console.error("ADD MEMBER ERROR:");
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error?.message,
    });
  }
};
export const leaveGroup = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const groupId = req.params.groupId as string;
    const userId = req.params.userId as string;

    const member =
      await prisma.groupMember.findFirst({
        where: {
          groupId,
          userId,
          leftAt: null,
        },
      });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    const updatedMember =
      await prisma.groupMember.update({
        where: {
          id: member.id,
        },
        data: {
          leftAt: new Date(),
        },
      });

    return res.json({
      success: true,
      member: updatedMember,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error?.message,
    });
  }
};
export const getGroupMembers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const groupId = req.params.groupId as string;

    const members = await prisma.groupMember.findMany({
      where: {
        groupId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      members,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error?.message,
    });
  }
};