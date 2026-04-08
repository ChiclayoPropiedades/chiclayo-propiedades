"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

interface ContactFormProps {
  propertyTitle: string;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export function ContactForm({ propertyTitle }: ContactFormProps) {
  const [form, setForm] = useState<FormState>({
    ...initialState,
    message: `Hola, estoy interesado en la propiedad "${propertyTitle}". ¿Podría brindarme más información?`,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending — replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle
          className="size-12 text-emerald-500"
          aria-hidden="true"
        />
        <h3 className="font-semibold text-[#1f2937]">
          ¡Mensaje enviado!
        </h3>
        <p className="text-sm text-gray-500">
          Un asesor se pondrá en contacto contigo pronto.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-2 text-sm font-medium text-[#2563eb] hover:underline underline-offset-2"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
      <div>
        <label
          htmlFor="contact-name"
          className="mb-1 block text-xs font-medium text-[#1f2937]"
        >
          Nombre completo <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          placeholder="Tu nombre"
          className="h-9 w-full rounded-lg border border-gray-200 px-3 text-sm text-[#1f2937] placeholder:text-gray-400 outline-none transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="mb-1 block text-xs font-medium text-[#1f2937]"
        >
          Correo electrónico <span aria-hidden="true">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="tu@email.com"
          className="h-9 w-full rounded-lg border border-gray-200 px-3 text-sm text-[#1f2937] placeholder:text-gray-400 outline-none transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
        />
      </div>

      <div>
        <label
          htmlFor="contact-phone"
          className="mb-1 block text-xs font-medium text-[#1f2937]"
        >
          Teléfono
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="+51 999 999 999"
          className="h-9 w-full rounded-lg border border-gray-200 px-3 text-sm text-[#1f2937] placeholder:text-gray-400 outline-none transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-1 block text-xs font-medium text-[#1f2937]"
        >
          Mensaje <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          value={form.message}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#1f2937] placeholder:text-gray-400 outline-none transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#2563eb] text-sm font-semibold text-white transition-colors hover:bg-[#1e40af] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50 disabled:opacity-60"
      >
        {loading ? (
          <>
            <span
              className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"
              aria-hidden="true"
            />
            Enviando...
          </>
        ) : (
          <>
            <Send className="size-4" aria-hidden="true" />
            Enviar consulta
          </>
        )}
      </button>
    </form>
  );
}
