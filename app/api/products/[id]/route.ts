import { updateProductSchema } from "@/features/products/product.schema";
import {
  deleteProduct,
  ProductServiceError,
  updateProduct,
} from "@/features/products/product.service";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = updateProductSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid product data",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const product = await updateProduct(id, parsed.data);

    return NextResponse.json(
      { success: true, data: product },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof ProductServiceError) {
      const status =
        error.code === "UNAUTHORIZED" ? 401 :
        error.code === "FORBIDDEN" ? 403 :
        error.code === "NOT_FOUND" ? 404 :
        error.code === "DUPLICATE_PRODUCT" ? 409 : 500;

      return NextResponse.json(
        { success: false, code: error.code, message: error.message },
        { status },
      );
    }

    console.error("Update product failed");

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}



export async function DELETE(request: Request, { params }: RouteContext) {
  try{

    const { id } = await params;
    
    const result = await deleteProduct(id);
    
    return NextResponse.json({
      success: true,
      data: result,
    })
  }catch(error){
    if(error instanceof ProductServiceError){
      const status = error.code === "NOT_FOUND" ? 404 : 400;
      return NextResponse.json({
        success: false,
        message: error.message,
      },
    {status},)
    }
    console.error("delete product failed:", error);

    return NextResponse.json({
      success:false,
      message: "Internal Server error",
    },{status:500})
  }

}

