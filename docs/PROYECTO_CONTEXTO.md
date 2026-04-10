# Chiclayo Propiedades - Contexto Completo del Proyecto

## Que es este proyecto

Plataforma web inmobiliaria para el mercado de Chiclayo, Peru. Conecta compradores con asesores inmobiliarios y genera ingresos por capacitaciones (cursos). Desplegada en Vercel.

**Objetivo en una frase:** Conectar compradores con asesores inmobiliarios en Chiclayo, y generar ingresos por capacitaciones.

**URL en produccion:** https://chiclayo-propiedades.vercel.app
**Sitio original (referencia visual):** https://chiclayopropiedades.com
**Dominio pendiente de conectar:** chiclayopropiedades.com (requiere Vercel Pro $20/mes)

---

## Las 4 funciones clave

| Funcion | Para quien | Que hace |
|---------|-----------|----------|
| Mostrar propiedades | Compradores | Buscan casas/deptos con filtros, ven fotos, contactan al asesor |
| Gestionar asesores | Agentes | Publican propiedades, reciben leads, aparecen en ranking |
| Vender capacitaciones | El negocio | Cursos inmobiliarios que se pagan en linea |
| Administrar todo | El dueno | Controla usuarios, propiedades, leads, blog, servicios desde un panel |

## Como genera dinero

- **Flujo 1 - Propiedades:** Comprador busca propiedad -> Contacta al asesor -> Se cierra la venta -> El negocio cobra comision (fuera de la plataforma, manual)
- **Flujo 2 - Capacitaciones:** Usuario ve catalogo de cursos -> Paga en linea (Stripe) -> El dinero va directo al negocio
- **Flujo 3 - Servicios B2B:** Empresas ven la pagina de servicios -> Contactan por WhatsApp o formulario -> Se cierra el trato fuera de la plataforma

---

## Stack Tecnologico (Golden Path - NO cambiar)

| Tecnologia | Para que |
|-----------|----------|
| Next.js 16 (App Router) | Framework web |
| React 19 + TypeScript | UI + tipado |
| Tailwind CSS 4 | Estilos |
| shadcn/ui (base-nova) | Componentes |
| Supabase | Auth + Database + Storage |
| Zod | Validacion |
| Jest + Playwright | Testing |
| Vercel | Deploy |

## Arquitectura Feature-First

```
src/features/auth/components/
src/features/auth/services/
src/features/properties/components/
src/shared/components/ui/    (componentes shadcn reutilizables)
src/shared/lib/              (utils, supabase, format)
```

---

## Estado del Proyecto (V1.0 completada - 2026-04-09)

### Fases completadas (8/8)
- Fase 0: Fundacion (Next.js 16, Tailwind 4, shadcn/ui, Supabase SDK, Jest)
- Fase 1: Autenticacion (Login, Signup, Recovery, Verify Email, Middleware)
- Fase 2: Propiedades (Listado, Detalle, Filtros, Home/Landing)
- Fase 3: Contacto y Leads (Formulario, Server Action)
- Fase 4: Blog (Listado, Detalle, Admin CRUD)
- Fase 5: Capacitaciones (Catalogo, Detalle, Stripe pages)
- Fase 6: Ranking + Servicios + Dashboard agente
- Fase 7: Admin Panel completo (9 secciones, CRUD completo)
- Fase 8: SEO (Sitemap, Robots, Metadata, JSON-LD)

**Total:** 35 paginas, 9 tablas con RLS, 3 storage buckets, 2 API routes

### Documentos clave en el repo
- `CLAUDE.md` - Instrucciones para IA (se lee automaticamente)
- `BUSINESS_LOGIC.md` - Logica de negocio
- `PRP.md` - Especificacion tecnica con fases y aprendizajes
- `HANDOFF.md` - Documento de entrega para continuar desarrollo
- `AGENTS.md` - Configuracion de agentes

---

## Credenciales y Accesos

### Cuenta Principal del Proyecto
- **Correo Gmail:** propiedadeschiclayo01@gmail.com
- **Password Gmail:** propiedades2324

### Supabase
- **Email:** propiedadeschiclayo01@gmail.com
- **Password:** Wr#EpJW2TM.5!?b
- **Project URL:** https://nukwnntnuxlwlmostqqx.supabase.co
- **Anon Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51a3dubnRudXhsd2xtb3N0cXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NjY4MzYsImV4cCI6MjA5MTI0MjgzNn0.OxgQhExyO6gnT9zh7Uob58T_QLypUOMlUIBXoL7FjTI
- **Project ID:** nukwnntnuxlwlmostqqx
- **Dashboard:** https://supabase.com/dashboard/project/nukwnntnuxlwlmostqqx

### Vercel
- **Email:** propiedadeschiclayo01@gmail.com
- **Password:** Wr#EpJW2TM.5!?b
- **Team:** chiclayo-propiedades-projects
- **Project Name:** chiclayo-propiedades
- **Production URL:** https://chiclayo-propiedades.vercel.app
- **Dashboard:** https://vercel.com/chiclayo-propiedades-projects

### GitHub
- **Email:** propiedadeschiclayo01@gmail.com
- **Password:** Wr#EpJW2TM.5!?b
- **Repo:** https://github.com/ChiclayoPropiedades/chiclayo-propiedades (privado)
- **Branch principal:** main
- **Owner:** ChiclayoPropiedades
- **Token:** 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

### Usuarios de Prueba
| Email | Password | Rol |
|-------|----------|-----|
| test@chiclayopropiedades.com | Test1234! | admin |
| casagrandegrupoinmobiliario@gmail.com | (la de la duena) | admin |

---

## Variables de Entorno (.env)

