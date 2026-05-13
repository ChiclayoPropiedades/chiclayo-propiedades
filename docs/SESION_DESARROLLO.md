# SESIÓN DE DESARROLLO - Chiclayo Propiedades

## Prompt para iniciar nueva sesión

Copia y pega esto al iniciar una nueva conversación con Claude:

```
Estoy trabajando en el proyecto Chiclayo Propiedades ubicado en:
C:\KEYBIDIGITAL_DEV\Chilayo Propiedades

Lee TODOS estos archivos antes de hacer cualquier cosa:
1. CLAUDE.md (raíz del proyecto)
2. docs/PLAN_MAESTRO.md
3. docs/ARQUITECTURA.md
4. docs/STACK_TECNOLOGICO.md
5. docs/PROYECTO_CONTEXTO.md
6. docs/SESION_DESARROLLO.md (estado actual, lo realizado y pendiente)
7. docs/BUSINESS_LOGIC.md

El repo es privado en GitHub. Para push usar:
git remote set-url origin https://<REDACTED-GH-PAT-REVOKED>@github.com/ChiclayoPropiedades/chiclayo-propiedades.git

Git config para este repo:
git config user.name "ChiclayoPropiedades"
git config user.email "propiedadeschiclayo01@gmail.com"

Cada git push a main despliega automáticamente en Vercel (2-3 min).
Backup del código original está en branch: backup/v1.0-original

Lee todos los .md y dime qué sigue según el plan.
```

---

## Credenciales y Accesos

### GitHub
- **Repo:** https://github.com/ChiclayoPropiedades/chiclayo-propiedades (privado)
- **Token:** <REDACTED-GH-PAT-REVOKED>
- **Push URL:** https://<REDACTED-GH-PAT-REVOKED>@github.com/ChiclayoPropiedades/chiclayo-propiedades.git
- **Git user.name:** ChiclayoPropiedades
- **Git user.email:** propiedadeschiclayo01@gmail.com
- **Branch producción:** main
- **Branch backup:** backup/v1.0-original (commit 20192d6)

### Vercel
- **URL producción:** https://chiclayo-propiedades.vercel.app
- **Project ID:** prj_wNyNqCCyDb4tMRkIxy8AyDdaOH8u
- **Team:** chiclayo-propiedades-projects
- **Deploy:** Automático con git push a main (2-3 min)
- **Plan:** Hobby (gratuito)

### Supabase
- **Email:** propiedadeschiclayo01@gmail.com
- **Password:** <REDACTED-PASSWORD-ROTATE-PENDING>
- **Project URL:** https://nukwnntnuxlwlmostqqx.supabase.co
- **Project ID:** nukwnntnuxlwlmostqqx
- **Dashboard:** https://supabase.com/dashboard/project/nukwnntnuxlwlmostqqx
- **Anon Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51a3dubnRudXhsd2xtb3N0cXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NjY4MzYsImV4cCI6MjA5MTI0MjgzNn0.OxgQhExyO6gnT9zh7Uob58T_QLypUOMlUIBXoL7FjTI

### Notion (Centro de Comando)
- **URL:** https://www.notion.so/Chiclayo-Propiedades-Centro-de-Comando-33c01a57f40f8108a8a9ce765cab43bc

### Google Doc (Cambios del cliente)
- **URL:** https://docs.google.com/document/d/113d42kaEKiR0udRjYtMWDv0XODrhK6hwKGw6Bu-TaSE/edit

---

## Lo Realizado (Sesión 1 - 9/10 Abril 2026)

### ETAPA 0: Reestructuración de Documentación ✅ COMPLETADA

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 0.1 | Reescribir CLAUDE.md | ✅ | Quitadas restricciones de SaaS Factory, reescrito como guía profesional |
| 0.2 | Crear ARQUITECTURA.md | ✅ | Metodología Git Flow, capas del sistema, patrones, seguridad, testing, escalabilidad |
| 0.3 | Crear PLAN_MAESTRO.md | ✅ | 9 fases detalladas con tareas por Front/Backend/DB |
| 0.4 | Crear STACK_TECNOLOGICO.md | ✅ | Stack por fase con justificación de cada dependencia |
| 0.5 | Crear PROYECTO_CONTEXTO.md | ✅ | Contexto completo del Notion, credenciales, pendientes |
| 0.6 | Mover docs a carpeta docs/ | ✅ | ARQUITECTURA, PLAN_MAESTRO, STACK_TECNOLOGICO, PROYECTO_CONTEXTO, BUSINESS_LOGIC, HANDOFF, PRP |
| 0.7 | Mover legacy a _legacy/ | ✅ | AGENTS.md (archivo del curso SaaS Factory) |
| 0.8 | Backup en GitHub | ✅ | Branch backup/v1.0-original creado y subido |

### ETAPA 1: Frontend Premium ⚠️ PARCIALMENTE COMPLETADA

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 1.1 | Instalar Motion (Framer Motion) | ✅ | `npm install motion` - 32KB |
| 1.2 | Copiar logos a public/images/ | ✅ | logo-color.png (Recurso 4), logo-white.png (Recurso 3), logo-black.png (Recurso 2), logo-premium.jpg |
| 1.3 | Logo real en Header | ✅ | Image de logo-color.png en header.tsx |
| 1.4 | Logo real en Footer | ✅ | Image de logo-black.png con invert, tamaño 240x98 |
| 1.5 | Separar secciones en archivos | ✅ | 6 archivos en src/shared/components/sections/ + page.tsx limpio (25 líneas) |
| 1.6 | ScrollReveal component | ✅ | src/shared/components/animated/scroll-reveal.tsx con Motion useInView |
| 1.7 | Rediseño AboutSection | ✅ | Layout 2 columnas (video izq, texto+cards der), 4 mini-cards beneficios, scroll-reveal |
| 1.8 | Rediseño FeaturedPropertiesSection | ✅ | Mejor heading, descripción, empty state profesional con 2 CTAs |
| 1.9 | Rediseño PropertyCard | ✅ | Colores navy+dorado, precio sobre imagen, badge Premium dorado con corona, hover elevación |
| 1.10 | Rediseño RankingSection | ✅ | Fondo navy oscuro, podio 1°/2°/3° con gradientes oro/plata/bronce, glassmorphism |
| 1.11 | Rediseño TrainingsSection | ✅ | Colores navy+dorado, accent line en cards, badge Presencial/Virtual, empty state con 3 beneficios |
| 1.12 | Rediseño NewsSection | ✅ | 4 topic cards (Tendencias, Inversión, Guías, Noticias), iconos con gradiente, accent lines |
| 1.13 | Rediseño NewsletterSection | ✅ | Layout 2 columnas, benefits list dorada, form card glassmorphism, CTA dorado, fondo azul oscuro |
| 1.14 | Rediseño Footer | ✅ | Fondo #0a1628, títulos dorados, horario de atención, WhatsApp CTA, min-h-svh |
| 1.15 | Secciones pantalla completa | ✅ | Todas las secciones con min-h-svh + flex items-center |
| 1.16 | Smooth scrolling | ✅ | scroll-behavior: smooth + -webkit-overflow-scrolling: touch |
| 1.17 | CSS animations (orbs, float) | ✅ | @keyframes float-slow y float-slow-reverse en globals.css |
| 1.18 | **HeroSection moderno** | ❌ PENDIENTE | Se intentó rediseñar pero el cliente no aprobó. **REVERTIDO al diseño original V1.0.** Necesita un nuevo diseño aprobado por el cliente |

