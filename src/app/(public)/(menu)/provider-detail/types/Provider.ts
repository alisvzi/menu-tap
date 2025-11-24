import type { WorkingHour } from "@/types/business";
export interface ProviderI {
  _id: string;
  owner: {
    firstName: string;
    lastName: string;
    email: string;
  };
  name: string;
  nameEn?: string;
  slug: string;
  logo?: string;
  coverImage?: string;
  description?: string;
  descriptionEn?: string;
  tagline?: string;
  taglineEn?: string;
  address: {
    city: string;
    street: string;
    postalCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  branches?: Array<{
    title?: string;
    name?: string;
    address: string;
    phone?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }>;
  cuisine: string[];
  priceRange: string;
  features: string[];
  phone: string;
  email?: string;
  reservationPhone?: string;
  instagram?: string;
  telegram?: string;
  whatsapp?: string;
  website?: string;
  workingHours: WorkingHour[];
  isActive: boolean;
  createdAt: string;
}
