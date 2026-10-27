import Link from "next/link";
import type { ReactNode } from "react";
import { Boxes, LockKeyhole, MoveUpRight } from "lucide-react";

function Brand() {
  return (
    <Link href="/" className="inline-flex w-fit items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Boxes aria-hidden="true" className="size-[18px]" />
      </span>
      <span className="text-base font-semibold tracking-tight">Vendor</span>
    </Link>
  );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto grid min-h-svh w-full max-w-[1600px] lg:grid-cols-[minmax(0,1fr)_minmax(480px,0.9fr)]">
        <aside className="relative hidden min-h-svh overflow-hidden border-r bg-muted/30 px-10 py-9 lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-12">
          <div className="absolute inset-0 -z-0 opacity-60" aria-hidden="true">
            <div className="absolute -right-24 top-24 size-[28rem] rounded-full border border-border/70" />
            <div className="absolute -right-10 top-40 size-[22rem] rounded-full border border-border/70" />
            <div className="absolute right-16 top-56 size-[16rem] rounded-full border border-border/70" />
          </div>
          <div className="relative z-10"><Brand /></div>

          <div className="relative z-10 max-w-xl space-y-10">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Vending operations</p>
              <h1 className="max-w-lg text-4xl font-semibold leading-[1.12] tracking-[-0.04em] xl:text-5xl">
                Keep your operation moving.
              </h1>
              <p className="max-w-md text-base leading-7 text-muted-foreground">
                A focused workspace for organizing your vending machines and the work around them.
              </p>
            </div>

            <div className="max-w-md rounded-2xl border bg-background/80 p-5 shadow-sm backdrop-blur-sm">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-muted">
                    <Boxes aria-hidden="true" className="size-4" />
                  </span>
                  Your workspace
                </div>
                <MoveUpRight aria-hidden="true" className="size-4 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-3 gap-3" aria-hidden="true">
                <div className="space-y-2 rounded-xl border bg-muted/30 p-3">
                  <div className="h-1.5 w-8 rounded-full bg-foreground/20" />
                  <div className="h-7 rounded-md border bg-background" />
                  <div className="h-1.5 w-12 rounded-full bg-foreground/10" />
                </div>
                <div className="space-y-2 rounded-xl border bg-muted/30 p-3">
                  <div className="h-1.5 w-10 rounded-full bg-foreground/20" />
                  <div className="h-7 rounded-md border bg-background" />
                  <div className="h-1.5 w-9 rounded-full bg-foreground/10" />
                </div>
                <div className="space-y-2 rounded-xl border bg-muted/30 p-3">
                  <div className="h-1.5 w-7 rounded-full bg-foreground/20" />
                  <div className="h-7 rounded-md border bg-background" />
                  <div className="h-1.5 w-11 rounded-full bg-foreground/10" />
                </div>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-xs text-muted-foreground">A clear view of your vending operation.</p>
        </aside>

        <section className="flex min-h-svh flex-col px-5 py-6 sm:px-8 lg:justify-center lg:px-12 xl:px-16">
          <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center lg:flex-none">
            <div className="mb-8 lg:hidden"><Brand /></div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
              {children}
            </div>
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <LockKeyhole aria-hidden="true" className="size-3.5" />
              <span>Secure access to your vending workspace</span>
            </div>
          </div>
          <footer className="mx-auto mt-8 w-full max-w-[440px] text-center text-xs text-muted-foreground">
            Vendor · Vending operations management
          </footer>
        </section>
      </div>
    </main>
  );
}
