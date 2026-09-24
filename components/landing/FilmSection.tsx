import Reveal from "./Reveal";

/**
 * Produktfilm direkt unter dem Hero. preload="none" plus Poster: der Film
 * (~3 Min.) lädt erst beim Abspielen und belastet LCP der Startseite nicht.
 */
export default function FilmSection() {
  return (
    <section
      aria-labelledby="film-heading"
      className="border-b border-slate-900/6 bg-white py-16 md:py-20"
    >
      <div className="page-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
            Gleistrix im Film
          </span>
          <h2
            id="film-heading"
            className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Gleistrix in drei Minuten
          </h2>
        </Reveal>

        <Reveal delay={0.12} className="mx-auto mt-10 max-w-5xl">
          <video
            controls
            playsInline
            preload="none"
            poster="/media/video/gleistrix-film-poster.webp"
            width={1920}
            height={1080}
            className="aspect-video w-full rounded-2xl bg-slate-900 shadow-soft-sm"
          >
            <source src="/media/video/gleistrix-film.mp4" type="video/mp4" />
          </video>
        </Reveal>
      </div>
    </section>
  );
}
