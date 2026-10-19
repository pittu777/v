import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignInPage() {
  return (

      <Suspense fallback={<div>Loading signup...</div>}>
    <div className="flex min-h-screen items-center justify-center">

      <SignIn 
      
      />
    </div>
      </Suspense>
  );
}
