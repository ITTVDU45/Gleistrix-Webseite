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
