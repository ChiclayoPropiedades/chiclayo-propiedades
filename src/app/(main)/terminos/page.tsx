import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos de Servicio",
};

export default function TerminosPage() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#1f2937]">
          Términos de Servicio
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Última actualización: Abril 2026
        </p>

        <div className="prose prose-gray mt-8 max-w-none">
          <h2>1. Aceptación de los términos</h2>
          <p>
            Al acceder y utilizar la plataforma Chiclayo Propiedades, aceptas
            estos términos de servicio. Si no estás de acuerdo, no utilices la
            plataforma.
          </p>

          <h2>2. Servicios ofrecidos</h2>
          <p>Chiclayo Propiedades es una plataforma que permite:</p>
          <ul>
            <li>Publicar y buscar propiedades inmobiliarias</li>
            <li>Conectar compradores con asesores inmobiliarios</li>
            <li>Inscribirse en capacitaciones y cursos</li>
            <li>Acceder a información y servicios inmobiliarios</li>
          </ul>

          <h2>3. Registro de usuarios</h2>
          <p>
            Para acceder a funciones como publicar propiedades o inscribirte en
            capacitaciones, debes crear una cuenta proporcionando información
            veraz y actualizada. Eres responsable de mantener la
            confidencialidad de tus credenciales.
          </p>

          <h2>4. Publicación de propiedades</h2>
          <p>
            Los asesores son responsables de la veracidad de la información y
            las imágenes publicadas. Chiclayo Propiedades se reserva el derecho
            de eliminar publicaciones que contengan información falsa o
            engañosa.
          </p>

          <h2>5. Pagos y capacitaciones</h2>
          <p>
            Los pagos por capacitaciones se procesan a través de Stripe, una
            plataforma segura de pagos. Las políticas de reembolso se manejan
            caso por caso contactando al administrador.
          </p>

          <h2>6. Ranking de asesores</h2>
          <p>
            El ranking se basa en ventas cerradas y aprobadas por la
            administración. La posición se determina por el monto total de
            ventas. Chiclayo Propiedades se reserva el derecho de verificar
            todas las ventas reportadas.
          </p>

          <h2>7. Limitación de responsabilidad</h2>
          <p>
            Chiclayo Propiedades actúa como intermediario entre compradores y
            asesores. No somos responsables de las transacciones realizadas
            fuera de la plataforma ni de la veracidad de la información
            proporcionada por terceros.
          </p>

          <h2>8. Contacto</h2>
          <p>
            Para consultas sobre estos términos, escríbenos a{" "}
            <a href="mailto:info@chiclayopropiedades.com">
              info@chiclayopropiedades.com
            </a>{" "}
            o llámanos al{" "}
            <a href="tel:+51928216206">+51 928 216 206</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
