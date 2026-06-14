import prisma from "../config/prisma";

export const createExpense = async (
  row: any,
  payerId: string,
  groupId: string
) => {
  const amount = Number(
    String(row.amount).replace(/,/g, "")
  );

  return prisma.expense.create({
    data: {
      title: row.description,
      amount,
      splitType: "EQUAL",

      paidBy: {
        connect: {
          id: payerId,
        },
      },

      group: {
        connect: {
          id: groupId,
        },
      },
    },
  });
};