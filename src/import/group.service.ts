import prisma from "../config/prisma";

export const getImportGroup = async () => {
  let group = await prisma.group.findFirst({
    where: {
      name: "Imported CSV Group",
    },
  });

  if (!group) {
    group = await prisma.group.create({
      data: {
        name: "Imported CSV Group",
      },
    });
  }

  return group;
};