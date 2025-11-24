export interface Category {
  _id: string;
  name: string;
  nameEn?: string;
  description?: string;
  slug: string;
  image?: string;
  icon?: string;
  order: number;
  subcategories: Array<{
    name_fa: string;
    name_en?: string;
  }>;
}

export interface Provider {
  _id: string;
  name: string;
  nameEn?: string;
  logo?: string;
}
