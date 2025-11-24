import { connectDB } from "@/lib/db/connection";
import { handleApiError } from "@/lib/errors";
import User from "@/lib/models/User";
import Provider from "@/lib/models/Provider";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

// Helper function to verify JWT token
async function verifyToken(request: NextRequest) {
  const token =
    request.cookies.get("auth-token")?.value ||
    request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new Error("No token provided");
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key"
  ) as any;
  return decoded;
}

// GET /api/auth/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const decoded = await verifyToken(request);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Load provider for this user and map to legacy `business` shape
    const provider = (await Provider.findOne({ user: user._id }).lean()) as any;
    const business = provider
      ? {
          name: provider.name,
          nameEn: provider.nameEn,
          description: provider.description,
          descriptionEn: provider.descriptionEn,
          slug: provider.slug,
          logo: provider.logo,
          coverImage: provider.coverImage,
          businessType: provider.providerType,
          address: provider.address,
          workingHours: provider.workingHours,
          phone: provider.phone,
          email: provider.email,
          website: provider.website,
          instagram: provider.instagram,
          telegram: provider.telegram,
          whatsapp: provider.whatsapp,
          cuisine: provider.cuisine,
          priceRange: provider.priceRange,
          features: provider.features,
          settings: provider.settings,
          isActive: provider.isActive,
          isCompleted: provider.isCompleted,
        }
      : undefined;

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        business,
      },
    });
  } catch (error: any) {
    console.error("Get profile error:", error);

    const errorResponse = handleApiError(error);
    return NextResponse.json(
      {
        error: errorResponse.error,
        code: errorResponse.code,
      },
      { status: errorResponse.statusCode }
    );
  }
}

// PUT /api/auth/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const decoded = await verifyToken(request);
    const body = await request.json();

    const { firstName, lastName, phone, avatar, business } = body;

    // Find and update user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update fields if provided
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    // Upsert provider profile if provided under `business`
    let provider: any;
    if (business) {
      provider = await Provider.findOne({ user: user._id });
      const providerData = {
        name: business.name,
        nameEn: business.nameEn,
        description: business.description,
        descriptionEn: business.descriptionEn,
        slug: business.slug,
        logo: business.logo,
        coverImage: business.coverImage,
        providerType: business.businessType,
        address: business.address,
        workingHours: business.workingHours,
        phone: business.phone,
        email: business.email,
        website: business.website,
        instagram: business.instagram,
        telegram: business.telegram,
        whatsapp: business.whatsapp,
        cuisine: business.cuisine,
        priceRange: business.priceRange,
        features: business.features,
        settings: business.settings,
        isActive: business.isActive ?? true,
        isCompleted: business.isCompleted ?? false,
      };

      if (provider) {
        Object.assign(provider, providerData);
        await provider.save();
      } else {
        provider = new Provider({ user: user._id, ...providerData });
        await provider.save();
      }
    }

    await user.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        business: provider
          ? {
              name: provider.name,
              nameEn: provider.nameEn,
              description: provider.description,
              descriptionEn: provider.descriptionEn,
              slug: provider.slug,
              logo: provider.logo,
              coverImage: provider.coverImage,
              businessType: provider.providerType,
              address: provider.address,
              workingHours: provider.workingHours,
              phone: provider.phone,
              email: provider.email,
              website: provider.website,
              instagram: provider.instagram,
              telegram: provider.telegram,
              whatsapp: provider.whatsapp,
              cuisine: provider.cuisine,
              priceRange: provider.priceRange,
              features: provider.features,
              settings: provider.settings,
              isActive: provider.isActive,
              isCompleted: provider.isCompleted,
            }
          : undefined,
      },
    });
  } catch (error: any) {
    console.error("Update profile error:", error);

    const errorResponse = handleApiError(error);
    return NextResponse.json(
      {
        error: errorResponse.error,
        details: errorResponse.details,
      },
      { status: errorResponse.statusCode }
    );
  }
}

// PATCH /api/auth/profile - Partial update user profile
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const decoded = await verifyToken(request);
    const body = await request.json();

    const { business, ...userUpdates } = body || {};

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: userUpdates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Optionally update provider
    let provider;
    if (business) {
      provider = await Provider.findOne({ user: updatedUser._id });
      const providerData = {
        name: business.name,
        nameEn: business.nameEn,
        description: business.description,
        descriptionEn: business.descriptionEn,
        slug: business.slug,
        logo: business.logo,
        coverImage: business.coverImage,
        providerType: business.businessType,
        address: business.address,
        workingHours: business.workingHours,
        phone: business.phone,
        email: business.email,
        website: business.website,
        instagram: business.instagram,
        telegram: business.telegram,
        whatsapp: business.whatsapp,
        cuisine: business.cuisine,
        priceRange: business.priceRange,
        features: business.features,
        settings: business.settings,
        isActive: business.isActive ?? true,
        isCompleted: business.isCompleted ?? false,
      };

      if (provider) {
        Object.assign(provider, providerData);
        await provider.save();
      } else {
        provider = new Provider({ user: updatedUser._id, ...providerData });
        await provider.save();
      }
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        isVerified: updatedUser.isVerified,
        business: provider
          ? {
              name: provider.name,
              nameEn: provider.nameEn,
              description: provider.description,
              descriptionEn: provider.descriptionEn,
              slug: provider.slug,
              logo: provider.logo,
              coverImage: provider.coverImage,
              businessType: provider.providerType,
              address: provider.address,
              workingHours: provider.workingHours,
              phone: provider.phone,
              email: provider.email,
              website: provider.website,
              instagram: provider.instagram,
              telegram: provider.telegram,
              whatsapp: provider.whatsapp,
              cuisine: provider.cuisine,
              priceRange: provider.priceRange,
              features: provider.features,
              settings: provider.settings,
              isActive: provider.isActive,
              isCompleted: provider.isCompleted,
            }
          : undefined,
      },
    });
  } catch (error: any) {
    console.error("Patch profile error:", error);

    const errorResponse = handleApiError(error);
    return NextResponse.json(
      {
        error: errorResponse.error,
        details: errorResponse.details,
      },
      { status: errorResponse.statusCode }
    );
  }
}
