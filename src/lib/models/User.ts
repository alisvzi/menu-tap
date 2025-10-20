import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: "customer" | "admin";
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  business?: {
    name: string;
    nameEn?: string;
    description?: string;
    descriptionEn?: string;
    slug: string;
    logo?: string;
    coverImage?: string;
    businessType: string;
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
      day: string;
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
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^09[0-9]{9}$/, "Please enter a valid phone number"],
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    business: {
      name: {
        type: String,
        trim: true,
        maxlength: [100, "Business name cannot exceed 100 characters"],
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
        unique: true,
        lowercase: true,
        trim: true,
        sparse: true,
        match: [
          /^[a-z0-9-]+$/,
          "Slug can only contain lowercase letters, numbers, and hyphens",
        ],
      },
      logo: {
        type: String,
        default: null,
      },
      coverImage: {
        type: String,
        default: null,
      },
      businessType: {
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
      },
      address: {
        street: {
          type: String,
          trim: true,
        },
        city: {
          type: String,
          trim: true,
        },
        state: {
          type: String,
          trim: true,
        },
        postalCode: {
          type: String,
          trim: true,
        },
        coordinates: {
          lat: { type: Number },
          lng: { type: Number },
        },
      },
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
          isOpen: {
            type: Boolean,
            default: true,
          },
          openTime: {
            type: String,
            match: [
              /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
              "Please enter a valid time format (HH:MM)",
            ],
          },
          closeTime: {
            type: String,
            match: [
              /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
              "Please enter a valid time format (HH:MM)",
            ],
          },
        },
      ],
      phone: {
        type: String,
        trim: true,
        match: [/^09[0-9]{9}$/, "Please enter a valid phone number"],
      },
      email: {
        type: String,
        lowercase: true,
        trim: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Please enter a valid email",
        ],
      },
      website: {
        type: String,
        trim: true,
      },
      instagram: {
        type: String,
        trim: true,
      },
      telegram: {
        type: String,
        trim: true,
      },
      whatsapp: {
        type: String,
        trim: true,
      },
      cuisine: [
        {
          type: String,
          trim: true,
        },
      ],
      priceRange: {
        type: String,
        enum: ["budget", "moderate", "expensive", "fine-dining"],
        default: "moderate",
      },
      features: [
        {
          type: String,
          trim: true,
        },
      ],
      settings: {
        allowOnlineOrdering: {
          type: Boolean,
          default: false,
        },
        showPrices: {
          type: Boolean,
          default: true,
        },
        showCalories: {
          type: Boolean,
          default: false,
        },
        showIngredients: {
          type: Boolean,
          default: false,
        },
        theme: {
          type: String,
          default: "default",
        },
        primaryColor: {
          type: String,
          default: "#d4a574",
        },
        secondaryColor: {
          type: String,
          default: "#f4e4c1",
        },
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      isCompleted: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.verificationToken;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpires;
        return ret;
      },
    },
  },
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Index for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ verificationToken: 1 });
UserSchema.index({ resetPasswordToken: 1 });

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
