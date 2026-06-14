import prisma from "../config/prisma";

export const findOrCreateUser = async (
  name: string
) => {
  const cleanName = name.trim();

  const email =
    `${cleanName.toLowerCase()}@import.local`;

  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: cleanName,
        email,
        password: "imported-user",
      },
    });
  }

  return user;
};