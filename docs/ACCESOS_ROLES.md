# ACCESOS POR ROL - Chiclayo Propiedades

**URL Producción:** https://chiclayo-propiedades.vercel.app

---

## ADMIN (Administrador)

**Acceso:** `/admin`
**Credenciales de prueba:** test@chiclayopropiedades.com / Test1234!

| Página | Ruta | Qué puede hacer |
|--------|------|-----------------|
| Dashboard Admin | `/admin` | Vista general con estadísticas |
| Usuarios | `/admin/usuarios` | Ver, editar roles, activar/desactivar usuarios |
| Propiedades | `/admin/propiedades` | Ver todas las propiedades de todos los agentes, editar, eliminar |
| Leads/Consultas | `/admin/leads` | Ver todas las consultas recibidas, cambiar estado (nueva/contactada/cerrada) |
| Blog | `/admin/blog` | Crear, editar, eliminar artículos del blog |
| Capacitaciones | `/admin/capacitaciones` | Crear, editar, eliminar cursos/capacitaciones |
| Servicios | `/admin/servicios` | Editar servicios que se muestran en la web |
| **Ranking** | `/admin/ranking` | **Aprobar/rechazar ventas**, recalcular ranking, ver historial |

### Flujo de aprobación de ventas (NUEVO):
1. El asesor marca una propiedad como "vendida" con el precio de venta
2. La venta aparece en **Admin > Ranking > "Ventas pendientes de aprobación"**
3. El admin verifica y hace click en **Aprobar** o **Rechazar**
4. Al aprobar, el ranking se recalcula automáticamente

---

## ASESOR / VENDEDOR (Agente Inmobiliario)

**Acceso:** `/dashboard`
**Rol en DB:** `agent`

| Página | Ruta | Qué puede hacer |
|--------|------|-----------------|
| Dashboard | `/dashboard` | Ver estadísticas personales (propiedades, leads, inscripciones) |
| Mis Propiedades | `/dashboard/propiedades` | Ver sus propiedades publicadas, estado de cada una |
| Nueva Propiedad | `/dashboard/propiedades/nueva` | Publicar nueva propiedad (título, precio, fotos, ubicación) |
| Editar Propiedad | `/dashboard/propiedades/[id]/editar` | Modificar datos de una propiedad existente |
| Mis Leads | `/dashboard/leads` | Ver consultas recibidas por sus propiedades |
| Mi Perfil | `/dashboard/perfil` | Editar nombre, teléfono, bio, foto de perfil |
| Mis Capacitaciones | `/dashboard/capacitaciones` | Ver capacitaciones en las que está inscrito |

### Acciones especiales del asesor:
- **Marcar propiedad como vendida:** Botón "Marcar vendida" en la lista de propiedades → ingresa precio real de venta → queda pendiente de aprobación del admin
- **Aparecer en ranking:** Su posición se basa en el monto total de ventas aprobadas

---

## COMPRADOR / VISITANTE (Usuario no registrado)

**Acceso:** Páginas públicas (no requiere login)

| Página | Ruta | Qué puede hacer |
|--------|------|-----------------|
| Home | `/` | Ver secciones: hero, about, propiedades destacadas, ranking, capacitaciones, blog, newsletter |
| Propiedades | `/propiedades` | Buscar y filtrar propiedades (tipo, precio, ubicación, operación) |
| Detalle Propiedad | `/propiedades/[slug]` | Ver fotos, datos completos, ubicación, contactar al asesor |
| Blog | `/blog` | Leer artículos inmobiliarios |
| Detalle Blog | `/blog/[slug]` | Leer artículo completo |
| Capacitaciones | `/capacitaciones` | Ver catálogo de cursos disponibles |
| Detalle Capacitación | `/capacitaciones/[slug]` | Ver detalles del curso, precio, inscribirse (Stripe pendiente) |
| Ranking | `/ranking` | Ver ranking de asesores por ventas cerradas |
| Servicios | `/servicios` | Ver servicios ofrecidos por la empresa |
| Contacto | `/contacto` | Enviar consulta general vía formulario |

### Acciones del comprador:
- **Contactar asesor:** Formulario en la página de detalle de propiedad o botón de WhatsApp
- **Registrarse:** Puede crear cuenta para acceder al dashboard (se convierte en usuario registrado)

---

## USUARIO REGISTRADO (Rol: user)

**Acceso:** `/dashboard` (funcionalidad limitada vs asesor)
**Se registra en:** `/signup`

| Página | Ruta | Qué puede hacer |
|--------|------|-----------------|
| Dashboard | `/dashboard` | Ver estadísticas básicas |
| Mi Perfil | `/dashboard/perfil` | Editar sus datos personales |
| Mis Capacitaciones | `/dashboard/capacitaciones` | Ver cursos en los que se inscribió |

**Nota:** Un usuario normal NO puede publicar propiedades ni ver leads. Para eso debe ser promovido a `agent` por un admin.

---

## AUTH (Autenticación)

| Página | Ruta | Función |
|--------|------|---------|
| Login | `/login` | Iniciar sesión con email/password |
| Registro | `/signup` | Crear cuenta nueva (verificación por email) |
| Recuperar contraseña | `/password-recovery` | Solicitar reset de contraseña |
| Verificar email | `/verify-email` | Confirmar registro (link del email) |

---

## RESUMEN DE PROTECCIÓN DE RUTAS

| Ruta | Requiere login | Requiere rol |
|------|---------------|-------------|
| `/` (home y públicas) | ❌ | — |
| `/login`, `/signup` | ❌ (redirige a dashboard si ya está logueado) | — |
| `/dashboard/*` | ✅ | user, agent, o admin |
| `/admin/*` | ✅ | solo admin |

---

**Middleware:** `src/middleware.ts` verifica JWT en cada request y redirige según corresponda.