```env
NEXT_PUBLIC_SUPABASE_URL=https://nukwnntnuxlwlmostqqx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51a3dubnRudXhsd2xtb3N0cXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NjY4MzYsImV4cCI6MjA5MTI0MjgzNn0.OxgQhExyO6gnT9zh7Uob58T_QLypUOMlUIBXoL7FjTI
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Chiclayo Propiedades
# SUPABASE_SERVICE_ROLE_KEY= (obtener en Supabase > Settings > API)
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY= (pendiente)
# STRIPE_SECRET_KEY= (pendiente)
# STRIPE_WEBHOOK_SECRET= (pendiente)
# RESEND_API_KEY= (pendiente)
# NEXT_PUBLIC_SITE_URL=https://chiclayopropiedades.com
```

---

## Configuraciones Pendientes (URGENTE)

### URGENTE (hacer antes de mostrar al cliente)

**1. Configurar Site URL en Supabase**
- Problema: Cuando un usuario se registra, Supabase redirige a localhost:3000
- Solucion: Supabase > Auth > URL Configuration > Site URL = `https://chiclayo-propiedades.vercel.app`
- Agregar Redirect URLs: `https://chiclayo-propiedades.vercel.app/**` y `http://localhost:3000/**`

**2. Cambiar emails de Supabase a espanol**
- Problema: Email de confirmacion en ingles
- Solucion: Supabase > Auth > Email Templates, cambiar subjects y body a espanol

### IMPORTANTE (antes del lanzamiento)

**3. Migrar imagenes a Supabase Storage**
- Las fotos apuntan a chiclayopropiedades.com (Hostinger). Si cancela, desaparecen
- Descargar 11 imagenes, subirlas a bucket `property-images`, actualizar URLs

**4. Conectar Stripe (pasarela de pago)**
- Capacitaciones no cobran porque Stripe no esta conectado
- RUC: 20615657540, DNI: 47913462, cuentas Interbank
- Estado: Esperando que el cliente cree la cuenta

**5. Configurar Resend (emails transaccionales) - PARA DESPUES**
- Formulario de contacto no envia email al asesor

**6. Conectar dominio chiclayopropiedades.com**
- Requiere Vercel Pro ($20/mes), DNS en Hostinger

### OPCIONAL (V2.0)

**7. Mapa Leaflet en detalle de propiedad**
- Campos lat/lng existen pero no se muestra mapa

**8. Revision visual detallada**
- Comparar con el original pagina por pagina

---

## Cambios Solicitados por el Cliente

**Google Doc:** https://docs.google.com/document/d/113d42kaEKiR0udRjYtMWDv0XODrhK6hwKGw6Bu-TaSE/edit

### Resumen de decisiones del cliente:

- **Capacitaciones:** Datos por definir. Dejar campos libres, poner un ejemplo borrable
- **Servicios:** Pendiente proveer imagenes y detalles
- **Propiedades:** TODAS las actuales son ejemplos de prueba. Quiere estar SIN propiedades, que los usuarios las agreguen manualmente
- **Blog:** Quiere un ejemplo de articulo borrable/editable
- **Ranking:** Basado en VENTAS CERRADAS. Posicion = MONTO DE VENTA. Cuidado con conversion soles/dolares
- **Flujo de ranking:** Asesor vende -> pide autorizacion -> verificacion documentos -> marcar vendida -> suma puntos automaticamente
- **Criterios de reconocimiento:** Ventas cerradas (SI), Monto vendido (SI), Propiedades publicadas (SI), Consultas atendidas (NO)
- **Stripe:** OK. RUC: 20615657540, DNI: 47913462, cuentas Interbank (soles y dolares)

---

## Reglas de SaaS Factory (OBLIGATORIAS)

1. NO cambiar el stack (Golden Path)
2. NO crear archivos fuera de la estructura feature-first
3. NO usar CSS Modules (solo Tailwind)
4. NO crear API routes para CRUD (usar Server Actions)
5. NO usar OAuth (solo Email/Password)
6. NO inventar disenos nuevos (replicar el original)
7. NO usar `any` en TypeScript
8. NO instalar librerias sin justificacion
9. Server Components por defecto, `use client` solo cuando sea necesario
10. Siempre validar en el servidor

---

## Errores Conocidos y Aprendizajes

- **shadcn/ui genera en ruta incorrecta:** Mover de `src/components/ui/` a `src/shared/components/ui/`
- **shadcn v4 no soporta asChild:** No usar asChild en Button, SheetTitle, etc.
- **Supabase joins retornan arrays:** Normalizar con `Array.isArray()`
- **RLS Storage necesita UPDATE policy:** Para upsert necesita INSERT + UPDATE
- **Site URL de Supabase:** Debe apuntar a vercel.app, NO a localhost

---

## Deploy

Desplegado en **Vercel**. Cada `git push` a `main` despliega automaticamente en 2-3 minutos.

```bash
# Flujo de deploy
git add -A
git commit -m "descripcion del cambio"
git push   # Vercel despliega automaticamente
# Verificar en https://chiclayo-propiedades.vercel.app
```

---

## Curso SaaS Factory (referencia)

- **URL:** https://www.saasfactory.so/login
- **Email:** javierave234@gmail.com
- **Password:** MDYqqDbJShBI

---

## Recursos

- **Google Drive:** https://drive.google.com/drive/folders/1kaQ7gLoADrIjS1QbJp8tYyNOfcz1tVkO
- **Correo Claude:** enovagroup0@gmail.com
- **Notion Centro de Comando:** https://www.notion.so/Chiclayo-Propiedades-Centro-de-Comando-33c01a57f40f8108a8a9ce765cab43bc
