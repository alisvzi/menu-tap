// Business and restaurant related types
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface WorkingHour {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  isOpen: boolean;
  openTime?: string; // HH:MM format
  closeTime?: string; // HH:MM format
}

export interface Branch {
  name: string;
  address: string;
  phone?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface BusinessSettings {
  allowOnlineOrdering: boolean;
  showPrices: boolean;
  showCalories: boolean;
  showIngredients: boolean;
  theme: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface SEOData {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface Business {
  _id: string;
  owner: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  slug: string;
  logo?: string;
  coverImage?: string;
  phone: string;
  email?: string;
  website?: string;
  instagram?: string;
  telegram?: string;
  whatsapp?: string;
  address: Address;
  workingHours: WorkingHour[];
  branches?: Branch[];
  cuisine: string[];
  priceRange: 'budget' | 'moderate' | 'expensive' | 'fine-dining';
  features: string[];
  isActive: boolean;
  isVerified: boolean;
  rating?: number;
  reviewCount?: number;
  settings: BusinessSettings;
  seo: SEOData;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusinessData {
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  slug?: string;
  phone: string;
  email?: string;
  website?: string;
  instagram?: string;
  telegram?: string;
  whatsapp?: string;
  address: Omit<Address, 'coordinates'>;
  workingHours?: WorkingHour[];
  cuisine: string[];
  priceRange: 'budget' | 'moderate' | 'expensive' | 'fine-dining';
  features: string[];
  settings?: Partial<BusinessSettings>;
}

export interface UpdateBusinessData extends Partial<CreateBusinessData> {
  logo?: string;
  coverImage?: string;
  isActive?: boolean;
}

export interface BusinessStats {
  totalViews: number;
  totalOrders: number;
  totalCategories: number;
  totalMenuItems: number;
  monthlyViews: number;
  monthlyOrders: number;
  averageRating?: number;
}

export interface BusinessCard {
  _id: string;
  name: string;
  nameEn?: string;
  slug: string;
  logo?: string;
  phone: string;
  address: {
    city: string;
    street: string;
  };
  cuisine: string[];
  priceRange: string;
  rating?: number;
  reviewCount?: number;
  isActive: boolean;
  isVerified: boolean;
}

export interface BusinessFilters {
  city?: string;
  cuisine?: string;
  priceRange?: string;
  rating?: number;
  search?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

export interface BusinessFormStep {
  step: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}
