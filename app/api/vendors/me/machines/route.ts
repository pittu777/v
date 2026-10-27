import {
  createMyMachine,
  getMyMachines,
  MachineServiceError,
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

  console.error("Vendor machine request failed");
  return NextResponse.json(
    { success: false, message: "Internal server error" },
    { status: 500 },
  );
}

export async function GET() {
  try {
    const machines = await getMyMachines();
    return NextResponse.json({ success: true, data: machines });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
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
    const machine = await createMyMachine(parsed.data);
    return NextResponse.json(
      { success: true, data: machine },
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
