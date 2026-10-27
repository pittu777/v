import {
  MachineServiceError,
  updateMyMachine,
} from "@/features/machines/machine.service";
import { createMachineSchema } from "@/features/machines/machine.schema";
import { NextResponse } from "next/server";

function errorResponse(error: unknown) {
  if (error instanceof MachineServiceError) {
    const status =
      error.code === "UNAUTHORIZED" ? 401 :
      error.code === "FORBIDDEN" ? 403 : 404;

    return NextResponse.json(
      { success: false, code: error.code, message: error.message },
      { status },
    );
  }

  const details = {
    name: error instanceof Error ? error.name : "UnknownError",
    code:
      typeof error === "object" && error !== null && "code" in error &&
      typeof error.code === "string"
        ? error.code
        : undefined,
    ...(process.env.NODE_ENV === "development" && error instanceof Error
      ? { message: error.message }
      : {}),
  };
  console.error("Vendor machine update failed", details);
  return NextResponse.json(
    { success: false, message: "Internal server error" },
    { status: 500 },
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ machineId: string }> },
) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = createMachineSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid machine details",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const { machineId } = await params;
    const machine = await updateMyMachine(machineId, parsed.data);
    return NextResponse.json({ success: true, data: machine });
  } catch (error) {
    return errorResponse(error);
  }
}
