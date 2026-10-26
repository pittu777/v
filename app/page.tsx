import { SignOutControl } from "@/features/auth/components/SignOutControl";
import SlotGrid from "@/features/slotCard/components/SlotGrid";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="mb-6 flex justify-end gap-3">
        <Link
          href="/vendor/onboarding"
          className="rounded-lg border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50"
        >
          Set up vendor profile
        </Link>
        <SignOutControl />
      </div>
      <SlotGrid />
    </>
  );
}
