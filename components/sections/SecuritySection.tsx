import { ShieldCheck } from "lucide-react";

export default function SecuritySection() {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-gray-900 to-slate-900" id="sicherheit">
      <div className="container mx-auto px-6 max-w-6xl">
        <h2 className="text-3xl font-semibold text-white flex items-center gap-2">
          <ShieldCheck className="h-6 w-6" /> Sicherheit & Vertrauen.
        </h2>
        <p className="text-white/80">Zertifizierte Standards für Bahnunternehmen.</p>
        <ul className="mt-4 list-disc pl-6 text-white/80">
          <li>Hosting in Deutschland, DSGVO-konform</li>
          <li>Rollen- und Rechtemanagement</li>
          <li>Audit-Logs und API-Integrationen</li>
          <li>Standards: EN 50126 / EN 50128 / EN 50129</li>
        </ul>
      </div>
    </section>
  );
}


