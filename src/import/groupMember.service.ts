import prisma from "../config/prisma";

export const addUserToGroup = async (
  userId: string,
  groupId: string
) => {
  const existing =
    await prisma.groupMember.findFirst({
      where: {
        userId,
        groupId,
      },
    });

  if (existing) {
    return existing;
  }

  return prisma.groupMember.create({
    data: {
      userId,
      groupId,
    },
  });
};