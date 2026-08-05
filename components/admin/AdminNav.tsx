"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  Building2,
  Contact,
  FileText,
  Inbox,
  LayoutDashboard,
  Package,
  PlayCircle,
  Receipt,
} from "lucide-react";

import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/unternehmen", label: "Unternehmen", icon: Building2, exact: false },
  { href: "/admin/anfragen", label: "Anfragen", icon: Inbox, exact: false },
  { href: "/admin/kaeufe", label: "Käufe", icon: Receipt, exact: false },
  { href: "/admin/kontakte", label: "Kontakte", icon: Contact, exact: false },
  { href: "/admin/broschuere", label: "Broschüre", icon: FileText, exact: false },
  { href: "/admin/demo-zugang", label: "Demo-Zugang", icon: PlayCircle, exact: false },
  { href: "/admin/pakete", label: "Pakete", icon: Package, exact: false },
  { href: "/admin/module", label: "Module", icon: Boxes, exact: false },
] as const;

export default function AdminNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav aria-label="Adminbereich" className="flex flex-col gap-1">
      {ITEMS.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-white/10 font-medium text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-100",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
