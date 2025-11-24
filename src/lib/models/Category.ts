import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  _id: string;
  user: mongoose.Types.ObjectId;
  provider: mongoose.Types.ObjectId;
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
  subcategories?: {
    _id?: mongoose.Types.ObjectId;
    name_fa: string;
    name_en?: string;
  }[];
  availableFrom?: string;
  availableUntil?: string;
  availableDays?: string[];
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    provider: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: [true, "Provider reference is required"],
    },
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [100, "Category name cannot exceed 100 characters"],
    },
    nameEn: {
      type: String,
      trim: true,
      maxlength: [100, "English name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description cannot exceed 300 characters"],
    },
    descriptionEn: {
      type: String,
      trim: true,
      maxlength: [300, "English description cannot exceed 300 characters"],
    },
    slug: {
      type: String,
      required: [true, "Category slug is required"],
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens",
      ],
    },
    image: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    subcategories: [
      {
        name_fa: {
          type: String,
          required: [true, "Subcategory Persian name is required"],
          trim: true,
          maxlength: [
            100,
            "Subcategory Persian name cannot exceed 100 characters",
          ],
        },
        name_en: {
          type: String,
          trim: true,
          maxlength: [
            100,
            "Subcategory English name cannot exceed 100 characters",
          ],
        },
      },
    ],
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        const r: any = ret;
        r.id = r._id;
        delete r._id;
        delete r.__v;
        return r;
      },
    },
  }
);

// Compound index to ensure unique slug per user
CategorySchema.index({ user: 1, slug: 1 }, { unique: true });

// Other indexes for better performance
CategorySchema.index({ user: 1, isActive: 1, isVisible: 1 });
CategorySchema.index({ user: 1, order: 1 });
CategorySchema.index({ createdAt: -1 });

// Virtual for menu items count in this category
CategorySchema.virtual("itemsCount", {
  ref: "MenuItem",
  localField: "_id",
  foreignField: "category",
  count: true,
});

// Pre-save middleware to generate slug if not provided
CategorySchema.pre("save", async function (next) {
  if (!this.slug && this.name) {
    // Create slug from name
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .trim();
  }
  next();
});

export default mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);
