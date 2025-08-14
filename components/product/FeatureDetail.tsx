import Link from "next/link";
import Image from "next/image";

export type FeatureDetailProps = {
  title: string;
  description: string;
  imageSrc: string;
  backHref?: string;
};

export default function FeatureDetail({ title, description, imageSrc, backHref = "/produkt#features" }: FeatureDetailProps) {
  return (
    <div className="relative z-10">
      {/* Back link */}
      <section className="page-container pt-28 md:pt-32 pb-6">
        <Link href={backHref} className="inline-flex text-sm text-white/85 hover:text-white underline underline-offset-4">
          ← zurück zu den Funktionen
        </Link>
      </section>

      {/* Intro grid */}
      <section className="page-container pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-500 to-violet-600">
              {title}
            </h1>
            <p className="mt-4 text-white/90 text-base sm:text-lg leading-relaxed max-w-2xl">{description}</p>
          </div>
          <div>
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-white/5">
              <Image src={imageSrc} alt={title} fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}






