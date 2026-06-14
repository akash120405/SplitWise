import prisma from "../config/prisma";
import { calculateGroupBalances } from "./balance.service";

export const generateSettlements = async (
  groupId: string
) => {
  const balances =
    await calculateGroupBalances(groupId);

  // Clear old settlements
  await prisma.settlement.deleteMany();

  const creditors: {
    userId: string;
    amount: number;
  }[] = [];

  const debtors: {
    userId: string;
    amount: number;
  }[] = [];

  Object.entries(balances).forEach(
    ([userId, balance]) => {
      if (balance > 0.01) {
        creditors.push({
          userId,
          amount: Number(balance),
        });
      } else if (balance < -0.01) {
        debtors.push({
          userId,
          amount: Math.abs(Number(balance)),
        });
      }
    }
  );

  const settlements = [];

  let i = 0;
  let j = 0;

  while (
    i < debtors.length &&
    j < creditors.length
  ) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const amount = Math.min(
      debtor.amount,
      creditor.amount
    );

    const settlement =
      await prisma.settlement.create({
        data: {
          payerId: debtor.userId,
          receiverId: creditor.userId,
          amount: Number(
            amount.toFixed(2)
          ),
        },
      });

    settlements.push(settlement);

    debtor.amount = Number(
      (debtor.amount - amount).toFixed(2)
    );

    creditor.amount = Number(
      (creditor.amount - amount).toFixed(2)
    );

    if (debtor.amount < 0.01) {
      i++;
    }

    if (creditor.amount < 0.01) {
      j++;
    }
  }

  return settlements;
};