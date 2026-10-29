
import "server-only";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";


export async function requireUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  // Requests can arrive together on first sign-in (for example, parallel
  // dashboard data loads). PostgreSQL's unique conflict handling makes this
  // create idempotent when another request inserts the same Clerk user first.
  await prisma.user.createMany({
    data: [{ clerkId: userId }],
    skipDuplicates: true,
  });

  return prisma.user.findUniqueOrThrow({
    where: { clerkId: userId },
  });
}

export async function requireAdmin() {
  const user = await requireUser();

  if (user.role !== "admin") {
    throw new Error("FORBIDDEN");
  }

  return user;
}


export async function requireVendor(){
  const user = await requireUser();

  const vendor = await prisma.vendor.findUnique({
    where:{
      clerkId: user.clerkId,
    },
  });
  if(!vendor){
    throw new Error("FORBIDDEN");
  }
  return vendor;
}
