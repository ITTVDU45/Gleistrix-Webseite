"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

import { activeIndex, cardScale, iconShift, pageScrollFor } from "./workflow-timeline.math";

/**
 * Gepinnte Horizontal-Timeline der Prozessschritte.
 *
 * Arbeitsteilung: CSS besitzt die Geometrie (app/globals.css, Block
 * „Prozess-Timeline"), GSAP ScrollTrigger besitzt nur die Bewegung. Ob
 * überhaupt gepinnt wird, entscheidet ausschliesslich die Media Query dort;
 * dieses Modul liest die Entscheidung per getComputedStyle zurück. Dadurch
 * kann kein zweiter Media-Query-String danebenlaufen, und JavaScript setzt
 * niemals eine Höhe – Server- und Client-HTML bleiben pixelgleich.
 *
 * Die Schritte kommen als children herein, damit die Icons Server-seitig
 * gerendert bleiben und lucide-react nie im Client-Bundle landet.
 */
type Props = {
  children: ReactNode;
  stepCount: number;
};

export default function WorkflowTimeline({ children, stepCount }: Props) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const runway = runwayRef.current;
    const stage = stageRef.current;
    const viewport = viewportRef.current;
    if (!runway || !stage || !viewport) return;

    let cancelled = false;
    let context: { revert: () => void } | undefined;
    let travel = 0;
    let extra = 0;
    let stageTop = 0;
    let pinStart = 0;
    let expectedLeft = 0;
    let currentIndex = -1;

    /** Die Media Query in globals.css ist die einzige Quelle der Wahrheit. */
    const isPinned = () => getComputedStyle(stage).position === "sticky";

    /* ------------------------------------------------------------- Einzug */

    // Ein Beobachter für alle Karten statt sechs Reveal-Wrapper: in der
    // gepinnten, horizontal geklippten Bühne kämen die hinteren Karten nie
    // „in view" und blieben dauerhaft unsichtbar.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let observer: IntersectionObserver | undefined;
    if (!reduced) {
      runway.dataset.anim = "1";

      // Sofortprüfung vor dem Beobachter: steht die Sektion beim Einhängen
      // bereits im Bild, wird direkt aufgedeckt. Das vermeidet ein Aufblitzen
      // bei Sprungmarken und wiederhergestellter Scrollposition – und es ist
      // die Rückfallebene, falls der Beobachter nie zustellt. Ohne sie hinge
      // die Sektion in genau diesem Fall dauerhaft auf opacity 0.
      const rect = runway.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80 && rect.bottom > 80) runway.dataset.in = "1";

      observer = new IntersectionObserver(
        (entries) => {
          if (!entries[0]?.isIntersecting) return;
          runway.dataset.in = "1";
          observer?.disconnect();
        },
        // Gleiche Schwelle wie Reveal.tsx, damit die Sektion im selben Moment
        // anspringt wie der Rest der Seite.
        { rootMargin: "-80px" },
      );
      observer.observe(runway);
    }

    /* ---------------------------------------------------------- Pin-Pfad */

    // Bewusst Pfeilfunktionen statt Funktionsdeklarationen: nur so behält
    // TypeScript die Null-Verengung von runway/stage/viewport bei.
    const measure = (): void => {
      stageTop = parseFloat(getComputedStyle(stage).top) || 0;
      extra = runway.clientHeight - stage.clientHeight;
      travel = viewport.scrollWidth - viewport.clientWidth;
      pinStart = runway.getBoundingClientRect().top + window.scrollY - stageTop;
    };

    const start = async (): Promise<void> => {
      if (context || !isPinned()) return;

      // Erst hier laden: auf Telefonen, Tablets, in kurzen Fenstern und bei
      // reduzierter Bewegung werden gsap und ScrollTrigger nie geholt.
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      // Pflicht unter reactStrictMode: der erste Effektlauf importiert
      // asynchron, sein Cleanup läuft, bevor der Import auflöst.
      if (cancelled || context || !isPinned()) return;
      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        const columns = gsap.utils.toArray<HTMLElement>("[data-step]", runway);
        // Eigene Ebene: auf [data-step] liegt der Einzugs-Transform aus CSS,
        // den GSAP sonst einlesen und dauerhaft mitschreiben würde.
        const scalers = gsap.utils.toArray<HTMLElement>("[data-scale]", runway);
        const icons = gsap.utils.toArray<HTMLElement>("[data-icon]", runway);
        const nodes = gsap.utils.toArray<HTMLElement>("[data-node]", runway);
        const counter = runway.querySelector<HTMLElement>("[data-count]");
        const fill = runway.querySelector<HTMLElement>("[data-fill]");

        const setFill = fill ? gsap.quickSetter(fill, "scaleX") : () => {};
        // Die Sammelform quickSetter(el, "scale") schrieb im Test nichts auf das
        // Element; die Einzelachsen laufen über denselben Pfad wie das
        // nachweislich funktionierende "x" der Icon-Kacheln.
        const setScaleX = scalers.map((element) => gsap.quickSetter(element, "scaleX"));
        const setScaleY = scalers.map((element) => gsap.quickSetter(element, "scaleY"));
        const setIcon = icons.map((element) => gsap.quickSetter(element, "x", "px"));

        const render = (progress: number): void => {
          const head = progress * (stepCount - 1);

          expectedLeft = progress * travel;
          viewport.scrollLeft = expectedLeft;
          setFill(progress);

          for (let index = 0; index < columns.length; index += 1) {
            const scale = cardScale(index, head);
            setScaleX[index]?.(scale);
            setScaleY[index]?.(scale);
            setIcon[index]?.(iconShift(index, head));
          }

          // Attributschreibvorgänge nur beim Kartenwechsel – höchstens sechsmal
          // über die ganze Strecke statt sechzigmal pro Sekunde.
          const next = activeIndex(head, stepCount);
          if (next === currentIndex) return;
          currentIndex = next;
          nodes.forEach((node, index) => {
            node.dataset.active = String(index === next);
          });
          columns.forEach((column, index) => {
            if (index === next) column.setAttribute("aria-current", "step");
            else column.removeAttribute("aria-current");
          });
          if (counter) counter.textContent = String(next + 1);
        };

        measure();

        const trigger = ScrollTrigger.create({
          trigger: runway,
          start: () => `top ${stageTop}px`,
          end: () => `+=${extra}`,
          scrub: 0.5,
          invalidateOnRefresh: true,
          // onRefreshInit, NICHT onRefresh: der Rückruf muss VOR der Auswertung
          // von start/end laufen, sonst rechnet jeder Resize mit den Massen des
          // vorherigen Fensters – die Bühne löst dann zu früh oder zu spät.
          onRefreshInit: measure,
          onUpdate: (self) => render(self.progress),
        });

        // Nicht hart 0: wer die Seite mitten in der Sektion lädt oder per
        // Sprungmarke einsteigt, sähe sonst Schritt 1 bei leerer Schiene, bis
        // er selbst scrollt – onUpdate feuert nur bei Fortschrittsänderung.
        render(trigger.progress);
      }, runway);

      viewport.setAttribute("role", "group");
      viewport.setAttribute("tabindex", "0");
      viewport.setAttribute(
        "aria-label",
        "Prozessschritte – horizontal scrollbar, mit den Pfeiltasten wechseln",
      );

      // Nachladende Schriften ändern die Kartenhöhe und damit die Messwerte.
      document.fonts?.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
    };

    const stop = (): void => {
      if (!context) return;
      context.revert();
      context = undefined;

      // revert() erwischt Tweens und Trigger. scrollLeft ist aber eine
      // Property und keine Stilangabe, und quickSetter-Schreibvorgänge sind
      // keine Tweens – beides muss von Hand zurück.
      viewport.scrollLeft = 0;
      runway.querySelectorAll<HTMLElement>("[data-scale], [data-icon]").forEach((element) => {
        element.style.transform = "";
      });
      runway.querySelectorAll<HTMLElement>("[data-node]").forEach((node) => {
        node.dataset.active = "false";
      });
      runway.querySelectorAll("[aria-current]").forEach((element) => {
        element.removeAttribute("aria-current");
      });
      runway.querySelector("[data-step]")?.setAttribute("aria-current", "step");

      viewport.removeAttribute("role");
      viewport.removeAttribute("tabindex");
      viewport.removeAttribute("aria-label");
      currentIndex = -1;
    };

    /* ------------------------------------------------------ Selbstheilung */

    // Fremde Bewegung des Containers – Strg+F, Fokus-scrollIntoView,
    // Screenreader-Cursor, Trackpad-Wisch, Pfeiltasten – wird in Seitenscroll
    // übersetzt. Das konvergiert: window.scrollTo löst ein Update aus, render
    // schreibt denselben scrollLeft zurück, das nächste Ereignis hat Delta 0.
    const onViewportScroll = () => {
      if (!context || travel <= 0) return;
      if (Math.abs(viewport.scrollLeft - expectedLeft) < 2) return;
      window.scrollTo({ top: pageScrollFor(viewport.scrollLeft, travel, extra, pinStart) });
    };
    viewport.addEventListener("scroll", onViewportScroll, { passive: true });

    let resizeTimer: number | undefined;
    const onModeChange = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (isPinned()) void start();
        else stop();
      }, 150);
    };
    window.addEventListener("resize", onModeChange);

    // Der Modus hängt nicht nur an der Fenstergrösse: schaltet jemand während
    // des Besuchs auf reduzierte Bewegung oder wechselt das Zeigegerät, fällt
    // die Sektion ins Raster zurück – ohne diesen Draht liefe der Trigger
    // weiter und liesse die Karten im statischen Raster pulsieren.
    const modeQueries = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(pointer: fine)"),
    ];
    modeQueries.forEach((query) => query.addEventListener("change", onModeChange));

    if (isPinned()) void start();

    return () => {
      cancelled = true;
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onModeChange);
      modeQueries.forEach((query) => query.removeEventListener("change", onModeChange));
      viewport.removeEventListener("scroll", onViewportScroll);
      observer?.disconnect();
      stop();
    };
  }, [stepCount]);

  return (
    <div
      ref={runwayRef}
      data-wf-runway
      className="wf-runway relative mt-14 md:mt-16"
      style={{ "--wf-count": String(stepCount) } as CSSProperties}
    >
      <div ref={stageRef} data-wf-stage className="wf-stage">
        <div
          ref={viewportRef}
          data-wf-viewport
          className="wf-viewport scrollbar-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500/60"
        >
          <div className="wf-inner">
            <span aria-hidden className="wf-rail">
              <span className="wf-rail-base absolute inset-0 rounded-full bg-slate-200" />
              <span
                data-fill
                className="wf-rail-fill absolute inset-0 origin-left rounded-full bg-gradient-to-r from-indigo-500 to-violet-600"
                style={{ transform: "scaleX(0)" }}
              />
            </span>

            <ol
              data-wf-track
              className="wf-track page-container grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {children}
            </ol>
          </div>
        </div>

        <p
          aria-hidden
          className="wf-counter mt-6 pl-[var(--wf-pad)] text-xs font-bold uppercase tracking-wider text-slate-400"
        >
          <span data-count className="text-indigo-600">
            1
          </span>{" "}
          / {stepCount}
        </p>
      </div>
    </div>
  );
}
