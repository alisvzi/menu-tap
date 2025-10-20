import mongoose, { Document, Schema } from "mongoose";

export interface IMenuItem extends Document {
  _id: string;
  user: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  slug: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  currency: string;
  preparationTime?: number;
  calories?: number;
  servingSize?: string;
  ingredients?: {
    name: string;
    nameEn?: string;
    allergen?: boolean;
  }[];
  nutritionFacts?: {
    protein?: number;
    carbohydrates?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
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
  variants?: {
    name: string;
    nameEn?: string;
    price?: number;
    additionalPrice?: number;
  }[];
  addons?: {
    name: string;
    nameEn?: string;
    price: number;
    category?: string;
    isRequired?: boolean;
    maxSelections?: number;
  }[];
  order: number;
  isActive: boolean;
  isAvailable: boolean;
  stockQuantity?: number;
  isUnlimited: boolean;
  availableFrom?: string;
  availableUntil?: string;
  availableDays?: string[];
  tags?: string[];
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  analytics: {
    viewCount: number;
    orderCount: number;
    favoriteCount: number;
    rating?: number;
    reviewCount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category reference is required"],
    },
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      maxlength: [100, "Item name cannot exceed 100 characters"],
    },
    nameEn: {
      type: String,
      trim: true,
      maxlength: [100, "English name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    descriptionEn: {
      type: String,
      trim: true,
      maxlength: [500, "English description cannot exceed 500 characters"],
    },
    slug: {
      type: String,
      required: [true, "Item slug is required"],
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens",
      ],
    },
    images: [
      {
        type: String,
      },
    ],
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    currency: {
      type: String,
      default: "IRR",
      enum: ["IRR", "USD", "EUR"],
    },
    preparationTime: {
      type: Number,
      min: [0, "Preparation time cannot be negative"],
    },
    calories: {
      type: Number,
      min: [0, "Calories cannot be negative"],
    },
    servingSize: {
      type: String,
      trim: true,
    },
    ingredients: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        nameEn: {
          type: String,
          trim: true,
        },
        allergen: {
          type: Boolean,
          default: false,
        },
      },
    ],
    nutritionFacts: {
      protein: {
        type: Number,
        min: 0,
      },
      carbohydrates: {
        type: Number,
        min: 0,
      },
      fat: {
        type: Number,
        min: 0,
      },
      fiber: {
        type: Number,
        min: 0,
      },
      sugar: {
        type: Number,
        min: 0,
      },
      sodium: {
        type: Number,
        min: 0,
      },
    },
    allergens: [
      {
        type: String,
        enum: [
          "gluten",
          "dairy",
          "eggs",
          "nuts",
          "peanuts",
          "soy",
          "fish",
          "shellfish",
          "sesame",
        ],
      },
    ],
    dietaryInfo: [
      {
        type: String,
        enum: [
          "vegetarian",
          "vegan",
          "gluten-free",
          "dairy-free",
          "nut-free",
          "halal",
          "kosher",
          "organic",
          "local",
        ],
      },
    ],
    spicyLevel: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    isVegan: {
      type: Boolean,
      default: false,
    },
    isGlutenFree: {
      type: Boolean,
      default: false,
    },
    isHalal: {
      type: Boolean,
      default: false,
    },
    isSpecial: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    variants: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        nameEn: {
          type: String,
          trim: true,
        },
        price: {
          type: Number,
          min: 0,
        },
        additionalPrice: {
          type: Number,
          default: 0,
        },
      },
    ],
    addons: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        nameEn: {
          type: String,
          trim: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        category: {
          type: String,
          trim: true,
        },
        isRequired: {
          type: Boolean,
          default: false,
        },
        maxSelections: {
          type: Number,
          min: 1,
          default: 1,
        },
      },
    ],
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      min: 0,
    },
    isUnlimited: {
      type: Boolean,
      default: true,
    },
    availableFrom: {
      type: String,
      match: [
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Please enter a valid time format (HH:MM)",
      ],
    },
    availableUntil: {
      type: String,
      match: [
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Please enter a valid time format (HH:MM)",
      ],
    },
    availableDays: [
      {
        type: String,
        enum: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    seo: {
      metaTitle: {
        type: String,
        trim: true,
        maxlength: [60, "Meta title cannot exceed 60 characters"],
      },
      metaDescription: {
        type: String,
        trim: true,
        maxlength: [160, "Meta description cannot exceed 160 characters"],
      },
      keywords: [
        {
          type: String,
          trim: true,
        },
      ],
    },
    analytics: {
      viewCount: {
        type: Number,
        default: 0,
        min: 0,
      },
      orderCount: {
        type: Number,
        default: 0,
        min: 0,
      },
      favoriteCount: {
        type: Number,
        default: 0,
        min: 0,
      },
      rating: {
        type: Number,
        min: 0,
        max: 5,
      },
      reviewCount: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Compound indexes
MenuItemSchema.index({ user: 1, category: 1 });
MenuItemSchema.index({ user: 1, slug: 1 }, { unique: true });
MenuItemSchema.index({ user: 1, isActive: 1, isAvailable: 1 });
MenuItemSchema.index({ user: 1, order: 1 });
MenuItemSchema.index({ user: 1, isFeatured: 1 });
MenuItemSchema.index({ user: 1, isPopular: 1 });
MenuItemSchema.index({ user: 1, price: 1 });

// Text search index
MenuItemSchema.index({
  name: "text",
  nameEn: "text",
  description: "text",
  descriptionEn: "text",
  tags: "text",
});

// Virtuals
MenuItemSchema.virtual("discountPercentage").get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100,
    );
  }
  return 0;
});

MenuItemSchema.virtual("isOnSale").get(function () {
  return this.originalPrice && this.originalPrice > this.price;
});

// Pre-save middleware to generate slug if not provided
MenuItemSchema.pre("save", async function (next) {
  if (!this.slug && this.name) {
    // Create slug from name
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .trim();
  }

  // Auto-set dietary info based on boolean flags
  if (this.isVegetarian && !this.dietaryInfo?.includes("vegetarian")) {
    this.dietaryInfo = this.dietaryInfo || [];
    this.dietaryInfo.push("vegetarian");
  }

  if (this.isVegan && !this.dietaryInfo?.includes("vegan")) {
    this.dietaryInfo = this.dietaryInfo || [];
    this.dietaryInfo.push("vegan");
  }

  if (this.isGlutenFree && !this.dietaryInfo?.includes("gluten-free")) {
    this.dietaryInfo = this.dietaryInfo || [];
    this.dietaryInfo.push("gluten-free");
  }

  if (this.isHalal && !this.dietaryInfo?.includes("halal")) {
    this.dietaryInfo = this.dietaryInfo || [];
    this.dietaryInfo.push("halal");
  }

  next();
});

export default mongoose.models.MenuItem ||
  mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);