### ETAPA 2: Configuraciones Supabase ✅ COMPLETADA (10 Abril 2026)

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 2.1 | Cambiar Site URL | ✅ | Ya estaba configurado: https://chiclayo-propiedades.vercel.app |
| 2.2 | Agregar Redirect URLs | ✅ | chiclayo-propiedades.vercel.app/** y localhost:3000/** via Management API |
| 2.3 | Email Confirm signup en español | ✅ | Subject + body en español via Management API |
| 2.4 | Email Reset password en español | ✅ | Subject + body en español via Management API |
| 2.5 | Crear .env.local | ✅ | Con SUPABASE_URL, ANON_KEY, APP_URL, APP_NAME |
| 2.6 | Emails adicionales en español | ✅ | Invitación, magic link, cambio de correo, cambio de contraseña, todos en español |

### ETAPA 3: Limpieza de Datos ✅ COMPLETADA (10 Abril 2026)

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 3.1 | Borrar propiedades de ejemplo | ✅ | 11 properties + 11 property_images eliminadas. Rankings reseteados a 0 |
| 3.2 | Crear 1 capacitación ejemplo | ✅ | "Curso de Tasación Inmobiliaria" - S/199, presencial, con contenido completo en español |
| 3.3 | Crear 1 artículo blog ejemplo | ✅ | "5 Consejos para Comprar tu Primera Casa en Chiclayo" - categoría guías, publicado |
| 3.4 | Verificar servicios | ✅ | 10 servicios OK. Corregido "Property Management" → "Administración de propiedades" |
| 3.5 | Limpiar datos huérfanos | ✅ | Sin imágenes huérfanas. Integridad verificada |

### ETAPA 4: Ranking por Ventas Cerradas ✅ COMPLETADA (10 Abril 2026)

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 4.1 | Migración SQL (status, sale_price, sale_date, sale_approved) | ✅ | ALTER TABLE properties + agent_rankings via Supabase Management API |
| 4.2 | Índices para consultas de ventas | ✅ | idx_properties_sale_pending, idx_properties_sale_approved |
| 4.3 | Types TypeScript actualizados | ✅ | Property + AgentRanking con nuevos campos |
| 4.4 | Server Action: markPropertyAsSold() | ✅ | Asesor marca vendida con precio, pendiente aprobación |
| 4.5 | Server Action: approveSale() + rejectSale() | ✅ | Admin aprueba/rechaza, recalcula ranking automáticamente |
| 4.6 | Server Action: getPendingSales() | ✅ | Query ventas pendientes de aprobación |
| 4.7 | Nuevo recalculateRankings() | ✅ | score = monto_total_vendido (USD→PEN con tasa 3.7) |
| 4.8 | Componente MarkSoldButton | ✅ | Botón + form inline con precio de venta |
| 4.9 | Componente SoldBadge | ✅ | Badges: Activa, Vendida, Pendiente aprobación, Inactiva |
| 4.10 | Componente SalesApprovalTable | ✅ | Tabla con aprobar/rechazar para admin |
| 4.11 | Dashboard propiedades actualizado | ✅ | Botón "Marcar vendida", badges de estado, precio de venta |
| 4.12 | Admin ranking actualizado | ✅ | Sección ventas pendientes + ranking por monto vendido |
| 4.13 | Ranking público actualizado | ✅ | Columnas: ventas cerradas, monto vendido, propiedades |
| 4.14 | Homepage ranking con datos reales | ✅ | Podio conectado a DB, muestra agentes reales con ventas |

### ETAPA 5: Upload de Imágenes ✅ COMPLETADA (10 Abril 2026)

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 5.1 | Componente PropertyImageUpload | ✅ | 3 métodos: file picker, drag & drop, URL externa |
| 5.2 | Server actions de imágenes | ✅ | uploadPropertyImage, addPropertyImageUrl, removePropertyImage, setPropertyCoverImage |
| 5.3 | Integración en PropertyForm | ✅ | Crear: guarda propiedad primero → muestra uploader. Editar: todo junto |
| 5.4 | Admin editar con imágenes | ✅ | Admin puede editar cualquier propiedad con gestión de imágenes |
| 5.5 | Validación | ✅ | JPG/PNG/WebP, máx 5MB, máx 10 imágenes, portada configurable |

### ETAPA 6: Stripe + Comisiones ✅ COMPLETADA (10 Abril 2026)

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 6.1 | Instalar Stripe SDK | ✅ | npm install stripe |
| 6.2 | Cliente Stripe | ✅ | src/shared/lib/stripe.ts con detección automática de credenciales |
| 6.3 | Server Action: createCheckoutSession() | ✅ | Precio dinámico o stripe_price_id, metadata con user_id y training_id |
| 6.4 | Webhook completo | ✅ | Verificación de firma, idempotencia, crea enrollment automáticamente |
| 6.5 | Botón EnrollButton | ✅ | Muestra "Pagos no disponibles" sin credenciales, funcional con credenciales |
| 6.6 | Tabla platform_settings | ✅ | Configuración de comisión %, moneda, tasa USD/PEN |
| 6.7 | Página /admin/configuracion | ✅ | Formulario para editar comisión, moneda, tasa, estado de Stripe |
| 6.8 | Comisión automática en approveSale | ✅ | Se calcula al aprobar venta, con conversión USD↔PEN |
| 6.9 | Para activar Stripe | ⏳ | Solo agregar en Vercel: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET |
| **Info del cliente para Stripe:** | | | |
| RUC | 20615657540 | | |
| DNI | 47913462 | | |
| Banco | Interbank (soles y dólares) | | |

### ETAPA 6.5: Admin Superadmin ✅ COMPLETADA (10 Abril 2026)

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 6.5.1 | Dashboard layout independiente | ✅ | Sin header/footer público, sidebar propio con logo |
| 6.5.2 | Admin ve TODAS las propiedades | ✅ | Dashboard muestra propiedades de toda la plataforma si es admin |
| 6.5.3 | Admin edita cualquier propiedad | ✅ | Sin restricción de owner (eliminado filtro agent_id condicional) |
| 6.5.4 | Datos del agente visibles | ✅ | Nombre + email del agente en cards y tabla |
| 6.5.5 | Link Panel Admin en sidebar | ✅ | Solo visible para usuarios con rol admin |
| 6.5.6 | Datos reales poblados | ✅ | 5 propiedades realistas de Chiclayo con imágenes |
| 6.5.7 | Toggle vista Cards/Tabla | ✅ | Botones para alternar entre vista cards (grid) y tabla compacta |
| 6.5.8 | PropertyCardDashboard | ✅ | Card con imagen, badges, acciones hover (ver/editar), agente, mark sold |
| 6.5.9 | Fix 404 al editar | ✅ | Admin puede editar propiedad de cualquier agente sin 404 |
| 6.5.10 | Título dinámico | ✅ | Admin ve "Todas las Propiedades", agente ve "Mis Propiedades" |

### ETAPA 6.6: Mejoras Superadmin ✅ COMPLETADA (Sesión 3 - 10/11 Abril 2026)

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 6.6.1 | Logo centrado en sidebar | ✅ | justify-center en contenedor del logo |
| 6.6.2 | Sidebar colapsable | ✅ | Botón ChevronsLeft/Right, persiste en localStorage, w-64/w-16 |
| 6.6.3 | CRUD usuarios completo | ✅ | Crear usuarios desde admin (Supabase Auth admin API), dialog con email/nombre/rol/teléfono |
| 6.6.4 | Ver publicaciones de cualquier usuario | ✅ | /admin/usuarios/[id] con tabs: Propiedades, Leads, Ventas |
| 6.6.5 | Métricas del dueño | ✅ | 4 secciones: Usuarios (3), Propiedades (4), Leads (3), Finanzas (3) |
| 6.6.6 | Dashboard admin con gráficas | ✅ | Recharts: BarChart leads/mes, PieChart propiedades/tipo, AreaChart ventas/período |
| 6.6.7 | Fix: bug 0 propiedades en dashboard | ✅ | Campo email no existe en profiles |
| 6.6.8 | Layout unificado | ✅ | Admin y dashboard usan mismo DashboardSidebar, sin redundancias |
| 6.6.9 | Sección Finanzas | ✅ | /admin/finanzas con resumen, ventas detalladas, pagos capacitaciones, suscripciones |
| 6.6.10 | Dirección + redes sociales | ✅ | Plaza Bolognesi actualizada, URLs exactas del cliente |
| 6.6.11 | Fix 500 blog/capacitaciones | ✅ | Quitar generateStaticParams, usar force-dynamic (Next.js 16 cookies) |
| 6.6.12 | Fix títulos duplicados | ✅ | Todos los pages (main + auth) sin "| Chiclayo Propiedades" |
| 6.6.13 | Páginas legales | ✅ | /privacidad y /terminos creadas |
| 6.6.14 | Upload imágenes blog/training | ✅ | Componente ImageUploadField: drag & drop + file picker + URL |
| 6.6.15 | Cover image en training form | ✅ | Campo cover_image en formulario de capacitaciones |
| 6.6.16 | Suscripción anual agentes | ✅ | S/99 configurable, Stripe Checkout, subscription wall, webhook |
| 6.6.17 | Gestión de suscripciones | ✅ | Admin extiende por horas/días/meses/años desde Finanzas y detalle usuario |
| 6.6.18 | Botón cerrar sesión | ✅ | LogOut en sidebar + /api/auth/signout route |
| 6.6.19 | Redirect admin al login | ✅ | Admin → /admin, agente/user → /dashboard |
| 6.6.20 | Usuarios de prueba | ✅ | Agente (Carlos Mendoza) + Comprador (María López) con datos reales |
| 6.6.21 | ACCESOS_ROLES.md actualizado | ✅ | Credenciales de 3 roles, flujo de suscripción, flujo de dinero |
| 6.6.22 | Auditoría documentada | ✅ | docs/AUDITORIA_COMPLETA.md con todos los hallazgos |
| 6.6.23 | Limpieza DB | ✅ | Rankings, teléfono Jorge, rol Test Admin |

### ETAPA 7: Emails + MercadoPago + Mobile ✅ COMPLETADA (Sesión 4 - 11 Abril 2026)

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 7.1 | MercadoPago Checkout Pro | ✅ | SDK instalado, preferencias para capacitaciones y suscripción |
| 7.2 | Webhook MercadoPago | ✅ | /api/webhooks/mercadopago con validación x-signature HMAC SHA256 |
| 7.3 | UI dual pagos | ✅ | Botones MercadoPago (principal) + Stripe (secundario) en EnrollButton y SubscriptionWall |
| 7.4 | Emails transaccionales (Brevo/Gmail) | ✅ | Dual provider: Brevo API REST + Gmail OAuth2, credenciales en DB |
| 7.5 | Email: lead notification | ✅ | Notifica al agente cuando llega un lead por su propiedad |
| 7.6 | Email: welcome | ✅ | Bienvenida al registrarse con link al dashboard |
| 7.7 | Email: training confirmation | ✅ | Confirmación de pago de capacitación con detalles del curso |
| 7.8 | Email: subscription confirmation | ✅ | Confirmación de suscripción agente con fecha de expiración |
| 7.9 | Email settings editables | ✅ | Admin configura credenciales Brevo/Gmail desde /admin/configuracion |
| 7.10 | Botón enviar email de prueba | ✅ | Verifica conexión del proveedor seleccionado |
| 7.11 | WhatsApp como método de pago | ✅ | Botón verde redirige a wa.me con mensaje predeterminado, configurable |
| 7.12 | Suscripción gratis (toggle) | ✅ | Admin activa/desactiva desde configuración, agente puede auto-activar |
| 7.13 | Desactivar suscripción | ✅ | Admin puede desactivar suscripción desde Finanzas |
| 7.14 | Admin config MercadoPago/Stripe | ✅ | Instrucciones paso a paso + webhook URL en configuración |
| 7.15 | Blog markdown renderizado | ✅ | react-markdown + @tailwindcss/typography en blog y capacitaciones |
| 7.16 | Tablas admin sin truncar | ✅ | Títulos completos + botón editar (lápiz) en blog y capacitaciones |
| 7.17 | Admin mobile nav | ✅ | Tabs scrollables con 10 secciones para admin en móvil |
| 7.18 | Perfil avatar responsive | ✅ | Stack vertical + centrado en móvil, horizontal en desktop |
| 7.19 | Mobile audit completo | ✅ | 11 archivos: grids, paddings, gaps, imágenes, tablas optimizados |
| 7.20 | DB: mp_payment_id | ✅ | Campos MercadoPago en training_enrollments y agent_subscriptions |
| 7.21 | DB: email settings | ✅ | 7 keys de email + 3 keys WhatsApp + free_subscription en platform_settings |

### ETAPA 7.5: Admin + Planes + Ranking + Mobile (Sesión 4 continuación - 11 Abril 2026)

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 7.22 | WhatsApp redirect fix | ✅ | Número sanitizado (sin +, espacios) |
| 7.23 | Google Maps en contacto | ✅ | Mapa embebido + click abre en grande |
| 7.24 | Botón Nueva Capacitación | ✅ | Agregado en /admin/capacitaciones |
| 7.25 | Email en tabla usuarios | ✅ | Columna email desde auth.users |
| 7.26 | Buscador + paginación usuarios | ✅ | Filtro por nombre/email/teléfono, 10/página |
| 7.27 | Buscador + paginación propiedades | ✅ | Filtro + toggle cards/tabla, 12/página |
| 7.28 | Filtro por estado propiedades | ✅ | Activas/vendidas/pendientes/inactivas |
| 7.29 | Editar usuario completo | ✅ | Nombre, teléfono, bio, rol, foto desde admin |
| 7.30 | Resetear contraseña usuario | ✅ | Admin puede cambiar clave de cualquier usuario |
| 7.31 | Upload avatar usuario (admin) | ✅ | Server action con admin client (bypass RLS) |
| 7.32 | Desactivar usuario oculta todo | ✅ | Propiedades, blog, ranking ocultos en web pública |
| 7.33 | Reactivar usuario restaura todo | ✅ | Todo vuelve a aparecer |
| 7.34 | Eliminar usuario borra TODO | ✅ | Propiedades, imágenes, posts, rankings, suscripciones, auth |
| 7.35 | Ranking solo agentes activos | ✅ | Filtro por rol=agent + is_active + suscripción vigente |
| 7.36 | Ranking tasa dinámica | ✅ | Lee de platform_settings en vez de hardcodeado |
| 7.37 | Ranking 1er/2do/3er lugar | ✅ | Badges oro/plata/bronce con texto, fotos grandes 64px, hover zoom |
| 7.38 | Ranking todos los agentes | ✅ | Muestra agentes con y sin ventas |
| 7.39 | Eliminar propiedad (agente+admin) | ✅ | Botón papelera en cards + deleteOwnProperty para dueño |
| 7.40 | Click nombre → panel | ✅ | Sin botón Panel separado, click en avatar+nombre abre panel |
| 7.41 | Validar email duplicado | ✅ | En signup y admin crear usuario |
| 7.42 | Validar teléfono duplicado | ✅ | En signup, admin crear y editar usuario |
| 7.43 | Nombres normalizados (Title Case) | ✅ | En signup y admin |
| 7.44 | Capacitaciones: WhatsApp pago | ✅ | Botón verde cuando no hay pasarela |
| 7.45 | Planes publicación usuario | ✅ | Básica (1 foto) / Avanzada (10 fotos), configurable |
| 7.46 | Solicitud publicación → DB → WhatsApp | ✅ | Se registra en publication_requests antes de ir a WhatsApp |
| 7.47 | Admin aprueba/rechaza solicitudes | ✅ | Tabla en /admin/propiedades y detalle usuario |
| 7.48 | Admin cambia plan antes de aprobar | ✅ | Select Básica/Avanzada inline |
| 7.49 | 1 pago = 1 publicación | ✅ | Plan se marca usado al crear propiedad |
| 7.50 | Límite fotos según plan | ✅ | maxImages prop en PropertyImageUpload |
| 7.51 | Caducidad configurable | ✅ | Días editables desde admin, expires_at al aprobar |
| 7.52 | Propiedad con plan vencido se oculta | ✅ | Filtro por property_id en expiredPropertyIds |
| 7.53 | Suscripción agente vencida oculta todo | ✅ | Propiedades + ranking ocultos |
| 7.54 | Historial compras por usuario | ✅ | Estado: pendiente/aprobada/usada/expirada/rechazada + fecha expiración |
| 7.55 | Propiedad vinculada en solicitud | ✅ | Título clickeable → página de edición |
| 7.56 | Desactivar solicitud (temporal) | ✅ | Oculta propiedad sin borrar |
| 7.57 | Eliminar solicitud (permanente) | ✅ | Borra solicitud + propiedad + imágenes |
| 7.58 | Homepage muestra todas las propiedades | ✅ | Destacadas + recientes si hay pocas (hasta 6) |
| 7.59 | DB: publication_requests | ✅ | Tabla con plan_type, price, status, used, expires_at, property_id |
| 7.60 | DB: publication_plan en properties | ✅ | Campo para vincular propiedad con plan |
| 7.61 | Logo en hero section | ✅ | Recurso 3 centrado arriba del hero |
| 7.62 | Contadores animados en hero | ✅ | 500+ propiedades, 200+ agentes, 1200+ clientes (0→valor) |
| 7.63 | Hero espacios compactos | ✅ | Todo visible sin scroll |
| 7.64 | Capacitaciones homepage fix | ✅ | event_date en vez de start_date (columna correcta) |
| 7.65 | Capacitaciones fondo azul oscuro | ✅ | Sección homepage + página /capacitaciones |
| 7.66 | Registro obligatorio para inscribirse | ✅ | Sin sesión → "Regístrate para inscribirte" |
| 7.67 | Ranking usa admin client | ✅ | Bypass RLS para visitantes anónimos |
| 7.68 | Ranking page azul oscuro | ✅ | Header #0a1628 → #1e3a5f |
| 7.60 | DB: publication_plan en properties | ✅ | Campo para vincular propiedad con plan |

### ETAPA 7.6: Capacitaciones Exclusivas + Migracion de Rol + Admin Inscripciones (Sesión 5 - 11 Abril 2026)

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 7.70 | Capacitaciones solo para agentes | ✅ | Solo agentes pueden inscribirse, users ven CTA para migrar |
| 7.71 | Solicitud migracion de rol (user→agent) | ✅ | Tabla role_upgrade_requests, server actions, RLS policies |
| 7.72 | Componente RequestAgentRole | ✅ | Boton solicitar + estado pendiente/en revision |
| 7.73 | Admin aprueba/rechaza migracion | ✅ | Tabla en /admin/usuarios con acciones aprobar/rechazar |
| 7.74 | Signup pre-selecciona agente | ✅ | /signup?role=agent pre-selecciona "Agente Inmobiliario" + mensaje contextual |
| 7.75 | Detalle capacitacion por rol | ✅ | Agente→EnrollButton, User→solicitar agente, Visitante→signup como agente |
| 7.76 | Dashboard capacitaciones para users | ✅ | CTA de migracion a agente si no es agente |
| 7.77 | WhatsApp enrollment registra en DB | ✅ | Clic en WhatsApp crea enrollment pendiente + abre WhatsApp |
| 7.78 | Estado enrollment existente | ✅ | Si ya hay enrollment pendiente muestra estado + boton "Contactar por WhatsApp" |
| 7.79 | Admin inscripciones en /admin/capacitaciones | ✅ | Stats (total, pendientes, pagados) + tabla con filtros por estado |
| 7.80 | Filtros inscripciones | ✅ | Todos/Pendientes/Pagados/Rechazados con contadores |
| 7.81 | Confirmar/rechazar pago (admin) | ✅ | Botones en tabla para confirmar pago WhatsApp o rechazar |
| 7.82 | Paginacion inscripciones | ✅ | 10 por pagina con navegacion |
| 7.83 | DB: role_upgrade_requests | ✅ | Tabla con profile_id, from_role, to_role, reason, status, reviewed_by |
| 7.84 | RLS: role_upgrade_requests | ✅ | Users read/insert own, admin read/update all |
| 7.85 | RLS: training_enrollments INSERT | ✅ | Policy para que users puedan crear enrollments |

### ETAPA 7.7: Sesión 6 - 25 Abril 2026 - Fixes producción + auditoría completa

**Contexto:** Sesión asistida por Claude. El proyecto ya está conectado a `chiclayopropiedades.com` (Vercel Pro contratado). Se sincronizó local con GitHub (8 commits del 12 al 16 abril que estaban en remoto). Se mapeó la estructura completa del código (53 rutas, 10 features, ~12 archivos en shared/lib) y se actualizó memoria local de Claude (10 archivos `.md` en `.claude/projects/...`).

#### 7.7.1 — Fix RANKING: tabla muestra todos los agentes

**Reporte cliente:** En `/ranking`, la tabla inferior solo mostraba agentes con ventas. Cliente pidió que aparezcan TODOS los agentes activos con suscripción vigente, paginados de 5 en 5. El podio (top 3 con trofeos) sí debe mantenerse solo para agentes con ventas.

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 7.7.1.1 | Nueva función `getAllAgentsForRanking()` | ✅ | `src/features/ranking/services/get-rankings.ts`. Devuelve todos los agentes con suscripción vigente, ordenados por score (los de 0 ventas al final). 3 queries: subscriptions activas → profiles agentes activos → rankings existentes. Merge con defaults para agentes sin ranking row. |
| 7.7.1.2 | Función `getRankings()` original mantenida | ✅ | Sigue devolviendo solo agentes con ventas (uso: podio + sección home). Refactor a helpers `isValidAgent()` y `getAdminSupabase()`. |
| 7.7.1.3 | Nuevo Client Component `RankingTable` | ✅ | `src/features/ranking/components/ranking-table.tsx`. Tabla con paginación 5 por página, prev/next con `ChevronLeft/Right`, posición global consistente entre páginas (1, 2, 3, 4, 5, **6**, 7...), aria-labels, accessibility. |
| 7.7.1.4 | Refactor `/ranking/page.tsx` | ✅ | Usa `getAllAgentsForRanking()`. Podio = `allAgents.filter(r => r.sales_count > 0).slice(0, 3)`. Tabla = `<RankingTable rankings={allAgents} />`. EmptyState si no hay agentes. |

#### 7.7.2 — Fix LOGIN: mejor manejo de errores global

**Reporte cliente:** Una usuaria nueva ("Angela Senmache") no podía iniciar sesión, salía solo "error" genérico sin explicación. Cliente pidió fix global para que no vuelva a pasar.

**Diagnóstico:** El form solo distinguía `"Invalid login credentials"` y para todo lo demás mostraba el mensaje genérico "Ocurrió un error al iniciar sesión. Inténtalo de nuevo." Esto ocultaba al usuario causas reales como email no confirmado, perfil faltante, cuenta desactivada, rate limit, etc.

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 7.7.2.1 | Función `mapAuthError()` con 6 casos | ✅ | `src/features/auth/components/login-form.tsx`. Cubre: invalid credentials, email not confirmed, user not found, rate limit, network/fetch, database/server error, fallback genérico. Mensajes en español claros. |
| 7.7.2.2 | Botón "Reenviar correo de confirmación" | ✅ | Aparece solo cuando el error es "email not confirmed". Llama a `supabase.auth.resend({ type: 'signup', email })`. Estados: idle / sending / sent / error con feedback visual. |
| 7.7.2.3 | Validación de profile null | ✅ | Si `.maybeSingle()` retorna null tras login exitoso, muestra mensaje claro y NO redirige a dashboard roto. |
| 7.7.2.4 | Validación de `profile.is_active === false` | ✅ | Mensaje claro + `supabase.auth.signOut()` automático para evitar estado inconsistente. |
| 7.7.2.5 | Validación de profileError | ✅ | Si Supabase devuelve error en el query (no solo null), mensaje específico. |

#### 7.7.3 — Fix GALERÍA: thumbnails clickeables con lightbox

**Reporte cliente:** En `/propiedades/[slug]`, las miniaturas debajo de la imagen principal NO eran clickeables. Solo se veía la primera foto en grande. Cliente pidió que cualquier rol (visitante, comprador, agente, vendedor, super admin) pueda dar click a cualquier foto y verla en grande.

**Causa raíz:** Los thumbnails en `property-details.tsx:73-87` se renderizaban dentro de un `<div>` SIN `onClick` ni `<button>`. La imagen principal estaba hardcodeada al cover, sin state que permita cambiarla. El bug se hizo evidente tras commit `c0c5b9b` (12 abril) que mostró TODAS las imágenes en lugar de solo 2.

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 7.7.3.1 | Nuevo Client Component `PropertyImageGallery` | ✅ | `src/features/properties/components/property-image-gallery.tsx`. Lightbox modal con shadcn `Dialog`. Click en imagen principal o cualquier thumbnail abre lightbox en su index. Hover hint "Ver en grande" con icono `ZoomIn`. |
| 7.7.3.2 | Navegación en lightbox | ✅ | Botones flecha izq/der (`ChevronLeft/Right`) circular. Soporte teclado: ←/→ navegan, Esc cierra (manejado por base-ui Dialog), botón X cierra. Contador "X de N" con `aria-live="polite"`. |
| 7.7.3.3 | Refactor `property-details.tsx` | ✅ | Eliminada la función local `ImageGallery`. Importa `PropertyImageGallery`. PropertyDetails sigue siendo Server Component (no necesita `"use client"`). |
| 7.7.3.4 | Optimizaciones tras audit con skill `simplify` | ✅ | `useMemo` en `orderedImages` (evita re-sort cada render), conditional mount del lightbox content (no preloadea cuando cerrado), `sizes` optimizados (66vw desktop hero, 20vw thumbnails), defensive clamp de `currentIndex` contra mutaciones de `images`, `NavButton` className compartido (DRY), JSX flatten en thumbnails. |

#### 7.7.4 — Mantenimiento

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 7.7.4.1 | `git pull` de 8 commits remotos | ✅ | Local estaba 8 commits detrás. Fast-forward limpio de `c0c5b9b` → `73de678`. |
| 7.7.4.2 | Mapeo completo de estructura del código | ✅ | 53 archivos de rutas, 10 features (admin más grande con `admin-actions.ts` 1094 líneas), 17 shadcn UI + 3 layout + 3 animated + 6 sections, 4 clientes Supabase, 3 providers email (Resend + Brevo + Gmail). |
| 7.7.4.3 | Memoria local Claude actualizada | ✅ | 10 archivos `.md` en `C:\Users\Keybidigital\.claude\projects\C--KEYBIDIGITAL-DEV-Chilayo-Propiedades\memory\`: producción crítica, token expuesto, estado V1.0, diseño cliente, build memory, Next.js 16 docs, middleware ISR, admin-actions split, no migrations, índice de docs. |
| 7.7.4.4 | Token GitHub viejo revocado | ✅ | `<REDACTED-GH-PAT-REVOKED>` (en `.git/config` y `docs/PROYECTO_CONTEXTO.md`) dejó de funcionar para `git push` (probablemente auto-revocado por GitHub al detectar exposure). Generado nuevo PAT `<REDACTED-GH-PAT-PREFIX>` (expira 30 días, scope `repo`). El nuevo se usó solo en URL de comando, NO se guardó en `.git/config`. |
| 7.7.4.5 | Auditoría con skill `simplify` post-galería | ✅ | 3 agentes paralelos (reuse, quality, efficiency) revisaron el nuevo componente. Aplicados fixes: useMemo, conditional mount, sizes, clamp, NavButton, flatten JSX. |

#### Commits en producción (deployed en Vercel)

```
8ac27ac fix: galeria de propiedades con lightbox clickeable para todos los roles
a24c6c7 fix: revertir require() a dynamic import en get-rankings
5599562 fix: ranking muestra todos los agentes activos + login con mejor manejo de errores
```

Todos verificados en https://chiclayopropiedades.com con `curl` (200 OK, 1.2-1.5s).

#### Pendientes acumulados (NO resueltos en esta sesión)

| # | Pendiente | Por qué quedó pendiente |
|---|-----------|--------------------------|
| 7.7.P1 | Aplicar policy RLS `profiles_select_own` en Supabase como safety net | Requiere acceso al MCP Supabase con `SUPABASE_ACCESS_TOKEN` (no provisto). Alternativa: ejecutar en SQL Editor: `CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (user_id = auth.uid());` |
| 7.7.P2 | Diagnóstico final de Angela Senmache | Faltan datos: `profile_id`, `role`, `is_active`, `full_name` (columnas truncadas en screenshot del cliente). Y queries 2 (otros usuarios afectados) + 3 (RLS policies actuales). |
| 7.7.P3 | Limpiar token GitHub viejo de docs y `.git/config` | Token viejo está revocado pero sigue en disco en 3 lugares. Cliente prefirió dejar el archivo `token github.txt` por ahora. |

### ETAPA 7.8: Sesión 7 - 28 Abril 2026 - Fixes login post-verificación + edit usuario + delete propiedad ISR

**Contexto:** El cliente reporta 5 problemas en producción (`chiclayopropiedades.com`, V1.0 + Sesión 6). Se decide implementar **3 bugs bloqueantes** en esta sesión. El rediseño del ranking (3 columnas puntuación/competencia/ventas + dual S/+$) y los campos sociales del perfil de agente quedan **diferidos** esperando definición final del cliente — diseño y schema preparados.

**Bugs reportados:**
1. Editar usuario desde admin no persistía cambios visualmente.
2. Borrar propiedad: la propiedad seguía apareciendo en listados públicos.
3. Ranking 1-10 debería mostrar puntuación / competencia / ventas + monto S/ y $.
4. Perfil de agente sin campos de redes sociales / página web.
5. Login post-verificación: nuevo usuario solo entraba con la URL del email; en intentos posteriores con email/password fallaba en cualquier dispositivo.

#### 7.8.1 — Fix LOGIN post-verificación (CRÍTICO)

**Diagnóstico (validado leyendo código):** RLS de `public.profiles` tenía solamente `profiles_select_public USING (is_active = true)`, `profiles_update_own`, `profiles_update_admin`. **No existía** `profiles_select_own` (la safety net pendiente desde Sesión 6, P1). En `login-form.tsx:109-113` el SELECT usa el cliente browser con la JWT del usuario; si por cualquier razón `is_active` no es `true` (race condition con trigger, edge case, futura restricción) el form muestra "Tu cuenta no tiene un perfil asociado" y bloquea acceso. El URL del email funciona porque `exchangeCodeForSession` en el callback bypasa el chequeo de profile.

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 7.8.1.1 | Aplicar policy `profiles_select_own` en Supabase Dashboard | ✅ | SQL: `CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (user_id = auth.uid());`. Aplicada por el cliente desde SQL Editor (https://supabase.com/dashboard/project/nukwnntnuxlwlmostqqx/sql/new). Aditivo, sin riesgo. |
| 7.8.1.2 | Reforzar callback `/api/auth/callback` | ✅ | `src/app/api/auth/callback/route.ts`. Tras `exchangeCodeForSession`: obtiene `user`, lee profile con `createAdminClient()` (service role para no depender de RLS), si no existe llama a `ensureProfileExists`, si `is_active=false` cierra sesión y redirige a `/login?error=inactive`. |
| 7.8.1.3 | Nueva server action `ensureProfileExists` | ✅ | `src/features/auth/services/ensure-profile.ts` (archivo nuevo, fuera de `admin-actions.ts` por regla de proyecto). Idempotente: si profile ya existe no toca; si no, INSERT con service role tomando `full_name`, `phone`, `role` de `user.user_metadata`. Maneja `error.code === "23505"` (conflict por race con el trigger). |
| 7.8.1.4 | Login form maneja `?error=` del callback | ✅ | `src/features/auth/components/login-form.tsx`. Función `mapCallbackError(code)` cubre: `auth` (link inválido/expirado), `inactive` (cuenta desactivada), `profile` (problema al crear perfil). `useEffect` lee `useSearchParams` y muestra el mensaje. |
| 7.8.1.5 | Suspense boundary en `/login` | ✅ | `src/app/(auth)/login/page.tsx` envuelto en `<Suspense fallback={null}>` porque `useSearchParams` requiere prerender estático con CSR bailout. |
| 7.8.1.6 | Logs de debug en dev | ✅ | En `login-form.tsx`, `console.warn("[auth] ...", error.message)` solo cuando `NODE_ENV === "development"`. No expone detalles en producción. |

#### 7.8.2 — Fix EDIT USUARIO refresca UI tras guardar

**Diagnóstico:** `updateUserProfile` en `admin-actions.ts:194-236` ya hacía UPDATE OK + `revalidatePath("/admin/usuarios")` y `/admin/usuarios/${profileId}`. El bug era 100% client-side: el form usa `defaultValue={initialData.full_name}` (uncontrolled) y NO llamaba `router.refresh()` tras `toast.success`. El server tenía data nueva pero el cliente seguía renderizando con el initialData original hasta navegar manualmente.

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 7.8.2.1 | `router.refresh()` tras toast en 3 handlers | ✅ | `src/features/admin/components/edit-user-form.tsx`. Importa `useRouter` de `next/navigation`. Llama `router.refresh()` después de `toast.success("Datos actualizados")`, `toast.success("Foto actualizada")` y `toast.success("Foto eliminada")`. |
| 7.8.2.2 | Zod schema en `updateUserProfile` | ✅ | `src/features/admin/services/admin-actions.ts:194-236`. Schema: `full_name` min 1 max 100, `phone` max 20, `bio` max 1000, `role` enum ["user","agent","admin"]. Bloquea DOM mutation attacks que cambien role a string arbitrario. |
| 7.8.2.3 | revalidatePath ampliado | ✅ | `updateUserProfile` ahora también invalida `/ranking` y `/` porque cambio de role afecta ranking público (user→agent o agent→user). |

#### 7.8.3 — Fix DELETE PROPIEDAD invalida ISR público

**Diagnóstico:** `deleteProperty` (admin-actions.ts:752-759) hacía DELETE real + `revalidatePath("/admin/propiedades")` solamente. `deleteOwnProperty` (property-actions.ts:138-173) revalidaba `/dashboard/propiedades` y `/admin/propiedades`. Las rutas públicas con ISR (`/propiedades` rev=60s, `/propiedades/[slug]` rev=300s, `/`, `/ranking`) seguían sirviendo la propiedad borrada hasta que el cache expirara.

| # | Tarea | Estado | Detalle |
|---|-------|--------|---------|
| 7.8.3.1 | Capturar slug antes de DELETE | ✅ | Antes del `.delete()` ambas funciones hacen un `select("slug").eq("id", id).maybeSingle()` para usar el slug en `revalidatePath` del detalle. |
| 7.8.3.2 | revalidatePath ampliado en `deleteProperty` | ✅ | Invalida: `/`, `/propiedades`, `` /propiedades/${slug} ``, `/admin/propiedades`, `/dashboard/propiedades`, `/ranking`, `/admin/ranking`. |
| 7.8.3.3 | revalidatePath ampliado en `deleteOwnProperty` | ✅ | Invalida las 6 mismas rutas públicas/privadas (sin `/admin/ranking` porque el agente no la consume). |
| 7.8.3.4 | Recalcular ranking tras delete | ✅ | Ambas funciones llaman `recalculateRankings()` envuelto en try/catch (no aborta el delete si falla). Borrar una propiedad activa cambia `properties_count` del agente. Trade-off aceptado: la operación tarda ~1-3s extra. |
| 7.8.3.5 | Cross-import sin ciclo | ✅ | `property-actions.ts` ahora importa `recalculateRankings` desde `@/features/admin/services/admin-actions`. Verificado que `admin-actions` no importa de `property-actions` → sin import circular. Build pasó. |

#### 7.8.4 — Defer (NO implementado en esta sesión, planificado para futura)

| # | Pendiente | Estado | Razón |
|---|-----------|--------|--------|
| 7.8.4.1 | Ranking con 3 columnas (puntuación / ventas / monto dual S/+$) | ⏸️ Diferido | Cliente respondió "eso del ranking la puntuación no aplica en esta sesión". Diseño completo preparado: score compuesto multifactor (`sales*100 + sqrt(monto/1000) + props*5 + inquiries`), schema dual `total_sales_amount_pen` + `total_sales_amount_usd` en `agent_rankings`, lectura de `usd_to_pen_rate` desde `platform_settings` (FIX al hardcode actual de 3.7 en `recalculateRankings`). |
| 7.8.4.2 | Perfil de agente con redes sociales + ruta pública `/asesor/[id]` | ⏸️ Diferido | Cliente respondió "luego" tanto en ruta como en permisos. Schema preparado: `ALTER TABLE profiles ADD COLUMN social_facebook/instagram/linkedin/tiktok/youtube/social_x/website TEXT`. Form en `/dashboard/perfil` ampliable. Página pública `/asesor/[id]` diseñada con Server Component, ISR=300s, `generateStaticParams`, redes con iconos lucide, propiedades del agente. |

#### Commits en producción (deployed en Vercel)

```
18ff884 fix: login post-verificacion permite acceso en cualquier dispositivo
f72c58a fix: editar usuario refresca UI y delete propiedad invalida ISR publico
```

Build local pasó: `npm run typecheck` sin errores, `NODE_OPTIONS="--max-old-space-size=4096" npm run build` compiló las 77 rutas. Push a `main` exitoso (`8ac27ac..f72c58a`). Vercel desplegó automáticamente.

#### Archivos modificados (esta sesión)

| Archivo | Tipo | Líneas |
|---------|------|--------|
| `src/app/api/auth/callback/route.ts` | Modificado | +52 −2 (validación profile + ensureProfileExists + redirect inactive) |
| `src/features/auth/services/ensure-profile.ts` | **Nuevo** | +60 (server action con service role, idempotente) |
| `src/features/auth/components/login-form.tsx` | Modificado | +35 −2 (mapCallbackError, useEffect+useSearchParams, logs dev) |
| `src/app/(auth)/login/page.tsx` | Modificado | +6 −2 (Suspense boundary) |
| `src/features/admin/components/edit-user-form.tsx` | Modificado | +6 −0 (useRouter + 3× router.refresh) |
| `src/features/admin/services/admin-actions.ts` | Modificado | +35 −10 (Zod schema + revalidatePath ampliado en update y delete + recalculateRankings) |
| `src/features/properties/services/property-actions.ts` | Modificado | +20 −4 (slug capture + revalidatePath ampliado + import recalculate) |

#### Pendientes acumulados (NO resueltos en esta sesión)

| # | Pendiente | Por qué quedó pendiente |
|---|-----------|--------------------------|
| 7.8.P1 | Diagnóstico final de Angela Senmache (heredado de 7.7.P2) | No se reabrió en esta sesión. La policy `profiles_select_own` aplicada como safety net debería resolver el bug en general. Verificar con la usuaria si vuelve a tener problemas. |
| 7.8.P2 | Limpiar token GitHub viejo de docs y `.git/config` (heredado de 7.7.P3) | Sigue pendiente. `docs/PROYECTO_CONTEXTO.md` línea ~ y `docs/SESION_DESARROLLO.md` líneas 21, 39, 367 contienen el token revocado `<REDACTED-GH-PAT-REVOKED>`. `.git/config` también. NO se pegó el token nuevo en docs en esta sesión (decisión: tokens vivos solo en CLAUDE.md y memoria local). |
| 7.8.P3 | Implementar ranking V2 (3 columnas + dual currency) | Cliente difirió. Diseño y SQL listos, esperando confirmación. |
| 7.8.P4 | Implementar perfil agente con redes sociales + `/asesor/[id]` | Cliente difirió. Diseño y SQL listos, esperando confirmación de ruta y permisos. |

#### Verificación end-to-end recomendada en producción

| # | Flujo | Cómo probarlo |
|---|-------|---------------|
| V1 | Login post-verificación funciona en otro dispositivo | Crear usuario nuevo en /signup → confirmar email en PC → cerrar sesión → ir a /login en móvil con email/password → debe entrar normalmente |
| V2 | Login con cuenta desactivada muestra error correcto | Setear `is_active=false` en SQL → intentar login → mensaje "Tu cuenta está desactivada", sesión cerrada |
| V3 | Profile faltante se crea automáticamente | DELETE FROM profiles WHERE user_id = X → click link de email → callback debe crearlo y dejar entrar |
| V4 | Editar usuario refresca UI | Admin /admin/usuarios/[id] → cambiar full_name → guardar → ver Title Case sin F5 |
| V5 | Editar usuario rechaza role inválido | DOM mutation: `document.querySelector('select[name=role]').value = 'hacker'` → guardar → toast "Datos inválidos" |
| V6 | Borrar propiedad desaparece del público inmediatamente | Crear propiedad → ver en /propiedades incógnito → borrar → refrescar incógnito → no aparece |
| V7 | Detalle de propiedad borrada da 404 | Tras borrar, ir a /propiedades/[slug-borrado] → 404 (no contenido stale) |
| V8 | Ranking refleja properties_count actualizado | Borrar propiedad activa → /ranking debe mostrar el agente con properties_count menos uno |

#### Cambios de schema aplicados en esta sesión

```sql
-- Aplicado en Supabase Dashboard SQL Editor el 2026-04-28
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  USING (user_id = auth.uid());
```

Total policies en `public.profiles` después de esta sesión: 4
- `profiles_select_public` USING (is_active = true)
- `profiles_select_own` USING (user_id = auth.uid()) ← **NUEVO**
- `profiles_update_own` USING (user_id = auth.uid())
- `profiles_update_admin` USING (is_admin())

#### Notas sobre tokens y credenciales (Sesión 7)

Durante esta sesión se usaron credenciales para `git push` y para acceso a Supabase. **Por seguridad, los strings completos de los tokens vivos NO se almacenan en archivos `.md` commiteados al repo** (este es exactamente el bug que el pendiente 7.8.P2 trata de cerrar). Los tokens activos se mantienen únicamente en:

- **`CLAUDE.md`** (raíz del proyecto, ya commiteado — y por tanto también expuesto, ver pendiente)
- **Memoria local de Claude**: `C:\Users\Keybidigital\.claude\projects\C--KEYBIDIGITAL-DEV-Chilayo-Propiedades\memory\` (NO commiteada, local al desarrollador)

Tokens y accesos referenciados (sin valores literales aquí):
- **GitHub PAT activo** — formato `<REDACTED-GH-PAT-PREFIX>` — ver CLAUDE.md / memoria. Expira ~25-may-2026, scope `repo`.
- **GitHub PAT viejo** — formato `<REDACTED-GH-PAT-REVOKED>` — REVOCADO. Sigue presente en `.git/config` y en bloques históricos de `docs/SESION_DESARROLLO.md` y `docs/PROYECTO_CONTEXTO.md` por compatibilidad histórica.
- **Supabase Service Role Key** — formato `eyJ...service_role...` — ver CLAUDE.md / memoria. Usada por `createAdminClient()` en server-side. Configurada como `SUPABASE_SERVICE_ROLE_KEY` en Vercel.
- **Supabase Anon Key** — formato `eyJ...anon...` — pública por diseño, segura para frontend, sigue en `docs/PROYECTO_CONTEXTO.md` y `docs/SESION_DESARROLLO.md`.
- **Supabase Publishable Key** — formato `sb_publishable_...` — ver CLAUDE.md.

Recomendación: en próxima sesión, ejecutar el pendiente 7.8.P2 (limpieza de tokens viejos) **antes** de añadir más documentación con credenciales. La limpieza incluye `.git/config`, `docs/PROYECTO_CONTEXTO.md`, este archivo (líneas 21, 39, 367), y borrar `token github.txt`.

### ETAPA 8: Dominio y Producción ❌ PENDIENTE

| # | Tarea | Estado | Dependencia |
|---|-------|--------|-------------|
| 8.1 | Upgrade Vercel Pro ($20/mes) | ❌ | Cliente debe pagar |
| 8.2 | Agregar dominio chiclayopropiedades.com | ❌ | |
| 8.3 | Configurar DNS en Hostinger | ❌ | A: 76.76.21.21, CNAME: cname.vercel-dns.com |
| 8.4 | Actualizar URLs (Vercel + Supabase) | ❌ | |

### ETAPA 9: Mejoras V2.0+ ❌ PENDIENTE

| # | Tarea | Estado |
|---|-------|--------|
| 9.1 | Mapa Leaflet en detalle de propiedad | ❌ |
| 9.2 | Notificaciones push en tiempo real | ❌ |
| 9.3 | Búsqueda avanzada con mapa | ❌ |
| 9.4 | Sistema de favoritos | ❌ |
| 9.5 | Comparador de propiedades | ❌ |
| 9.6 | HeroSection rediseño (pendiente aprobación cliente) | ❌ |

---

## Estructura de Archivos Actual

```
chiclayo-propiedades/
├── public/images/
│   ├── logo-color.png        # Logo navy+dorado (header, hero)
│   ├── logo-white.png        # Logo blanco (no usado actualmente)
│   ├── logo-black.png        # Logo negro (footer con invert)
│   └── logo-premium.jpg      # Logo alta calidad (no usado)
├── src/
│   ├── app/(main)/page.tsx   # Homepage limpio (25 líneas, solo imports)
│   ├── shared/components/
│   │   ├── animated/
│   │   │   ├── hero-section.tsx    # Hero V1.0 original (PENDIENTE rediseño)
│   │   │   └── scroll-reveal.tsx   # Wrapper Motion para scroll animations
│   │   ├── sections/
│   │   │   ├── about-section.tsx              # 2 columnas, video+cards
│   │   │   ├── featured-properties-section.tsx # Cards premium
│   │   │   ├── ranking-section.tsx            # Podio navy+dorado
│   │   │   ├── trainings-section.tsx          # Cards con accent line
│   │   │   ├── news-section.tsx               # 4 topic cards
│   │   │   └── newsletter-section.tsx         # 2 columnas, form glassmorphism
│   │   └── layout/
│   │       ├── header.tsx     # Logo imagen real
│   │       ├── footer.tsx     # Oscuro, horario, WhatsApp
│   │       └── whatsapp-button.tsx
│   └── ...
├── docs/
│   ├── ARQUITECTURA.md
│   ├── PLAN_MAESTRO.md
│   ├── STACK_TECNOLOGICO.md
│   ├── PROYECTO_CONTEXTO.md
│   ├── SESION_DESARROLLO.md  # ESTE ARCHIVO
│   ├── BUSINESS_LOGIC.md
│   ├── HANDOFF.md
│   └── PRP.md
├── _legacy/
│   └── AGENTS.md
└── CLAUDE.md
```

---

## Notas Importantes para la Próxima Sesión

1. **El HeroSection está en su versión original V1.0.** Pendiente rediseño con aprobación del cliente.

2. **Los commits deben ser como ChiclayoPropiedades.**

3. **Build necesita más memoria** (react-markdown es pesado):
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

4. **Emails configurables desde /admin/configuracion** (no desde Vercel). Se guardan en platform_settings.

5. **MercadoPago y Stripe** necesitan credenciales en Vercel (env vars). WhatsApp pago funciona sin credenciales.

6. **Suscripción gratis** tiene toggle en configuración. Desactivar cuando se configure pasarela.

7. **El cliente quiere:**
   - Diseño profesional y premium
   - Colores del logo: navy (#1e3a5f) + dorado (#b8860b)
   - Responsive perfecto (mobile + desktop)
   - Que cada sección ocupe toda la pantalla
   - Scroll fluido 120fps
   - NO cursiva en tipografías
   - Logo proporcional, no estirado
