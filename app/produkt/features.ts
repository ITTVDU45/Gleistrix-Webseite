import { Users, Wrench, KanbanSquare, Calendar, FileText, Folder, Clock, BarChart3 } from "lucide-react";
import type { ComponentType } from "react";

export type Feature = { id: string; title: string; desc: string; icon: ComponentType<unknown> };

export const FEATURES: Feature[] = [
  { id: 'mitarbeiter', title:'Mitarbeiterverwaltung', desc:'Anlegen, Abwesenheiten, Qualifikationen.' , icon: Users },
  { id: 'technik', title:'Fahrzeug & Technik', desc:'Zentral erfassen, warten, Einsätzen zuordnen.', icon: Wrench },
  { id: 'projekte', title:'Projektplanung & Dispo', desc:'Ressourcen präzise zuweisen & steuern.', icon: KanbanSquare },
  { id: 'kalender', title:'Kalender & Schichten', desc:'Alle Termine live in der App.', icon: Calendar },
  { id: 'rechnungen', title:'Rechnungsstellung', desc:'Schnell, korrekt, optional automatisiert.', icon: FileText },
  { id: 'dokumente', title:'Dokumentenmanagement', desc:'Zentral, teilbar, revisionssicher.', icon: Folder },
  { id: 'zeit', title:'Zeiterfassung & Zettel', desc:'Digital, mobil, prüffähig.', icon: Clock },
  { id: 'reports', title:'Reports & Forecasts', desc:'Echtzeitdaten für klare Entscheidungen.', icon: BarChart3 },
];


