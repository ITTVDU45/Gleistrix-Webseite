import { Bot, FileText, Package, TrainFront, User } from "lucide-react";

export type ModuleVisualVariant =
  | "projekte"
  | "plantafel"
  | "team"
  | "dokumente"
  | "lager"
  | "abrechnung"
  | "ki";

/** Kompakte, CSS-basierte Produktoberflächen für die Modul-Blöcke. Rein dekorativ. */
export default function ModuleVisual({ variant }: { variant: ModuleVisualVariant }) {
  return (
    <div
      aria-hidden
      className="shadow-soft relative overflow-hidden rounded-3xl border border-slate-900/8 bg-white p-5"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.08),transparent)]"
      />
      {VISUALS[variant]}
    </div>
  );
}

function RowShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-900/6 bg-slate-50/60 px-3.5 py-3">
      {children}
    </div>
  );
}

const projekteVisual = (
  <div className="space-y-2.5">
    <p className="text-xs font-semibold text-slate-700">Aktive Projekte</p>
    {[
      { name: "Gleisbau Abschnitt 12", status: "In Umsetzung", tone: "bg-indigo-50 text-indigo-600", progress: "w-2/3", bar: "bg-indigo-500" },
      { name: "BÜ-Sicherung Linie S4", status: "Geplant", tone: "bg-sky-50 text-sky-600", progress: "w-1/4", bar: "bg-sky-500" },
      { name: "Weichenerneuerung W8", status: "Abnahme", tone: "bg-emerald-50 text-emerald-600", progress: "w-11/12", bar: "bg-emerald-500" },
    ].map((project) => (
      <RowShell key={project.name}>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-xs font-semibold text-slate-800">{project.name}</p>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${project.tone}`}>
              {project.status}
            </span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-slate-200/70">
            <div className={`h-1.5 rounded-full ${project.bar} ${project.progress}`} />
          </div>
        </div>
      </RowShell>
    ))}
  </div>
);

