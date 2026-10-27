import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  let event: Awaited<ReturnType<typeof verifyWebhook>>;
  try {
    event = await verifyWebhook(request);
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  if (event.type !== "user.deleted") {
    return Response.json({ received: true });
  }

  const clerkId = event.data.id;
  if (!clerkId) {
    return new Response("Deleted user ID is missing", { status: 400 });
  }

  try {
    // Idempotent: Clerk may retry delivery. The User -> Vendor -> Machine
    // cascade in the schema removes this account's owned records as well.
    await prisma.user.deleteMany({ where: { clerkId } });
    return Response.json({ received: true });
  } catch (error) {
    console.error("Clerk user deletion sync failed", {
      name: error instanceof Error ? error.name : "UnknownError",
      code:
        typeof error === "object" && error !== null && "code" in error &&
        typeof error.code === "string"
          ? error.code
          : undefined,
    });
    // A non-2xx response lets Clerk retry the event.
    return new Response("Unable to sync user deletion", { status: 500 });
  }
}
