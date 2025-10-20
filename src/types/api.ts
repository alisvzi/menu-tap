// API response and error handling types
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: PaginationMeta;
  timestamp?: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: string[] | Record<string, string>;
  code?: string;
  statusCode?: number;
  timestamp?: string;
  path?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ApiErrorResponse {
  error: string;
  details?: ValidationError[] | string[];
  statusCode: number;
  timestamp: string;
  path: string;
}

// Request types
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface SearchQuery extends PaginationQuery {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BusinessQuery extends SearchQuery {
  owner?: string;
  city?: string;
  cuisine?: string;
  priceRange?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

export interface CategoryQuery extends SearchQuery {
  businessId: string;
  isActive?: boolean;
  isVisible?: boolean;
}

export interface MenuItemQuery extends SearchQuery {
  businessId?: string;
  categoryId?: string;
  isActive?: boolean;
  isAvailable?: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
  priceMin?: number;
  priceMax?: number;
  allergens?: string[];
  dietaryInfo?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
}

// Response wrapper types
export interface BusinessListResponse {
  businesses: any[];
  pagination: PaginationMeta;
}

export interface CategoryListResponse {
  categories: any[];
  pagination: PaginationMeta;
}

export interface MenuItemListResponse {
  menuItems: any[];
  pagination: PaginationMeta;
}

export interface SingleBusinessResponse {
  business: any;
}

export interface SingleCategoryResponse {
  category: any;
}

export interface SingleMenuItemResponse {
  menuItem: any;
}

// Upload types
export interface UploadResponse {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
}

export interface FileUploadData {
  file: File;
  folder?: string;
  maxSize?: number;
  allowedTypes?: string[];
}

// Bulk operation types
export interface BulkOperationResponse {
  success: number;
  failed: number;
  errors?: Array<{
    id: string;
    error: string;
  }>;
}

export interface BulkUpdateRequest {
  ids: string[];
  data: Record<string, any>;
}

export interface BulkDeleteRequest {
  ids: string[];
  hardDelete?: boolean;
}

// Analytics types
export interface AnalyticsQuery {
  businessId?: string;
  startDate?: string;
  endDate?: string;
  granularity?: 'day' | 'week' | 'month' | 'year';
}

export interface AnalyticsResponse {
  views: number;
  orders: number;
  revenue: number;
  averageOrderValue: number;
  topItems: Array<{
    id: string;
    name: string;
    orders: number;
    revenue: number;
  }>;
  topCategories: Array<{
    id: string;
    name: string;
    orders: number;
    revenue: number;
  }>;
  chartData: Array<{
    date: string;
    views: number;
    orders: number;
    revenue: number;
  }>;
}

// Export types
export interface ExportQuery {
  format: 'csv' | 'xlsx' | 'json';
  fields?: string[];
  filters?: Record<string, any>;
}

export interface ExportResponse {
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  recordCount: number;
  expiresAt: string;
}

// Webhook types
export interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  timestamp: string;
  businessId?: string;
}

export interface WebhookResponse {
  received: boolean;
  timestamp: string;
}
