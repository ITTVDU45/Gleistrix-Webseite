"use client";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, Clock, FolderKanban, CheckCircle2 } from "lucide-react";

const COLORS = ["#60a5fa", "#a78bfa", "#34d399", "#f59e0b"];

const lineData = Array.from({ length: 12 }).map((_, i) => ({
  name: `M${i + 1}`,
  value: Math.round(50 + Math.random() * 100),
}));

const pieData = [
  { name: "Aktiv", value: 23 },
  { name: "Abgeschlossen", value: 41 },
  { name: "To-Dos", value: 12 },
  { name: "Blockiert", value: 4 },
];

export default function DashboardPreview() {
  return (
    <section className="relative w-full py-8 bg-transparent">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          aria-hidden
          className="absolute inset-x-0 -top-24 h-56 opacity-30 blur-3xl bg-gradient-to-r from-sky-300 via-violet-300 to-fuchsia-300"
          animate={{ opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 8, repeat: 100000, repeatType: "loop" }}
        />
      </div>

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0f172a] text-base">
                <FolderKanban className="h-4 w-4" /> Projekte gesamt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#0f172a]">64</p>
              <p className="text-sm text-slate-500">+12% im Vergleich zum Vormonat</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0f172a] text-base">
                <Clock className="h-4 w-4" /> Erfasste Stunden (30T)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#0f172a]">1.482</p>
              <p className="text-sm text-slate-500">+6% gegenüber dem Mittel</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0f172a] text-base">
                <BadgeCheck className="h-4 w-4" /> SLA-Quote
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#0f172a]">98%</p>
              <p className="text-sm text-slate-500">innerhalb Zielzeit</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0f172a] text-base">
                <CheckCircle2 className="h-4 w-4" /> Offene To-Dos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#0f172a]">37</p>
              <p className="text-sm text-slate-500">davon 5 kritisch</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2 bg-white/90">
            <CardHeader>
              <CardTitle className="text-[#0f172a]">Zeiterfassung (Monat)</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "white", border: "1px solid #e5e7eb" }} />
                  <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white/90">
            <CardHeader>
              <CardTitle className="text-[#0f172a]">Projektstatus</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "white", border: "1px solid #e5e7eb" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}


