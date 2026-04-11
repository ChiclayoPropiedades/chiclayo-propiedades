import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad",
};

export default function PrivacidadPage() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#1f2937]">
          Política de Privacidad
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Última actualización: Abril 2026
        </p>

        <div className="prose prose-gray mt-8 max-w-none">
          <h2>1. Información que recopilamos</h2>
          <p>
            En Chiclayo Propiedades recopilamos la información que nos
            proporcionas voluntariamente al registrarte, publicar propiedades o
            contactar a un asesor. Esto incluye: nombre completo, correo
            electrónico, número de teléfono y datos de las propiedades
            publicadas.
          </p>

          <h2>2. Uso de la información</h2>
          <p>Utilizamos tu información para:</p>
          <ul>
            <li>Gestionar tu cuenta en la plataforma</li>
            <li>Conectar compradores con asesores inmobiliarios</li>
            <li>Procesar inscripciones y pagos de capacitaciones</li>
            <li>Enviar notificaciones relacionadas con tu actividad</li>
            <li>Mejorar nuestros servicios</li>
          </ul>

          <h2>3. Protección de datos</h2>
          <p>
            Tus datos se almacenan de forma segura en servidores protegidos.
            Utilizamos cifrado SSL para todas las comunicaciones y no
            compartimos tu información personal con terceros sin tu
            consentimiento.
          </p>

          <h2>4. Cookies</h2>
          <p>
            Utilizamos cookies esenciales para el funcionamiento de la
            plataforma, como la autenticación de usuario. No utilizamos cookies
            de seguimiento ni publicidad.
          </p>

          <h2>5. Derechos del usuario</h2>
          <p>
            Tienes derecho a acceder, rectificar o eliminar tus datos
            personales. Para ejercer estos derechos, contacta a{" "}
            <a href="mailto:info@chiclayopropiedades.com">
              info@chiclayopropiedades.com
            </a>
            .
          </p>

          <h2>6. Contacto</h2>
          <p>
            Para consultas sobre privacidad, escríbenos a{" "}
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
