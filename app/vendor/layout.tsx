import Link from "next/link";
import { Boxes, LayoutDashboard, Monitor } from "lucide-react";
import { SignOutControl } from "@/features/auth/components/SignOutControl";

const navigation = [
  { href: "/vendor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vendor/machines", label: "Machines", icon: Monitor },
];

export default function VendorLayout({ children }: LayoutProps<"/vendor">) {
  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/vendor/dashboard"
            className="inline-flex min-h-10 items-center gap-2.5 rounded-md font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Boxes aria-hidden="true" className="size-4" />
            </span>
            Vendor
          </Link>

          <nav
            aria-label="Vendor navigation"
            className="order-3 flex w-full items-center gap-1 border-t pt-2 md:order-2 md:ml-4 md:w-auto md:flex-1 md:border-0 md:pt-0"
          >
            {navigation.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon aria-hidden="true" className="size-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="order-2 ml-auto md:order-3">
            <SignOutControl />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
