"use client";

import { useEffect } from "react";

import { useConsent } from "@/components/consent/consent-provider";

const SCRIPT_ID = "FCVbQpF4fRXpkXb2";
const SCRIPT_SRC = "https://dify.hostiteasy.com/embed.min.js";

declare global {
  interface Window {
    difyChatbotConfig?: {
      token: string;
      baseUrl: string;
      inputs: Record<string, unknown>;
      systemVariables: Record<string, unknown>;
      userVariables: Record<string, unknown>;
    };
  }
}

/**
 * Lädt den Chat-Assistenten erst nach einer Einwilligung in die Kategorie
 * "Funktional" (§ 25 Abs. 1 TDDDG).
 *
 * Bewusst kein `next/script`: Der Anbieter verlangt, dass
 * `window.difyChatbotConfig` gesetzt ist, BEVOR sein Skript ausgeführt wird.
 * Über zwei Script-Tags ist diese Reihenfolge nicht zugesichert; über ein
 * Einfügen von Hand schon — und der Aufräumpfad hat damit zugleich eine
 * Referenz auf genau das Element, das er wieder entfernen muss.
 */
export function DifyChat() {
  const { hasConsent } = useConsent();
  const isAllowed = hasConsent("functional");

  useEffect(() => {
    if (!isAllowed) return;

    // Erst die Konfiguration, dann das Skript — in dieser Reihenfolge.
    window.difyChatbotConfig = {
      token: SCRIPT_ID,
      baseUrl: "https://dify.hostiteasy.com",
      inputs: {},
      systemVariables: {},
      userVariables: {},
    };

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.id = SCRIPT_ID;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Beim Widerruf: sichtbare Reste und die Konfiguration entfernen und den
      // vom Anbieter im eigenen Origin abgelegten Speicher löschen.
      //
      // Ein bereits ausgeführtes Fremdskript lässt sich nicht aus dem Speicher
      // nehmen — vollständig zurückgesetzt ist der Zustand erst beim nächsten
      // Seitenaufbau. Danach wird das Skript ohne Einwilligung nicht mehr
      // geladen.
      script.remove();
      document.getElementById("dify-chatbot-bubble-button")?.remove();
      document.getElementById("dify-chatbot-bubble-window")?.remove();
      delete window.difyChatbotConfig;

      for (const key of Object.keys(window.localStorage)) {
        if (key.toLowerCase().includes("dify")) {
          window.localStorage.removeItem(key);
        }
      }
    };
  }, [isAllowed]);

  if (!isAllowed) return null;

  return (
    <style>{`
      #dify-chatbot-bubble-button { background-color: #4F46E5 !important; }
      #dify-chatbot-bubble-window { width: 24rem !important; height: 40rem !important; }
    `}</style>
  );
}
