import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

import LoginForm from "@/components/admin/LoginForm";
import { DEV_CREDENTIALS } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Admin-Login",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ next?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const target = next?.startsWith("/admin") ? next : "/admin";

  // Der Testzugang wird nur angezeigt, solange er tatsächlich gilt.
  const showDemo =
    process.env.NODE_ENV !== "production" &&
    !process.env.ADMIN_EMAIL &&
    !process.env.ADMIN_PASSWORD;

  return (
    <main className="grid min-h-dvh place-items-center bg-slate-950 px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-inset ring-primary/30">
            <ShieldCheck className="size-5" aria-hidden />
          </span>
          <h1 className="mt-4 text-xl font-semibold tracking-tight text-white">
            Gleistrix Superadmin
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Mandanten, Pakete und Module verwalten.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white p-6 shadow-soft">
          <LoginForm
            next={target}
            demoEmail={showDemo ? DEV_CREDENTIALS.email : undefined}
            demoPassword={showDemo ? DEV_CREDENTIALS.password : undefined}
          />
        </div>

        {showDemo ? (
          <p className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-center text-xs text-amber-200">
            Testzugang aktiv: <strong>{DEV_CREDENTIALS.email}</strong> /{" "}
            <strong>{DEV_CREDENTIALS.password}</strong>
            <br />
            In Produktion greifen ausschließlich ADMIN_EMAIL und ADMIN_PASSWORD.
          </p>
        ) : null}
      </div>
    </main>
  );
}
