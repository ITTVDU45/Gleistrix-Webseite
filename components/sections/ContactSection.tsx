"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
const Squares = dynamic(() => import("@/components/visuals/Squares"), { ssr: false });

export default function ContactSection() {
  const contacts = [
    {
      name: "Tolgahan Vardar",
      role: "Ansprechpartner",
      phone: "+49 160 0000000",
      email: "hello@gleistrix.com",
      photo: "/Tolgahan%20Vardar.jpeg",
    },
  ];

  return (
    <section className="relative w-full py-20 bg-gradient-to-b from-gray-900 to-slate-900 overflow-hidden" id="kontakt">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Squares direction="diagonal" speed={0.4} squareSize={48} borderColor="#223" hoverFillColor="#0b1020" />
      </div>
      <div className="page-container relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-white">Kontakt</h2>
          <p className="text-white/80">Wir helfen Ihnen gerne weiter</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map((c) => (
            <motion.div
              key={c.email}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full ring-1 ring-white/20 bg-white/10">
                  <Image src={c.photo} alt={c.name} fill className="object-contain p-2" />
                </div>
                <div>
                  <div className="text-white font-semibold">{c.name}</div>
                  <div className="text-white/80 text-sm">{c.role}</div>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <a href={`tel:${c.phone.replace(/[^+\d]/g, "")}`} className="block text-white hover:underline">
                  {c.phone}
                </a>
                <a href={`mailto:${c.email}`} className="block text-white hover:underline break-all">
                  {c.email}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


