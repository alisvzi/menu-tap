import mongoose, { Document, Schema } from "mongoose";

export interface IProvider extends Document {
  user: mongoose.Types.ObjectId;
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
    coordinates?: { lat: number; lng: number };
  };
  branches: {
    title: string;
    address: string;
    coordinates?: { lat: number; lng: number };
  }[];
  workingHours: {
    day:
      | "monday"
      | "tuesday"
      | "wednesday"
      | "thursday"
      | "friday"
      | "saturday"
      | "sunday";
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
  isVerified: boolean;
}

const ProviderSchema = new Schema<IProvider>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, trim: true, required: true, maxlength: 100 },
    nameEn: { type: String, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500 },
    descriptionEn: { type: String, trim: true, maxlength: 500 },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens",
      ],
    },
    logo: { type: String },
    coverImage: { type: String },
    providerType: {
      type: String,
      enum: [
        "restaurant",
        "cafe",
        "bakery",
        "fast-food",
        "food-truck",
        "catering",
        "other",
      ],
      required: true,
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      coordinates: { lat: Number, lng: Number },
    },
    branches: [
      {
        title: String,
        address: String,
        coordinates: { lat: Number, lng: Number },
      },
    ],
    workingHours: [
      {
        day: {
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
        isOpen: { type: Boolean, default: true },
        openTime: { type: String },
        closeTime: { type: String },
      },
    ],
    phone: {
      type: String,
      match: [/^09[0-9]{9}$/, "Please enter a valid phone number"],
    },
    email: { type: String },
    website: { type: String },
    instagram: { type: String },
    telegram: { type: String },
    whatsapp: { type: String },
    cuisine: [String],
    priceRange: {
      type: String,
      enum: ["budget", "moderate", "expensive", "fine-dining"],
    },
    features: [String],
    settings: {
      allowOnlineOrdering: { type: Boolean, default: false },
      showPrices: { type: Boolean, default: true },
      showCalories: { type: Boolean, default: false },
      showIngredients: { type: Boolean, default: false },
      theme: { type: String, default: "default" },
      primaryColor: { type: String },
      secondaryColor: { type: String },
    },
    isActive: { type: Boolean, default: true },
    isCompleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Provider ||
  mongoose.model<IProvider>("Provider", ProviderSchema);
