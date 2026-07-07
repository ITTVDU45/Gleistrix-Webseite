/**
 * CSS-basiertes Produkt-Mockup der Gleistrix-Oberfläche (Plantafel-Ansicht).
 * Rein dekorativ – wird für Screenreader ausgeblendet.
 */

const SIDEBAR_ITEMS = [
  { label: "Dashboard", active: false },
  { label: "Projekte", active: false },
  { label: "Plantafel", active: true },
  { label: "Mitarbeiter", active: false },
  { label: "Fahrzeuge", active: false },
  { label: "Dokumente", active: false },
  { label: "Lager", active: false },
  { label: "Abrechnung", active: false },
] as const;

const KPIS = [
  { label: "Aktive Projekte", value: "24", trend: "+3 diese Woche", trendColor: "text-emerald-600" },
  { label: "Einsätze heute", value: "12", trend: "8 Trupps unterwegs", trendColor: "text-slate-400" },
  { label: "Offene Mängel", value: "3", trend: "−2 seit gestern", trendColor: "text-emerald-600" },
  { label: "Abrechnung bereit", value: "8", trend: "Prüfung abgeschlossen", trendColor: "text-indigo-600" },
] as const;

/** Plantafel-Zeilen: [Startspalte 1-14, Länge in Spalten, Farbe] */
const PLAN_ROWS = [
  { name: "Trupp Nord", bars: [{ start: 1, span: 5, color: "bg-indigo-500" }, { start: 8, span: 4, color: "bg-indigo-300" }] },
  { name: "Trupp Süd", bars: [{ start: 3, span: 6, color: "bg-violet-500" }] },
  { name: "SiPo Team A", bars: [{ start: 2, span: 3, color: "bg-sky-500" }, { start: 7, span: 6, color: "bg-sky-300" }] },
  { name: "Bagger 023", bars: [{ start: 5, span: 7, color: "bg-emerald-500" }] },
  { name: "ZWB Fahrzeug", bars: [{ start: 1, span: 2, color: "bg-amber-500" }, { start: 9, span: 4, color: "bg-amber-300" }] },
] as const;

const UPCOMING = [
  { title: "BÜ-Sicherung Linie S4", meta: "Mo 04:30 · Nachtschicht", dot: "bg-indigo-500" },
  { title: "Gleisbau Abschnitt 12", meta: "Di 07:00 · Trupp Nord", dot: "bg-violet-500" },
  { title: "Abnahme Weiche W8", meta: "Mi 09:15 · Projektleitung", dot: "bg-sky-500" },
] as const;

export default function DashboardMockup() {
  return (
    <div
      aria-hidden
      className="shadow-soft overflow-hidden rounded-3xl border border-slate-900/8 bg-white text-left"
    >
      {/* Fenster-Leiste */}
      <div className="flex items-center gap-2 border-b border-slate-900/6 bg-slate-50/80 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
        <div className="mx-auto hidden items-center gap-1.5 rounded-md bg-white px-8 py-1 text-[10px] text-slate-400 ring-1 ring-slate-900/6 sm:flex">
          app.gleistrix.de/plantafel
        </div>
      </div>

      <div className="flex">
        {/* Seitenleiste */}
        <aside className="hidden w-40 shrink-0 border-r border-slate-900/6 bg-slate-50/60 p-3 md:block">
          <div className="mb-4 flex items-center gap-2 px-2">
            <span className="h-6 w-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500" />
            <span className="text-xs font-bold text-slate-800">Gleistrix</span>
          </div>
          <nav className="space-y-0.5">
            {SIDEBAR_ITEMS.map((item) => (
              <div
                key={item.label}
                className={
                  "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-medium " +
                  (item.active
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500")
                }
              >
                <span
                  className={
                    "h-1.5 w-1.5 rounded-sm " +
                    (item.active ? "bg-white/80" : "bg-slate-300")
                  }
                />
                {item.label}
              </div>
            ))}
          </nav>
        </aside>

        {/* Hauptbereich */}
        <div className="min-w-0 flex-1 space-y-4 p-4 sm:p-5">
          {/* Kopfzeile */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Plantafel · KW 28</p>
              <p className="text-[11px] text-slate-400">Einsatzplanung für alle Trupps und Ressourcen</p>
            </div>
            <span className="hidden rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white sm:block">
              + Einsatz planen
            </span>
          </div>

          {/* KPI-Karten */}
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            {KPIS.map((kpi) => (
              <div key={kpi.label} className="rounded-xl border border-slate-900/6 bg-slate-50/50 p-3">
                <p className="text-[10px] font-medium text-slate-400">{kpi.label}</p>
                <p className="mt-0.5 text-xl font-bold tracking-tight text-slate-900">{kpi.value}</p>
                <p className={`text-[10px] font-medium ${kpi.trendColor}`}>{kpi.trend}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_200px]">
            {/* Plantafel / Gantt */}
            <div className="overflow-hidden rounded-xl border border-slate-900/6">
              <div className="grid grid-cols-[88px_1fr] border-b border-slate-900/6 bg-slate-50/70 text-[10px] font-medium text-slate-400">
                <div className="px-3 py-2">Ressource</div>
                <div className="grid grid-cols-7 py-2 pr-2 text-center">
                  {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
              </div>
              {PLAN_ROWS.map((row) => (
                <div
                  key={row.name}
                  className="grid grid-cols-[88px_1fr] items-center border-b border-slate-900/4 last:border-0"
                >
                  <div className="truncate px-3 py-2.5 text-[10px] font-medium text-slate-600">
                    {row.name}
                  </div>
                  <div className="relative grid h-full grid-cols-14 items-center gap-y-1 pr-2">
                    {row.bars.map((bar) => (
                      <span
                        key={`${row.name}-${bar.start}`}
                        className={`${bar.color} col-span-full h-2.5 rounded-full`}
                        style={{ gridColumn: `${bar.start} / span ${bar.span}` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Nächste Einsätze */}
            <div className="hidden flex-col gap-2 lg:flex">
              <p className="text-[11px] font-semibold text-slate-700">Nächste Einsätze</p>
              {UPCOMING.map((entry) => (
                <div key={entry.title} className="rounded-xl border border-slate-900/6 bg-white p-2.5">
                  <div className="flex items-start gap-2">
                    <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${entry.dot}`} />
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-semibold text-slate-800">{entry.title}</p>
                      <p className="text-[10px] text-slate-400">{entry.meta}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 p-2.5 text-center text-[10px] font-medium text-indigo-600">
                KI-Vorschlag: 2 Einsätze optimierbar
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