const plantafelVisual = (
  <div>
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold text-slate-700">Plantafel · KW 28</p>
      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
        Keine Konflikte
      </span>
    </div>
    <div className="mt-3 space-y-2">
      {[
        { name: "Trupp Nord", start: 1, span: 4, color: "bg-indigo-500" },
        { name: "Trupp Süd", start: 3, span: 5, color: "bg-violet-500" },
        { name: "SiPo Team A", start: 2, span: 3, color: "bg-sky-500" },
        { name: "Bagger 023", start: 4, span: 4, color: "bg-emerald-500" },
      ].map((row) => (
        <div key={row.name} className="grid grid-cols-[80px_1fr] items-center gap-2">
          <span className="truncate text-[10px] font-medium text-slate-500">{row.name}</span>
          <div className="grid h-6 grid-cols-8 items-center rounded-lg bg-slate-50/80 px-1">
            <span
              className={`h-2.5 rounded-full ${row.color}`}
              style={{ gridColumn: `${row.start} / span ${row.span}` }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const teamVisual = (
  <div className="space-y-2.5">
    <p className="text-xs font-semibold text-slate-700">Ressourcen heute</p>
    {[
      { icon: User, name: "M. Weber · SiPo", meta: "Einsatz Linie S4", dot: "bg-emerald-500" },
      { icon: User, name: "T. Krüger · Bauleitung", meta: "Abschnitt 12", dot: "bg-emerald-500" },
      { icon: TrainFront, name: "ZWB Fahrzeug 07", meta: "HU fällig in 14 Tagen", dot: "bg-amber-500" },
      { icon: User, name: "L. Schmitt · Monteur", meta: "Verfügbar ab Mi", dot: "bg-slate-300" },
    ].map((entry) => (
      <RowShell key={entry.name}>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-900/6">
          <entry.icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-slate-800">{entry.name}</p>
          <p className="truncate text-[10px] text-slate-400">{entry.meta}</p>
        </div>
        <span className={`h-2 w-2 shrink-0 rounded-full ${entry.dot}`} />
      </RowShell>
    ))}
  </div>
);

const dokumenteVisual = (
  <div className="space-y-2.5">
    <p className="text-xs font-semibold text-slate-700">Projektakte · Abschnitt 12</p>
    {[
      { name: "Sicherungsplan_v3.pdf", meta: "Freigegeben · heute", tone: "text-emerald-600 bg-emerald-50" },
      { name: "Tagesbericht_KW28.pdf", meta: "KI-generiert · gestern", tone: "text-indigo-600 bg-indigo-50" },
      { name: "Abnahmeprotokoll_W8.pdf", meta: "Signatur ausstehend", tone: "text-amber-600 bg-amber-50" },
    ].map((doc) => (
      <RowShell key={doc.name}>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-900/6">
          <FileText className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-slate-800">{doc.name}</p>
          <p className="text-[10px] text-slate-400">{doc.meta}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${doc.tone}`}>
          revisionssicher
        </span>
      </RowShell>
    ))}
  </div>
);

const lagerVisual = (
  <div className="space-y-2.5">
    <p className="text-xs font-semibold text-slate-700">Lagerbestand · Hauptlager</p>
    {[
      { name: "Schwellen B70", stock: "w-3/4", level: "312 Stk", bar: "bg-emerald-500" },
      { name: "Kleineisen Set", stock: "w-1/3", level: "48 Sets", bar: "bg-amber-500" },
      { name: "Warnsignale ATWS", stock: "w-5/6", level: "26 Stk", bar: "bg-emerald-500" },
    ].map((item) => (
      <RowShell key={item.name}>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 ring-1 ring-slate-900/6">
          <Package className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <p className="truncate text-xs font-semibold text-slate-800">{item.name}</p>
            <span className="text-[10px] font-medium text-slate-400">{item.level}</span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full bg-slate-200/70">
            <div className={`h-1.5 rounded-full ${item.bar} ${item.stock}`} />
          </div>
        </div>
      </RowShell>
    ))}
  </div>
);

const abrechnungVisual = (
  <div>
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold text-slate-700">Abrechnung · Juli 2026</p>
      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
        Geprüft
      </span>
    </div>
    <div className="mt-3 space-y-2">
      {[
        { pos: "Pos. 01 · Sicherungsleistung", value: "12.480,00 €" },
        { pos: "Pos. 02 · Gleisbau Abschnitt 12", value: "38.150,00 €" },
        { pos: "Pos. 03 · Maschinenvorhaltung", value: "6.920,00 €" },
      ].map((line) => (
        <div key={line.pos} className="flex items-center justify-between rounded-xl border border-slate-900/6 bg-slate-50/60 px-3.5 py-2.5">
          <span className="truncate text-[11px] font-medium text-slate-600">{line.pos}</span>
          <span className="shrink-0 text-[11px] font-semibold text-slate-800">{line.value}</span>
        </div>
      ))}
      <div className="flex items-center justify-between rounded-xl bg-indigo-600 px-3.5 py-3 text-white">
        <span className="text-[11px] font-semibold">Rechnungsentwurf gesamt</span>
        <span className="text-sm font-bold">57.550,00 €</span>
      </div>
    </div>
  </div>
);

const kiVisual = (
  <div className="space-y-2.5">
    <div className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white">
        <Bot className="h-4 w-4" />
      </span>
      <p className="text-xs font-semibold text-slate-700">LV-Agent</p>
      <span className="ml-auto rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
        Analyse abgeschlossen
      </span>
    </div>
    <div className="rounded-xl border border-slate-900/6 bg-slate-50/60 px-3.5 py-3 text-[11px] leading-relaxed text-slate-600">
      Leistungsverzeichnis <span className="font-semibold text-slate-800">„Ausschreibung 2026-114“</span>{" "}
      ausgewertet: 84 Positionen erkannt, 12 sicherungsrelevante Leistungen markiert.
    </div>
    <div className="rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 px-3.5 py-3 text-[11px] font-medium text-indigo-700">
      Angebotsdaten vorbereitet → zur Kalkulation übergeben
    </div>
  </div>
);

const VISUALS: Record<ModuleVisualVariant, React.ReactNode> = {
  projekte: projekteVisual,
  plantafel: plantafelVisual,
  team: teamVisual,
  dokumente: dokumenteVisual,
  lager: lagerVisual,
  abrechnung: abrechnungVisual,
  ki: kiVisual,
};
