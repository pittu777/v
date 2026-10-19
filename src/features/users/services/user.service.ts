
import "server-only";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/src/lib/prisma";


export async function requireUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  return prisma.user.upsert({
    where: {
      clerkId: userId,
    },
    update: {},
    create: {
      clerkId: userId,
    },
  });
}

export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== "admin") {
    throw new Error("FORBIDDEN");
  }

  return user;
}
