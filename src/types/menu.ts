// Menu, category and menu item related types
export interface Ingredient {
  name: string;
  nameEn?: string;
  allergen?: boolean;
}

export interface NutritionFacts {
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface ItemVariant {
  name: string;
  nameEn?: string;
  price?: number;
  additionalPrice?: number;
}

export interface ItemAddon {
  name: string;
  nameEn?: string;
  price: number;
  category?: string;
  isRequired?: boolean;
  maxSelections?: number;
}

export interface ItemAnalytics {
  viewCount: number;
  orderCount: number;
  favoriteCount: number;
  rating?: number;
  reviewCount: number;
}

export interface Subcategory {
  _id: string;
  name_fa: string;
  name_en?: string;
}

export interface SubcategoryInput {
  name_fa: string;
  name_en?: string;
}

export interface Category {
  _id: string;
  business: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  slug: string;
  image?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  isVisible: boolean;
  subcategories?: Subcategory[];
  availableFrom?: string; // HH:MM format
  availableUntil?: string; // HH:MM format
  availableDays?: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  itemsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  _id: string;
  business: string;
  category: string | Category;
  subcategory?: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  slug: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  currency: 'IRR' | 'USD' | 'EUR';
  preparationTime?: number;
  calories?: number;
  servingSize?: string;
  ingredients?: Ingredient[];
  nutritionFacts?: NutritionFacts;
  allergens?: ('gluten' | 'dairy' | 'eggs' | 'nuts' | 'peanuts' | 'soy' | 'fish' | 'shellfish' | 'sesame')[];
  dietaryInfo?: ('vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'nut-free' | 'halal' | 'kosher' | 'organic' | 'local')[];
  spicyLevel?: number; // 0-5
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isHalal?: boolean;
  isSpecial?: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  isSpicy?: boolean;
  isVisible?: boolean;
  variants?: ItemVariant[];
  addons?: ItemAddon[];
  order: number;
  isActive: boolean;
  isAvailable: boolean;
  stockQuantity?: number;
  isUnlimited: boolean;
  availableFrom?: string; // HH:MM format
  availableUntil?: string; // HH:MM format
  availableDays?: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  tags?: string[];
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  analytics: ItemAnalytics;
  createdAt: string;
  updatedAt: string;
  // Virtual fields
  discountPercentage?: number;
  isOnSale?: boolean;
}

export interface CreateCategoryData {
  business: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  slug?: string;
  image?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
  isVisible?: boolean;
  availableFrom?: string;
  availableUntil?: string;
  availableDays?: string[];
  subcategories?: SubcategoryInput[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

export interface CreateMenuItemData {
  business?: string;
  category: string;
  subcategory?: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  slug?: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  currency?: 'IRR' | 'USD' | 'EUR';
  preparationTime?: number;
  calories?: number;
  servingSize?: string;
  ingredients?: Ingredient[];
  nutritionFacts?: NutritionFacts;
  allergens?: string[];
  dietaryInfo?: string[];
  spicyLevel?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isHalal?: boolean;
  isSpecial?: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  variants?: ItemVariant[];
  addons?: ItemAddon[];
  order?: number;
  isActive?: boolean;
  isAvailable?: boolean;
  stockQuantity?: number;
  isUnlimited?: boolean;
  availableFrom?: string;
  availableUntil?: string;
  availableDays?: string[];
  tags?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface UpdateMenuItemData extends Partial<CreateMenuItemData> {}

export interface MenuFilters {
  businessId?: string;
  categoryId?: string;
  search?: string;
  isActive?: boolean;
  isAvailable?: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
  priceMin?: number;
  priceMax?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  allergens?: string[];
  dietaryInfo?: string[];
  sortBy?: 'name' | 'price' | 'rating' | 'order' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CategoryFilters {
  businessId: string;
  search?: string;
  isActive?: boolean;
  isVisible?: boolean;
  sortBy?: 'name' | 'order' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface MenuItemCard {
  _id: string;
  name: string;
  nameEn?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  images?: string[];
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  isActive: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  isNew: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  spicyLevel?: number;
  rating?: number;
  reviewCount?: number;
  discountPercentage?: number;
  preparationTime?: number;
}

export interface CategoryCard {
  _id: string;
  name: string;
  nameEn?: string;
  description?: string;
  slug: string;
  image?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  isVisible: boolean;
  itemsCount?: number;
}

export interface MenuStats {
  totalCategories: number;
  totalItems: number;
  activeCategories: number;
  activeItems: number;
  featuredItems: number;
  popularItems: number;
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
}
