import { createVendorSchema } from "@/features/vendors/vendor.schema";
import {
  createMyVendor,
  getMyVendor,
  VendorServiceError,
} from "@/features/vendors/vendor.service";
import { NextResponse } from "next/server";

function serviceErrorResponse(error: unknown) {
  if (error instanceof VendorServiceError) {
    const status =
      error.code === "UNAUTHORIZED" ? 401 :
      error.code === "FORBIDDEN" ? 403 :
      error.code === "NOT_FOUND" ? 404 : 409;

    return NextResponse.json(
      { success: false, code: error.code, message: error.message },
      { status },
    );
  }

  console.error("Vendor profile request failed");
  return NextResponse.json(
    { success: false, message: "Internal server error" },
    { status: 500 },
  );
}

export async function GET() {
  try {
    const vendor = await getMyVendor();
    return NextResponse.json({ success: true, data: vendor });
  } catch (error) {
    return serviceErrorResponse(error);
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

  const parsed = createVendorSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid vendor data",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const vendor = await createMyVendor(parsed.data);
    return NextResponse.json(
      { success: true, data: vendor },
      { status: 201 },
    );
  } catch (error) {
    return serviceErrorResponse(error);
  }
}
