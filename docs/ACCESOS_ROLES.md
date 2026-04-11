# ACCESOS POR ROL - Chiclayo Propiedades

**URL Producción:** https://chiclayo-propiedades.vercel.app

---

## CREDENCIALES DE PRUEBA

| Rol | Email | Password | Nombre |
|-----|-------|----------|--------|
| **Superadmin** | test@chiclayopropiedades.com | Test1234! | Test Admin Chiclayo |
| **Superadmin** | casagrandegrupoinmobiliario@gmail.com | (la de la dueña) | Maired |
| **Agente** | agente@chiclayopropiedades.com | Agente1234! | Carlos Mendoza Rivera |
| **Agente** | (registrado manualmente) | — | Jorge Luis Silva Laredo |
| **Comprador (user)** | comprador@chiclayopropiedades.com | Comprador1234! | María López Torres |

---

## SUPERADMIN (Propietario de la plataforma)

**Acceso:** Control total. Ve y gestiona TODO.
**Credenciales:** test@chiclayopropiedades.com / Test1234!
**Redirige después del login a:** `/admin`

### Sidebar del Superadmin
| Sección | Ruta | Qué puede hacer |
|---------|------|-----------------|
| Dashboard | `/admin` | Métricas: usuarios, propiedades, leads, finanzas + gráficas |
| Usuarios | `/admin/usuarios` | Crear, editar roles, activar/desactivar, ver detalle (propiedades/leads/ventas) |
| Propiedades | `/admin/propiedades` | Ver todas (cards con fotos + tabla), editar, eliminar, destacar |
| Leads | `/admin/leads` | Ver todas las consultas, cambiar estado |
| Blog | `/admin/blog` | Crear, editar, eliminar artículos (con upload de imágenes) |
| Capacitaciones | `/admin/capacitaciones` | Crear, editar, eliminar cursos (con upload de imagen de portada) |
| Servicios | `/admin/servicios` | Editar servicios de la web |
| Ranking | `/admin/ranking` | Aprobar/rechazar ventas, recalcular ranking |
| Finanzas | `/admin/finanzas` | Ingresos totales, comisiones, ventas detalladas, suscripciones, pagos capacitaciones |
| Configuración | `/admin/configuracion` | Comisión (%), tasa USD/PEN, precio suscripción agente |
| Mi Perfil | `/dashboard/perfil` | Editar datos personales |

### Acciones exclusivas del superadmin:
- **Crear usuarios** desde el panel (email, nombre, rol, teléfono)
- **Aprobar/rechazar ventas** de los agentes
- **Activar suscripciones manualmente** (dar acceso a agentes sin cobro)
- **Configurar precio de suscripción anual** para agentes
- **Configurar comisión %** sobre ventas
- **Publicar propiedades sin suscripción** (no tiene restricción)

### Flujo de aprobación de ventas:
1. Agente marca propiedad como "vendida" con precio de venta
2. Aparece en **Ranking > "Ventas pendientes de aprobación"**
3. Admin verifica documentos (presencial o WhatsApp)
4. Admin aprueba → comisión se calcula automáticamente → ranking se recalcula
5. Se ve en **Finanzas** con todo el detalle

---

## AGENTE / ASESOR INMOBILIARIO

**Acceso:** `/dashboard` (funcionalidad limitada a sus propios datos)
**Credenciales:** agente@chiclayopropiedades.com / Agente1234!
**Rol en DB:** `agent`
**Redirige después del login a:** `/dashboard`

### Sidebar del Agente
| Sección | Ruta | Qué puede hacer |
|---------|------|-----------------|
| Resumen | `/dashboard` | Stats personales: propiedades, consultas, capacitaciones |
| Mis Propiedades | `/dashboard/propiedades` | Ver SUS propiedades publicadas con fotos |
| Mis Consultas | `/dashboard/leads` | Ver leads recibidos por sus propiedades |
| Mi Perfil | `/dashboard/perfil` | Editar nombre, teléfono, bio, foto |
| Mis Capacitaciones | `/dashboard/capacitaciones` | Ver cursos inscritos |

### Suscripción anual (OBLIGATORIA para publicar):
- **Precio:** S/ 99/año (configurable por admin)
- Al intentar crear propiedad sin suscripción → ve pantalla de pago
- Paga por Stripe → suscripción activa por 365 días
- Si Stripe no está configurado → ve mensaje "Contacta al administrador"

