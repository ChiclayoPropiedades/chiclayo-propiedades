export interface Property {
  id: string;
  agent_id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  currency: 'PEN' | 'USD';
  operation: 'venta' | 'alquiler';
  type: 'casa' | 'departamento' | 'terreno' | 'oficina' | 'local' | 'otro';
  bedrooms: number | null;
  bathrooms: number | null;
  area_m2: number | null;
  address: string;
  district: string;
  city: string;
  lat: number | null;
  lng: number | null;
  is_active: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  property_images?: PropertyImage[];
  agent?: AgentProfile;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  alt_text: string | null;
  display_order: number;
  is_cover: boolean;
}

export interface AgentProfile {
  id: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
}

export interface PropertyFilters {
  search?: string;
  operation?: 'venta' | 'alquiler';
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  district?: string;
}
