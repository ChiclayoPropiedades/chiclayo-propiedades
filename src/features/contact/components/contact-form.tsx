"use client";

import { useRef, useState, useTransition } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { submitInquiry } from "../services/submit-inquiry";

type SubmitState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await submitInquiry(formData);
      if (result.success) {
        setSubmitState({ status: "success" });
        formRef.current?.reset();
      } else {
        setSubmitState({
          status: "error",
          message: result.error ?? "Ocurrió un error inesperado. Intenta de nuevo.",
        });
      }
    });
  }

  if (submitState.status === "success") {
    return (
      <div
        className="flex flex-col items-center gap-4 py-12 text-center"
        role="status"
        aria-live="polite"
      >
        <CheckCircle className="size-14 text-emerald-500" aria-hidden="true" />
        <div>
          <h3 className="text-lg font-semibold text-[#1f2937]">
            ¡Mensaje enviado con éxito!
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Nos pondremos en contacto contigo a la brevedad posible.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSubmitState({ status: "idle" })}
          className="mt-2 text-sm font-medium text-[#2563eb] hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50 rounded"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
      noValidate
      aria-label="Formulario de contacto"
    >
      <h2 className="text-xl font-bold text-[#1f2937]">Envíanos un mensaje</h2>

      {/* Error global */}
      {submitState.status === "error" && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{submitState.message}</span>
        </div>
      )}

      {/* Nombre completo */}
      <div>
        <label
          htmlFor="contact-name"
          className="mb-1.5 block text-sm font-medium text-[#1f2937]"
        >
          Nombre completo <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Tu nombre completo"
          className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-[#1f2937] placeholder:text-gray-400 outline-none transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 disabled:opacity-60"
          disabled={isPending}
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="contact-email"
          className="mb-1.5 block text-sm font-medium text-[#1f2937]"
        >
          Correo electrónico <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@email.com"
          className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-[#1f2937] placeholder:text-gray-400 outline-none transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 disabled:opacity-60"
          disabled={isPending}
        />
      </div>

      {/* Asunto */}
      <div>
        <label
          htmlFor="contact-subject"
          className="mb-1.5 block text-sm font-medium text-[#1f2937]"
        >
          Asunto <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          required
          placeholder="¿En qué podemos ayudarte?"
          className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-[#1f2937] placeholder:text-gray-400 outline-none transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 disabled:opacity-60"
          disabled={isPending}
        />
      </div>

      {/* Mensaje */}
      <div>
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-sm font-medium text-[#1f2937]"
        >
          Mensaje <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Escribe tu mensaje aquí..."
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-[#1f2937] placeholder:text-gray-400 outline-none transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 disabled:opacity-60"
          disabled={isPending}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#2563eb] text-sm font-semibold text-white transition-colors hover:bg-[#1e40af] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50 disabled:opacity-60"
      >
        {isPending ? (
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
            Enviar Mensaje
          </>
        )}
      </button>
    </form>
  );
}
