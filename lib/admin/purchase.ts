import { calculatePrice, type ConfiguratorSelection } from "@/data/pricing";
import type { Purchase } from "@/types/admin";
import type { PricingConfig } from "@/types/pricing";

/**
 * Baut einen Kauf und friert dabei seinen Preis ein.
 *
 * Rein und ohne Datenbank, damit die Geldrechnung prüfbar bleibt: Was hier
 * entsteht, bestimmt, was der Kunde zahlt, und wird später nie wieder
 * nachgerechnet. Gerechnet wird mit `calculatePrice` – derselben Funktion, die
 * dem Kunden im Preisrechner die Zahl gezeigt hat. Ein zweiter Rechenweg
 * driftete garantiert irgendwann von ihr weg.
 *
 * Der Betrag entsteht SERVERSEITIG neu. Den Wert aus dem Formular zu übernehmen
 * hieße, den Preis vom Browser bestimmen zu lassen.
 */
export function purchaseFor(input: {
  id: string;
  companyId: string;
  selection: ConfiguratorSelection;
  config: PricingConfig;
  createdAt: string;
}): Purchase {
  const { selection } = input;
  const breakdown = calculatePrice(input.config, selection);

  // Nur Mengen der tatsächlich gebuchten Module – sonst stünden im Kauf Zahlen
  // zu Modulen, die er gar nicht enthält.
  const usageAmounts = Object.fromEntries(
    Object.entries(selection.usageAmounts).filter(
      ([moduleId, amount]) => selection.moduleIds.includes(moduleId) && amount > 0,
    ),
  );

  return {
    id: input.id,
    kind: "paket",
    companyId: input.companyId,
    packageId: selection.packageId,
    moduleIds: selection.moduleIds,
    users: selection.users,
    capacityId: selection.capacityId,
    usageAmounts: Object.keys(usageAmounts).length > 0 ? usageAmounts : undefined,
    monthlyTotal: breakdown.monthlyTotal,
    implementationPrice: breakdown.implementationPrice,
    status: "offen",
    syncedAt: null,
    syncError: null,
    createdAt: input.createdAt,
  };
}

/* ---------------------------------------------------------- Abbestellung */

/**
 * Letzter Moment des Monats, in dem `zeitpunkt` liegt – in UTC.
 *
 * DIE REGEL FÜR ABBESTELLUNGEN, an genau einer Stelle: Sie wirkt zum
 * Monatsende, nicht sofort, und es gibt keine anteilige Erstattung. Bis dahin
 * ist bezahlt, also bleibt das Modul nutzbar. Soll sie sofort wirken, ist hier
 * eine Zeile zu ändern – und die zugehörigen Prüfungen in purchase.check.ts.
 */
export function monatsende(zeitpunkt: string): string {
  const datum = new Date(zeitpunkt);
  // Tag 0 des Folgemonats ist der letzte Tag des laufenden.
  return new Date(
    Date.UTC(datum.getUTCFullYear(), datum.getUTCMonth() + 1, 0, 23, 59, 59, 999),
  ).toISOString();
}

/**
 * Zählt der Kauf zum heutigen Stand – für den Monatsbetrag und für das, was
 * der App gemeldet wird?
 *
 * Eine abbestellte Zubuchung bleibt bis zum Laufzeitende wirksam. Danach fällt
 * sie weg, ohne dass jemand aufräumen muss: Der Kauf bleibt als Beleg stehen.
 */
export function istWirksam(purchase: Purchase, jetzt: string): boolean {
  if (purchase.status !== "freigegeben") return false;
  return !purchase.endetAm || purchase.endetAm >= jetzt;
}

/**
 * Baut eine Zubuchung: Module, die ein Nutzer in der App selbst freigeschaltet
 * hat und die „on top" auf seinen Grundkauf kommen.
 *
 * BEWUSST NICHT `calculatePrice`: Deren Formel setzt ein Paket voraus und
 * enthält Grundpreis, Freikontingent und Kapazitätsaufschlag. Auf eine
 * Zubuchung angewandt, käme der Grundpreis ein zweites Mal obendrauf. Eine
 * Zubuchung kostet genau ihre Module plus deren Nutzungsmengen.
 *
 * `status` ist „freigegeben": Das Add-on läuft in der App bereits, wenn diese
 * Meldung eintrifft. Die Website hält den Vorgang fest, sie gibt ihn nicht frei.
 */
export function addonPurchaseFor(input: {
  id: string;
  companyId: string;
  moduleIds: string[];
  usageAmounts: Record<string, number>;
  config: PricingConfig;
  createdAt: string;
}): Purchase {
  const gebucht = input.config.modules.filter(
    (module) => module.isActive && input.moduleIds.includes(module.id),
  );

  const modulesPrice = gebucht.reduce((total, module) => total + module.price, 0);
  const usagePrice = gebucht.reduce((total, module) => {
    if (!module.usage) return total;
    const amount = Math.max(0, Math.floor(input.usageAmounts[module.id] ?? 0));
    return total + amount * module.usage.unitPrice;
  }, 0);

  const usageAmounts = Object.fromEntries(
    Object.entries(input.usageAmounts).filter(
      ([moduleId, amount]) => gebucht.some((module) => module.id === moduleId) && amount > 0,
    ),
  );

  return {
    id: input.id,
    kind: "zubuchung",
    companyId: input.companyId,
    // Paket, Kapazität und Benutzerzahl gehören zum Grundkauf – eine Zubuchung
    // ändert daran nichts und behauptet es hier auch nicht.
    packageId: "",
    capacityId: "",
    users: 0,
    moduleIds: gebucht.map((module) => module.id),
    usageAmounts: Object.keys(usageAmounts).length > 0 ? usageAmounts : undefined,
    // Wie beim Grundkauf: genau einmal am Ende runden.
    monthlyTotal: Math.round((modulesPrice + usagePrice) * 100) / 100,
    implementationPrice: 0,
    status: "freigegeben",
    syncedAt: input.createdAt,
    syncError: null,
    createdAt: input.createdAt,
  };
}
