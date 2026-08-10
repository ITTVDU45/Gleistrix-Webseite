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
  Newspaper,
  Tags,
  Package,
  PlayCircle,
  Receipt,
  Settings,
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
  { href: "/admin/blog", label: "Blog & News", icon: Newspaper, exact: false },
  { href: "/admin/blog/kategorien", label: "Kategorien", icon: Tags, exact: false, indent: true },
  { href: "/admin/einstellungen", label: "Einstellungen", icon: Settings, exact: false },
] as const;

export default function AdminNav() {
  const pathname = usePathname() ?? "";

  // Die laengste passende Adresse gewinnt. Ohne das waere auf
  // /admin/blog/kategorien auch der Elterneintrag markiert, weil startsWith
  // auf beide passt – und niemand wuesste, wo er gerade ist.
  const current = ITEMS.filter((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href),
  ).sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <nav aria-label="Adminbereich" className="flex flex-col gap-1">
      {ITEMS.map((item) => {
        const { href, label, icon: Icon } = item;
        const isActive = href === current;
        const indent = "indent" in item && item.indent;

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              indent && "ml-3 py-1.5 text-[13px]",
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
