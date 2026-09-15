export interface PropertyDetails {
  purpose?: 'venda' | 'locacao'; // Finalidade
  rent_price?: string;
  condo_price?: string;
  iptu_price?: string;
  is_package?: boolean;
  title: string; // chamadas (opcional)
  price: string;
  previousPrice?: string;
  porteiraFechada?: boolean;
  neighborhood: string;
  city: string;
  state: string;
  area: string;
  bedrooms: string;
  suites: string;
  bathrooms: string;
  parking: string;
  propertyCode: string;
  propertyType: string;
  propertySubtype: string;
  amenities: string[];
  differentials: string[];
  leisureArea: boolean | null;
  whatsapp: string;
  images?: string[];
  generated_copy?: string;
}

export type TemplateId = 'modern' | 'luxury' | 'bold' | 'elegant' | 'minimalist' | 'myway';
export type AspectRatioId = 'feed' | 'story';

export interface BrandKit {
  logo: string | null;
  name: string;
  creci: string;
  whatsapp: string;
  isSaved: boolean;
}

export interface TemplateOptions {
  gradientOpacity?: number; // 0 to 100
  imagePositionX?: number; // 0 to 100
  imagePositions?: Record<number, number>; // per-image index positions
  logoSize?: number; // 50 to 150
  badge?: string; // e.g. "VENDIDO", "EXCLUSIVIDADE", etc.
}

export interface TemplateProps {
  details: PropertyDetails;
  image: string | null;
  logo: string | null;
  aspectRatio?: AspectRatioId;
  brandKit?: BrandKit | null;
  options?: TemplateOptions;
  userPlan?: 'free' | 'pro';
}

export interface SavedProperty {
  id: string;
  date: string;
  details: PropertyDetails;
  selectedTemplate: TemplateId;
  aspectRatio: AspectRatioId;
  templateOptions: TemplateOptions;
  thumbnail?: string;
}
