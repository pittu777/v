import { requireUser } from "@/src/features/users/services/user.service";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const user = await requireUser();

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
  console.error("Failed to load current user:", error);

  if (error instanceof Error && error.message === "Unauthorized") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  console.log("Failed to load current user:", error);

  return NextResponse.json(
    { success: false, message: "Internal server error" },
    { status: 500 }
  );
}
}