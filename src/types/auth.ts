
// Authentication related types
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: "customer" | "admin";
  isVerified: boolean;
  business?: {
    name: string;
    nameEn?: string;
    description?: string;
    descriptionEn?: string;
    slug: string;
    logo?: string;
    coverImage?: string;
    providerType: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode?: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
    workingHours: {
      day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
      isOpen: boolean;
      openTime?: string;
      closeTime?: string;
    }[];
    phone: string;
    email?: string;
    website?: string;
    instagram?: string;
    telegram?: string;
    whatsapp?: string;
    cuisine: string[];
    priceRange: "budget" | "moderate" | "expensive" | "fine-dining";
    features: string[];
    settings: {
      allowOnlineOrdering: boolean;
      showPrices: boolean;
      showCalories: boolean;
      showIngredients: boolean;
      theme: string;
      primaryColor?: string;
      secondaryColor?: string;
    };
    isActive: boolean;
    isCompleted: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: "customer" | "admin";
  isVerified: boolean;
  business?: User["business"];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
  token: string;
}

export interface AuthError {
  error: string;
  details?: string[];
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface PasswordResetData {
  email: string;
}

export interface PasswordUpdateData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
}

export interface BusinessProfileData {
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  slug: string;
  providerType: string;
  logo?: string;
  coverImage?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode?: string;
  };
  workingHours?: {
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    isOpen: boolean;
    openTime?: string;
    closeTime?: string;
  }[];
  phone: string;
  email?: string;
  website?: string;
  instagram?: string;
  telegram?: string;
  whatsapp?: string;
  cuisine?: string[];
  priceRange?: "budget" | "moderate" | "expensive" | "fine-dining";
  features?: string[];
  branches?: {
    title: string;
    address: string;
    coordinates?: { lat: number; lng: number };
  }[];
  isActive?: boolean;
  isVerified?: boolean;
}
