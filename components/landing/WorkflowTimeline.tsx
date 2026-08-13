"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

import { activeIndex, cardScale, iconShift, pageScrollFor } from "./workflow-timeline.math";

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

    const isPinned = () => getComputedStyle(stage).position === "sticky";

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let observer: IntersectionObserver | undefined;
    if (!reduced) {
      runway.dataset.anim = "1";
      const rect = runway.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80 && rect.bottom > 80) runway.dataset.in = "1";

      observer = new IntersectionObserver(
        (entries) => {
          if (!entries[0]?.isIntersecting) return;
          runway.dataset.in = "1";
          observer?.disconnect();
        },
        { rootMargin: "-80px" },
      );
      observer.observe(runway);
    }

    const measure = (): void => {
      stageTop = parseFloat(getComputedStyle(stage).top) || 0;
      extra = runway.clientHeight - stage.clientHeight;
      travel = viewport.scrollWidth - viewport.clientWidth;
      pinStart = runway.getBoundingClientRect().top + window.scrollY - stageTop;
    };

    const start = async (): Promise<void> => {
      if (context || !isPinned()) return;

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || context || !isPinned()) return;
      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        const columns = gsap.utils.toArray<HTMLElement>("[data-step]", runway);
        const scalers = gsap.utils.toArray<HTMLElement>("[data-scale]", runway);
        const icons = gsap.utils.toArray<HTMLElement>("[data-icon]", runway);
        const nodes = gsap.utils.toArray<HTMLElement>("[data-node]", runway);
        const counter = runway.querySelector<HTMLElement>("[data-count]");
        const fill = runway.querySelector<HTMLElement>("[data-fill]");

        const setFill = fill ? gsap.quickSetter(fill, "scaleX") : () => {};
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
          onRefreshInit: measure,
          onUpdate: (self) => render(self.progress),
        });

        render(trigger.progress);
      }, runway);

      viewport.setAttribute("role", "group");
      viewport.setAttribute("tabindex", "0");
      viewport.setAttribute(
        "aria-label",
        "Prozessschritte – horizontal scrollbar, mit den Pfeiltasten wechseln",
      );

      document.fonts?.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
    };

    const stop = (): void => {
      if (!context) return;
      context.revert();
      context = undefined;

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

      // Mobil bleibt der Container ein echtes, per Touch bedienbares Karussell.
      // Deshalb entfernen wir die ARIA-Rolle nur auf Desktop/Tablet wieder.
      if (window.matchMedia("(min-width: 768px)").matches) {
        viewport.removeAttribute("role");
        viewport.removeAttribute("tabindex");
        viewport.removeAttribute("aria-label");
      }
      currentIndex = -1;
    };

    // Auf Smartphones ist die Timeline ein natives Scroll-Snap-Karussell.
    // Dort braucht es keinerlei GSAP: Wischen, Momentum und Snap übernimmt der Browser.
    if (window.matchMedia("(max-width: 767px)").matches) {
      viewport.setAttribute("role", "region");
      viewport.setAttribute("tabindex", "0");
      viewport.setAttribute("aria-label", "So arbeitet Gleistrix – Prozessschritte als Karussell");
    }

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
        if (window.matchMedia("(max-width: 767px)").matches) {
          stop();
          viewport.setAttribute("role", "region");
          viewport.setAttribute("tabindex", "0");
          viewport.setAttribute("aria-label", "So arbeitet Gleistrix – Prozessschritte als Karussell");
        } else if (isPinned()) {
          void start();
        } else {
          stop();
        }
      }, 150);
    };
    window.addEventListener("resize", onModeChange);

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
      className="wf-runway relative mt-8 md:mt-10"
      style={{ "--wf-count": String(stepCount) } as CSSProperties}
    >
      <div ref={stageRef} data-wf-stage className="wf-stage">
        <div
          ref={viewportRef}
          data-wf-viewport
          className="wf-viewport scrollbar-none max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:overscroll-x-contain max-md:scroll-px-4 max-md:px-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500/60"
        >
          <div className="wf-inner max-md:w-max">
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
              className="wf-track page-container max-md:flex max-md:w-max max-md:gap-4 md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-3"
            >
              {children}
            </ol>
          </div>
        </div>

        <div className="page-container mt-4 flex items-center justify-between md:hidden">
          {/* slate-600 statt -500: der Abschnitt liegt auf #f3f6fb, dort
              erreicht slate-500 nur 4,39:1 und verfehlt den Grenzwert. */}
          <p className="text-xs font-semibold text-slate-600">Seitlich wischen</p>
          <div aria-hidden className="flex items-center gap-1.5">
            {Array.from({ length: stepCount }).map((_, index) => (
              <span
                key={index}
                className={index === 0 ? "h-1.5 w-5 rounded-full bg-indigo-600" : "h-1.5 w-1.5 rounded-full bg-slate-300"}
              />
            ))}
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
