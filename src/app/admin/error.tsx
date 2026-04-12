"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-2 text-2xl font-bold text-gray-900">
        Error en administración
      </h2>
      <p className="mb-6 text-gray-600">
        Ocurrió un error al cargar esta sección. Por favor intenta de nuevo.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
