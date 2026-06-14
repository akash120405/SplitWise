import prisma from "../config/prisma";

export const saveAnomaly = async (
  anomaly: any
) => {
  return prisma.anomaly.create({
    data: {
      type: anomaly.type,
      severity: anomaly.severity,
      description: anomaly.message,
      actionTaken: anomaly.action,
    },
  });
};