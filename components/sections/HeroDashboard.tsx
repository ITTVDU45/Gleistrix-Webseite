"use client";
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
import { useMemo } from "react";
import { BadgeCheck, Clock, FolderKanban, CheckCircle2 } from "lucide-react";

const COLORS = ["#60a5fa", "#a78bfa", "#34d399", "#f59e0b"];

function useLineData() {
  return useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        name: `M${i + 1}`,
        value: Math.round(50 + Math.random() * 100),
      })),
    []
  );
}

const pieData = [
  { name: "Aktiv", value: 23 },
  { name: "Abgeschlossen", value: 41 },
  { name: "To-Dos", value: 12 },
  { name: "Blockiert", value: 4 },
];

export default function HeroDashboard() {
  const lineData = useLineData();
  return (
    <div className="w-full">
      <div className="mt-6">
        <Card className="bg-white/95 backdrop-blur">
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
      </div>
    </div>
  );
}


