-- ============================================================================
-- CHICLAYO PROPIEDADES - Schema Completo de Base de Datos
-- Fecha: 11 Abril 2026
-- Supabase Project ID: nukwnntnuxlwlmostqqx
-- 12 tablas + RLS policies + funciones + triggers
-- ============================================================================

-- ─── TIPOS ENUM ─────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE operation_type AS ENUM ('venta', 'alquiler');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE property_type AS ENUM ('casa', 'departamento', 'terreno', 'oficina', 'local');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE inquiry_status AS ENUM ('new', 'contacted', 'closed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'completed', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── FUNCION HELPER: is_admin() ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ─── TABLA 1: profiles ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_public" ON profiles FOR SELECT USING (is_active = true);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "profiles_update_admin" ON profiles FOR UPDATE USING (is_admin());

-- Trigger: crear perfil al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── TABLA 2: properties ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PEN',
  operation operation_type NOT NULL,
  type property_type NOT NULL,
  bedrooms SMALLINT,
  bathrooms SMALLINT,
  area_m2 NUMERIC,
  address TEXT NOT NULL,
  district TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Chiclayo',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  is_active BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'inactive')),
  sale_price NUMERIC,
  sale_date TIMESTAMPTZ,
  sale_approved BOOLEAN DEFAULT false,
  commission_amount NUMERIC,
  commission_currency TEXT DEFAULT 'PEN',
  publication_plan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "properties_select_public" ON properties FOR SELECT USING (is_active = true);
CREATE POLICY "properties_select_own" ON properties FOR SELECT USING (agent_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "properties_select_admin" ON properties FOR SELECT USING (is_admin());
CREATE POLICY "properties_insert_agent" ON properties FOR INSERT WITH CHECK (agent_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "properties_update_own" ON properties FOR UPDATE USING (agent_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())) WITH CHECK (agent_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "properties_update_admin" ON properties FOR UPDATE USING (is_admin());
CREATE POLICY "properties_delete_own" ON properties FOR DELETE USING (agent_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "properties_delete_admin" ON properties FOR DELETE USING (is_admin());

CREATE INDEX IF NOT EXISTS idx_properties_sale_pending ON properties(status) WHERE status = 'sold' AND sale_approved = false;
CREATE INDEX IF NOT EXISTS idx_properties_sale_approved ON properties(status) WHERE status = 'sold' AND sale_approved = true;

-- ─── TABLA 3: property_images ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS property_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  display_order SMALLINT NOT NULL DEFAULT 0,
  is_cover BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "property_images_select_public" ON property_images FOR SELECT USING (true);
CREATE POLICY "property_images_insert_owner" ON property_images FOR INSERT WITH CHECK (property_id IN (SELECT p.id FROM properties p JOIN profiles pr ON p.agent_id = pr.id WHERE pr.user_id = auth.uid()));
CREATE POLICY "property_images_delete_owner" ON property_images FOR DELETE USING (property_id IN (SELECT p.id FROM properties p JOIN profiles pr ON p.agent_id = pr.id WHERE pr.user_id = auth.uid()));

-- ─── TABLA 4: blog_posts ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  category TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blog_posts_select_public" ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "blog_posts_select_admin" ON blog_posts FOR SELECT USING (is_admin());
CREATE POLICY "blog_posts_insert_admin" ON blog_posts FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "blog_posts_update_admin" ON blog_posts FOR UPDATE USING (is_admin());
CREATE POLICY "blog_posts_delete_admin" ON blog_posts FOR DELETE USING (is_admin());

-- ─── TABLA 5: trainings ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS trainings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  content TEXT,
  cover_image TEXT,
  price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PEN',
  stripe_price_id TEXT,
  modality TEXT NOT NULL DEFAULT 'presencial',
  location TEXT,
  instructor TEXT,
  event_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "trainings_select_public" ON trainings FOR SELECT USING (is_active = true);
CREATE POLICY "trainings_select_admin" ON trainings FOR SELECT USING (is_admin());
CREATE POLICY "trainings_insert_admin" ON trainings FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "trainings_update_admin" ON trainings FOR UPDATE USING (is_admin());
CREATE POLICY "trainings_delete_admin" ON trainings FOR DELETE USING (is_admin());

-- ─── TABLA 6: training_enrollments ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS training_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  training_id UUID NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  mp_payment_id TEXT,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  amount_paid NUMERIC,
  currency TEXT DEFAULT 'PEN',
  payment_date TIMESTAMPTZ,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE training_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "enrollments_select_own" ON training_enrollments FOR SELECT USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
CREATE POLICY "enrollments_select_admin" ON training_enrollments FOR SELECT USING (is_admin());
CREATE POLICY "enrollments_insert_own" ON training_enrollments FOR INSERT WITH CHECK (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- ─── TABLA 7: inquiries ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  agent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status inquiry_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inquiries_insert_public" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "inquiries_select_admin" ON inquiries FOR SELECT USING (is_admin());
CREATE POLICY "inquiries_select_agent" ON inquiries FOR SELECT USING (
  agent_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  OR property_id IN (SELECT p.id FROM properties p JOIN profiles pr ON p.agent_id = pr.id WHERE pr.user_id = auth.uid())
);
CREATE POLICY "inquiries_update_agent" ON inquiries FOR UPDATE USING (
  agent_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR is_admin()
);

-- ─── TABLA 8: agent_rankings ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS agent_rankings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  properties_count INTEGER NOT NULL DEFAULT 0,
  inquiries_count INTEGER NOT NULL DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  total_sales_amount NUMERIC DEFAULT 0,
  period TEXT NOT NULL DEFAULT 'all_time',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE agent_rankings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rankings_select_public" ON agent_rankings FOR SELECT USING (true);
CREATE POLICY "rankings_manage_admin" ON agent_rankings FOR ALL USING (is_admin());

-- ─── TABLA 9: services ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  display_order SMALLINT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services_select_public" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "services_manage_admin" ON services FOR ALL USING (is_admin());

-- ─── TABLA 10: platform_settings ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  label TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read settings" ON platform_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update settings" ON platform_settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- ─── TABLA 11: agent_subscriptions ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS agent_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_session_id TEXT,
  mp_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'cancelled')),
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PEN',
  started_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE agent_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions" ON agent_subscriptions FOR SELECT USING (
  profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage all subscriptions" ON agent_subscriptions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- ─── TABLA 12: publication_requests ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS publication_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  plan_price NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'PEN',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  used BOOLEAN DEFAULT false,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE publication_requests ENABLE ROW LEVEL SECURITY;
-- (RLS policies manejadas via admin client en el codigo)

-- ─── TABLA 13: role_upgrade_requests ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS role_upgrade_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  from_role TEXT NOT NULL DEFAULT 'user',
  to_role TEXT NOT NULL DEFAULT 'agent',
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_role_upgrade_requests_pending ON role_upgrade_requests(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_role_upgrade_requests_profile ON role_upgrade_requests(profile_id);

ALTER TABLE role_upgrade_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own requests" ON role_upgrade_requests FOR SELECT USING (
  profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can insert own requests" ON role_upgrade_requests FOR INSERT WITH CHECK (
  profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Admin can read all role requests" ON role_upgrade_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin can update role requests" ON role_upgrade_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- ─── STORAGE BUCKETS ────────────────────────────────────────────────────────

-- property-images (publico, lectura publica, escritura autenticada)
-- blog-images (publico)
-- avatars (publico)

-- ============================================================================
-- FIN DEL SCHEMA
-- 13 tablas, 42 RLS policies, 1 funcion helper, 1 trigger
-- ============================================================================
