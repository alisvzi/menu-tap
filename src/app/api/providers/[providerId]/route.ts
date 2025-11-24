import { connectDB } from "@/lib/db/connection";
import Provider from "@/lib/models/Provider";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

// Helper: verify JWT and return decoded payload
function verifyToken(request: NextRequest): any {
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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ providerId: string }> }
) {
  try {
    await connectDB();

    const { providerId } = await context.params;

    // Check if the user is authenticated
    let decoded: any;
    try {
      decoded = verifyToken(request);
    } catch (err) {
      // Not authenticated, treat as public request
      decoded = null;
    }

    // Base query
    let query: any = { _id: providerId };

    // Accept slug as identifier if not a valid ObjectId
    const isObjectId = /^[a-fA-F0-9]{24}$/.test(providerId);
    if (!isObjectId) {
      query = { slug: providerId };
    }

    // Public requests only see active and completed providers
    if (!decoded) {
      query.isActive = true;
    }

    const provider = (await Provider.findOne(query)
      .populate({ path: "user", select: "firstName lastName email" })
      .lean()) as any;

    if (!provider) {
      return NextResponse.json(
        { success: false, message: "مجموعه یافت نشد" },
        { status: 404 }
      );
    }

    const ownerId = (provider as any)?.user?._id ?? provider.user;
    const isOwner = decoded && String(ownerId) === String(decoded.userId);

    // If not the owner and the provider is not active/completed, deny access
    if (!isOwner && !provider.isActive) {
      return NextResponse.json(
        { success: false, message: "شما اجازه دسترسی به این صفحه را ندارید" },
        { status: 403 }
      );
    }

    // Separate user and provider data
    const { user: ownerUser, ...providerData } = provider as any;

    // Base data for all viewers
    const responseData: any = {
      _id: providerData._id,
      ownerId: ownerUser._id, // For client-side owner checks
      name: providerData.name,
      nameEn: providerData.nameEn,
      slug: providerData.slug,
      logo: providerData.logo,
      coverImage: providerData.coverImage,
      description: providerData.description,
      descriptionEn: providerData.descriptionEn,
      providerType: providerData.providerType,
      address: providerData.address,
      branches: providerData.branches,
      cuisine: providerData.cuisine,
      priceRange: providerData.priceRange,
      phone: providerData.phone,
      website: providerData.website,
      instagram: providerData.instagram,
      telegram: providerData.telegram,
      whatsapp: providerData.whatsapp,
      workingHours: providerData.workingHours,
      features: providerData.features,
      settings: providerData.settings,
      createdAt: providerData.createdAt,
    };

    // Add sensitive data only for the owner
    if (isOwner) {
      responseData.owner = {
        firstName: ownerUser.firstName,
        lastName: ownerUser.lastName,
        email: ownerUser.email,
      };
      responseData.isActive = providerData.isActive;
      responseData.isCompleted = providerData.isCompleted;
      responseData.isVerified = providerData.isVerified;
      responseData.email = providerData.email;
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      business: responseData, // For legacy compatibility
    });
  } catch (error) {
    console.error("Error fetching provider:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت اطلاعات مجموعه",
      },
      { status: 500 }
    );
  }
}

// PUT /api/businesses/[slug] - Update provider details (owner only)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ providerId: string }> }
) {
  try {
    await connectDB();

    // Require authentication
    let decoded: any;
    try {
      decoded = verifyToken(request);
    } catch (err) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      nameEn,
      description,
      descriptionEn,
      slug: newSlug,
      providerType,
      logo,
      coverImage,
      phone,
      email,
      website,
      instagram,
      telegram,
      whatsapp,
      address,
      workingHours,
      cuisine,
      priceRange,
      features,
      settings,
      isActive,
      isCompleted,
    } = body || {};

    // Find provider by slug and ensure ownership
    const { providerId } = await context.params;
    const provider = await Provider.findById(providerId);

    if (!provider) {
      return NextResponse.json(
        { success: false, message: "مجموعه یافت نشد" },
        { status: 404 }
      );
    }

    if (String(provider.user) !== String(decoded.userId)) {
      return NextResponse.json(
        { success: false, message: "شما اجازه ویرایش این مجموعه را ندارید" },
        { status: 403 }
      );
    }

    // Apply updates using spread syntax for cleaner code
    Object.assign(provider, body);

    // Handle slug change with uniqueness check
    if (newSlug && newSlug !== provider.slug) {
      const exists = await Provider.findOne({ slug: newSlug });
      if (exists) {
        return NextResponse.json(
          { success: false, message: "این آدرس قبلاً استفاده شده است" },
          { status: 409 }
        );
      }
      provider.slug = newSlug;
    }

    await provider.save();

    // Populate owner user for response mapping
    await provider.populate({
      path: "user",
      select: "firstName lastName email",
    });

    const { user: ownerUser, ...providerData } = (provider.toObject?.() ||
      provider) as any;

    const responseData = {
      _id: providerData._id,
      ownerId: ownerUser._id,
      ...providerData,
    };

    return NextResponse.json({
      success: true,
      message: "مجموعه با موفقیت بروزرسانی شد",
      data: responseData,
    });
  } catch (error) {
    console.error("Error updating provider:", error);
    return NextResponse.json(
      { success: false, message: "خطا در بروزرسانی مجموعه" },
      { status: 500 }
    );
  }
}

// DELETE /api/businesses/[slug] - Delete provider (owner only)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ providerId: string }> }
) {
  try {
    await connectDB();

    // Require authentication
    let decoded: any;
    try {
      decoded = verifyToken(request);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "احراز هویت ناموفق" },
        { status: 401 }
      );
    }

    const { providerId } = await context.params;
    const provider = await Provider.findById(providerId);

    if (!provider) {
      return NextResponse.json(
        { success: false, message: "مجموعه یافت نشد" },
        { status: 404 }
      );
    }

    if (String(provider.user) !== String(decoded.userId)) {
      return NextResponse.json(
        { success: false, message: "شما اجازه حذف این مجموعه را ندارید" },
        { status: 403 }
      );
    }

    await Provider.deleteOne({ _id: provider._id });

    return NextResponse.json({
      success: true,
      message: "مجموعه با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("Error deleting provider:", error);
    return NextResponse.json(
      { success: false, message: "خطا در حذف مجموعه" },
      { status: 500 }
    );
  }
}
