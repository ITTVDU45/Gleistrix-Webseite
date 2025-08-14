"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: result.message });
        // Reset form on success
        e.currentTarget.reset();
      } else {
        setMessage({ type: 'error', text: result.error || 'Ein Fehler ist aufgetreten.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="text-white">Name</Label>
          <Input id="name" name="name" placeholder="Ihr Name" className="mt-1 bg-white/5 text-white border-white/10 placeholder-white/60" required />
        </div>
        <div>
          <Label htmlFor="phone" className="text-white">Telefon</Label>
          <Input id="phone" name="phone" placeholder="+49 …" className="mt-1 bg-white/5 text-white border-white/10 placeholder-white/60" />
        </div>
      </div>
      <div>
        <Label htmlFor="email" className="text-white">E‑Mail</Label>
        <Input id="email" type="email" name="email" placeholder="name@firma.de" className="mt-1 bg-white/5 text-white border-white/10 placeholder-white/60" required />
      </div>
      <div>
        <Label htmlFor="message" className="text-white">Nachricht</Label>
        <textarea id="message" name="message" rows={5} placeholder="Worum geht es?"
          className="mt-1 block w-full rounded-md bg-white/5 text-white placeholder-white/60 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30" required />
      </div>
      {/* Success/Error Messages */}
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
            : 'bg-red-500/20 border border-red-500/30 text-red-300'
        }`}>
          {message.text}
        </div>
      )}

      <div className="pt-2">
        <Button type="submit" disabled={submitting} aria-label="Nachricht senden"
          className="bg-gradient-to-r from-sky-400 via-blue-600 to-violet-600 text-white hover:brightness-110">
          {submitting ? "Senden …" : "Nachricht senden"}
        </Button>
      </div>
    </form>
  );
}


