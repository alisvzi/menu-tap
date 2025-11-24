import { connectDB } from "@/lib/db/connection";
import { handleApiError } from "@/lib/errors";
import User from "@/lib/models/User";
import Provider from "@/lib/models/Provider";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get token from header
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as any;

    // Find user
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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
    console.error("Token verification error:", error);

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
