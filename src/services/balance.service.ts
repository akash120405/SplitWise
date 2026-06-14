import prisma from "../config/prisma";

const calculateGroupBalances = async (
  groupId: string
) => {
  const expenses = await prisma.expense.findMany({
    where: { groupId },
    include: {
      participants: true,
    },
  });

  const balances: Record<string, number> = {};

  for (const expense of expenses) {
    const amount = Number(expense.amount);

    balances[expense.paidById] =
      (balances[expense.paidById] || 0) + amount;

    for (const participant of expense.participants) {
      balances[participant.userId] =
        (balances[participant.userId] || 0) -
        Number(participant.owedAmount);
    }
  }

  return balances;
};

export { calculateGroupBalances };