### Acciones del agente:
- **Publicar propiedades** (solo con suscripción activa) con fotos, precio, ubicación
- **Editar/eliminar** solo SUS propiedades
- **Marcar propiedad como vendida** → ingresa precio real → queda pendiente de aprobación
- **Aparecer en ranking** basado en monto total de ventas aprobadas
- **Recibir leads** cuando compradores contactan por sus propiedades

### NO puede:
- Ver propiedades de otros agentes
- Aprobar ventas
- Acceder al panel admin
- Crear usuarios
- Publicar sin suscripción activa

---

## COMPRADOR / USUARIO REGISTRADO

**Acceso:** `/dashboard` (funcionalidad muy limitada)
**Credenciales:** comprador@chiclayopropiedades.com / Comprador1234!
**Rol en DB:** `user`
**Redirige después del login a:** `/dashboard`

### Sidebar del Usuario
| Sección | Ruta | Qué puede hacer |
|---------|------|-----------------|
| Resumen | `/dashboard` | Stats básicos |
| Mis Propiedades | `/dashboard/propiedades` | Vacío (no puede publicar) |
| Mis Consultas | `/dashboard/leads` | Vacío |
| Mi Perfil | `/dashboard/perfil` | Editar datos personales |
| Mis Capacitaciones | `/dashboard/capacitaciones` | Ver cursos pagados |

### Acciones del comprador:
- **Editar su perfil** (nombre, teléfono, bio, foto)
- **Ver capacitaciones** en las que se inscribió
- **Inscribirse en cursos** y pagar por Stripe

### NO puede:
- Publicar propiedades
- Ver leads
- Marcar ventas
- Para publicar → admin debe promoverlo a `agent`

---

## VISITANTE (No registrado)

**Acceso:** Solo páginas públicas (no requiere login)

| Página | Ruta | Qué puede hacer |
|--------|------|-----------------|
| Home | `/` | Ver hero, propiedades destacadas, ranking, capacitaciones, blog |
| Propiedades | `/propiedades` | Buscar con filtros (tipo, precio, ubicación, operación) |
| Detalle Propiedad | `/propiedades/[slug]` | Ver fotos, datos, ubicación, contactar asesor |
| Blog | `/blog` | Leer artículos |
| Detalle Blog | `/blog/[slug]` | Leer artículo completo |
| Capacitaciones | `/capacitaciones` | Ver catálogo de cursos |
| Detalle Capacitación | `/capacitaciones/[slug]` | Ver detalles, precio, inscribirse |
| Ranking | `/ranking` | Ver ranking de asesores |
| Servicios | `/servicios` | Ver servicios ofrecidos |
| Contacto | `/contacto` | Enviar consulta por formulario |
| Privacidad | `/privacidad` | Política de privacidad |
| Términos | `/terminos` | Términos de servicio |

### Acciones:
- **Contactar asesor** por formulario o WhatsApp
- **Registrarse** como usuario o agente en `/signup`

---

## AUTH (Autenticación)

| Página | Ruta | Función |
|--------|------|---------|
| Login | `/login` | Iniciar sesión (admin → `/admin`, otros → `/dashboard`) |
| Registro | `/signup` | Crear cuenta (elige: Usuario o Agente Inmobiliario) |
| Recuperar contraseña | `/password-recovery` | Solicitar reset |
| Verificar email | `/verify-email` | Confirmar registro |

---

## PROTECCIÓN DE RUTAS

| Ruta | Requiere login | Requiere rol |
|------|---------------|-------------|
| `/` (home y públicas) | ❌ | — |
| `/login`, `/signup` | ❌ (redirige si ya logueado) | — |
| `/dashboard/*` | ✅ | user, agent, o admin |
| `/admin/*` | ✅ | solo admin |

---

## FLUJO DE DINERO

| Ingreso | Cómo funciona | Cobro |
|---------|---------------|-------|
| **Suscripción agente** | Agente paga S/99/año para publicar | Automático (Stripe) |
| **Comisión por venta** | 5% sobre precio de venta aprobada | Manual (fuera de plataforma) |
| **Capacitaciones** | Usuario paga curso online | Automático (Stripe) |
| **Servicios B2B** | Empresa contacta por WhatsApp | Manual |

---

**Middleware:** `src/middleware.ts` verifica JWT en cada request y redirige según corresponda.
**Última actualización:** Abril 2026
