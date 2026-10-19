
import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Branding panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-zinc-900 p-12 lg:flex">
          <div className="relative z-10">
            <a href="/" className="text-2xl font-bold tracking-tight">
              Vendor<span className="text-emerald-400">.</span>
            </a>
            <p className="mt-2 text-sm text-zinc-400">
              Vending machine management, simplified.
            </p>
          </div>

          <div className="relative z-10 max-w-lg">
            <div className="mb-6 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
              Inventory management made simple
            </div>

            <h1 className="text-5xl font-semibold leading-tight tracking-tight">
              Everything you need to manage your vending business.
            </h1>

            <p className="mt-6 leading-7 text-zinc-400">
              Track machines, monitor stock, manage products, and keep
              your operations organized from one dashboard.
            </p>
          </div>

          <p className="relative z-10 text-sm text-zinc-500">
            {/* © {new Date().getFullYear()} Vendor. All rights reserved. */}
          </p>

          {/* Decorative background */}
          <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        </section>

        {/* Authentication form */}
        <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <a href="/" className="text-2xl font-bold">
                Vendor<span className="text-emerald-400">.</span>
              </a>
            </div>

            {children}

            <p className="mt-8 text-center text-xs leading-5 text-zinc-500">
              By continuing, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
