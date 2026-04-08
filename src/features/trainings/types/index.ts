export interface Training {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string | null;
  cover_image: string | null;
  price: number;
  currency: 'PEN' | 'USD';
  stripe_price_id: string | null;
  modality: 'presencial' | 'virtual';
  location: string | null;
  instructor: string | null;
  event_date: string | null;
  is_active: boolean;
  created_at: string;
}
