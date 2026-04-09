import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GraduationCap, ExternalLink } from "lucide-react";
import { createClient } from "@/shared/lib/supabase/server";
import { formatPrice } from "@/shared/lib/format";

export const metadata: Metadata = {
  title: "Mis Capacitaciones",
};

export default async function MisCapacitacionesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) redirect("/login");

  const { data: enrollments } = await supabase
    .from("training_enrollments")
    .select("id, payment_status, enrolled_at, amount_paid, training:trainings(id, title, slug, price, currency, modality, instructor)")
    .eq("user_id", profile.id)
    .order("enrolled_at", { ascending: false });

  const myEnrollments = enrollments ?? [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">Mis Capacitaciones</h1>
          <p className="text-sm text-gray-500">
            Cursos y talleres en los que estás inscrito
          </p>
        </div>
        <Link
          href="/capacitaciones"
          className="inline-flex items-center gap-2 rounded-lg border border-[#2563eb] px-4 py-2 text-sm font-medium text-[#2563eb] transition-colors hover:bg-[#2563eb] hover:text-white"
        >
          Ver catálogo
          <ExternalLink className="size-4" />
        </Link>
      </div>

      {myEnrollments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16">
          <GraduationCap className="mb-4 size-12 text-gray-300" />
          <h2 className="text-lg font-semibold text-[#1f2937]">
            No tienes capacitaciones
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Explora nuestro catálogo de cursos y talleres especializados
          </p>
          <Link
            href="/capacitaciones"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1e40af]"
          >
            <GraduationCap className="size-4" />
            Explorar Capacitaciones
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {myEnrollments.map((enrollment) => {
            const training = Array.isArray(enrollment.training)
              ? enrollment.training[0]
              : enrollment.training;

            return (
              <div
                key={enrollment.id}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[#1f2937]">
                    {training?.title ?? "Capacitación"}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    {training?.instructor && (
                      <span>Instructor: {training.instructor}</span>
                    )}
                    {training?.modality && (
                      <span className="capitalize">{training.modality}</span>
                    )}
                    <span>
                      Inscrito:{" "}
                      {new Intl.DateTimeFormat("es-PE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(enrollment.enrolled_at))}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      enrollment.payment_status === "completed"
                        ? "bg-green-100 text-green-700"
                        : enrollment.payment_status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {enrollment.payment_status === "completed"
                      ? "Pagado"
                      : enrollment.payment_status === "pending"
                      ? "Pendiente"
                      : "Fallido"}
                  </span>
                  {training?.slug && (
                    <Link
                      href={`/capacitaciones/${training.slug}`}
                      className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#2563eb]"
                    >
                      <ExternalLink className="size-4" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
