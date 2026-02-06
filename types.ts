
export enum DiamondType {
  NATURAL = 'Natural',
  LAB_GROWN = 'Lab-Grown',
  BOTH = 'Both Natural & Lab-Grown'
}

export enum BuyerType {
  ALL = 'All Categories',
  WHOLESALER = 'Wholesalers & Traders',
  RETAILER = 'Retailers & Jewelry Stores',
  MANUFACTURER = 'Manufacturers',
  PRIVATE = 'Private Buyers & Investors'
}

export enum MarketTier {
  ANY = 'Any Scale',
  LUXURY = 'High-End / Luxury',
  COMMERCIAL = 'Commercial / Mass Market',
  BOUTIQUE = 'Indie / Boutique'
}

export type ViewMode = 'grid' | 'table' | 'saved';

export interface Buyer {
  id?: string; // unique ID for saving
  name: string;
  location: string;
  type: string; 
  contactInfo: string;
  website: string;
  description: string;
  specialty: string;
}

export interface SearchParams {
  diamondType: DiamondType;
  buyerType: BuyerType;
  marketTier: MarketTier;
  location: string;
  keywords: string;
}

export interface GeminiResponse {
  buyers: Buyer[];
  marketInsight: string;
}
