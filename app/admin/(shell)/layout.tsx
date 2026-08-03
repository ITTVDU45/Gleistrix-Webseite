import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";

import { logoutAction } from "@/app/admin/actions";
import AdminNav from "@/components/admin/AdminNav";
import { getSession } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: { default: "Superadmin", template: "%s | Gleistrix Superadmin" },
  robots: { index: false, follow: false },
};

export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Die Middleware schützt bereits alle /admin-Routen; dieser Check ist die
  // zweite Ebene, damit ein Konfigurationsfehler die Daten nicht freilegt.
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-dvh bg-background">
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col justify-between bg-slate-950 px-4 py-6 lg:flex">
        <div>
          <Link href="/admin" className="mb-8 flex items-center gap-2.5 px-3">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              G
            </span>
            <span className="text-sm font-semibold tracking-tight text-white">Superadmin</span>
          </Link>
          <AdminNav />
        </div>

        <div className="border-t border-white/10 pt-4">
          <p className="truncate px-3 text-xs text-slate-500" title={session.sub}>
            {session.sub}
          </p>
          <form action={logoutAction}>
            <button
              type="submit"
              className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100"
            >
              <LogOut className="size-4" aria-hidden />
              Abmelden
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b bg-card px-6 py-3 lg:hidden">
          <Link href="/admin" className="text-sm font-semibold">
            Gleistrix Superadmin
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Abmelden
            </button>
          </form>
        </header>

        <div className="border-b bg-slate-950 px-4 py-2 lg:hidden">
          <AdminNav />
        </div>

        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
