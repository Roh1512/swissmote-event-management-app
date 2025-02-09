import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  omit: {
    event: {
      categoryId: true,
      createdById: true,
      attendeeIds: true,
    },
  },
});

export default prisma;
