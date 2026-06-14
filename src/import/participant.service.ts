import prisma from "../config/prisma";

export const createParticipants =
  async (
    expenseId: string,
    splitWith: string,
    amount: number
  ) => {
    const participants =
      splitWith
        .split(";")
        .map((name) =>
          name.trim()
        );

    const share =
      amount /
      participants.length;

    for (const participantName of participants) {
      const email =
        `${participantName.toLowerCase()}@import.local`;

      const user =
        await prisma.user.findUnique({
          where: {
            email,
          },
        });

      if (!user) continue;

      await prisma.expenseParticipant.create(
        {
          data: {
            expenseId,
            userId: user.id,
            owedAmount: share,
          },
        }
      );
    }
  };