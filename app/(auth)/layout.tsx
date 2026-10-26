import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
        <section className="hidden flex-col justify-between border-r bg-muted/30 p-10 lg:flex xl:p-14">
          <Link href="/" className="w-fit text-lg font-semibold tracking-tight">Vendor</Link>
          <div className="max-w-md space-y-4">
            <p className="text-sm font-medium text-muted-foreground">Vending operations</p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight">A clearer way to manage your business.</h1>
            <p className="text-base leading-7 text-muted-foreground">Keep your machines and day-to-day operations organized in one place.</p>
          </div>
          <p className="text-xs text-muted-foreground">Vendor management platform</p>
        </section>

        <section className="flex min-h-screen flex-col px-5 py-6 sm:px-8 lg:justify-center lg:px-12">
          <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center lg:flex-none">
            <Link href="/" className="mb-10 w-fit text-lg font-semibold tracking-tight lg:hidden">Vendor</Link>
            {children}
          </div>
          <footer className="mx-auto mt-8 w-full max-w-sm text-center text-xs text-muted-foreground">
            Secure access to your vending operations
          </footer>
        </section>
      </div>
    </main>
  );
}
