import { connectDB } from "@/lib/db/connection";
import Provider from "@/lib/models/Provider";
import { NextRequest, NextResponse } from "next/server";

// Helper: verify JWT and return decoded payload
import { verifyToken } from "@/utility/server-helpers";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const owner = searchParams.get("owner");
    const search = searchParams.get("search");
    const city = searchParams.get("city");
    const cuisine = searchParams.get("cuisine");
    const priceRange = searchParams.get("priceRange");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // Build query
    const query: any = {};
    let isOwnerListing = false;

    if (owner === "me") {
      // Owner listing requires authentication
      let decoded: any;
      try {
        decoded = verifyToken(request);
      } catch (err) {
        return NextResponse.json(
          { error: "Authentication required for owner listing" },
          { status: 401 }
        );
      }
      isOwnerListing = true;
      query.user = decoded.userId;
    } else {
      // Public listing only shows active providers
      query.isActive = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { nameEn: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (city) {
      query["address.city"] = { $regex: city, $options: "i" };
    }

    if (cuisine) {
      query["cuisine"] = { $in: [cuisine] };
    }

    if (priceRange) {
      query["priceRange"] = priceRange;
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Fetch businesses with pagination
    const businesses = await Provider.find(query)
      .select(
        "name nameEn slug logo coverImage description descriptionEn address providerType cuisine priceRange features phone isActive isCompleted createdAt"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Provider.countDocuments(query);

    // Transform data to match IProvider (adjust as needed for client)
    const transformed = businesses.map((provider: any) => ({
      _id: provider._id,
      name: provider.name,
      nameEn: provider.nameEn,
      slug: provider.slug,
      logo: provider.logo,
      coverImage: provider.coverImage,
      description: provider.description,
      descriptionEn: provider.descriptionEn,
      providerType: provider.providerType,
      address: {
        city: provider.address?.city,
        street: provider.address?.street,
      },
      cuisine: provider.cuisine,
      priceRange: provider.priceRange,
      features: provider.features,
      phone: provider.phone,
      isActive: provider.isActive,
      isCompleted: provider.isCompleted,
      createdAt: provider.createdAt,
    }));

    // Return both `data` and legacy `businesses` for compatibility
    return NextResponse.json({
      success: true,
      data: transformed,
      businesses: transformed,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching providers:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت لیست مجموعه‌ها",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Require authentication
    let decoded: any;
    try {
      decoded = verifyToken(request);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "برای ایجاد مجموعه، ورود الزامی است" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      nameEn,
      description,
      descriptionEn,
      slug,
      providerType,
      logo,
      coverImage,
      address,
      workingHours,
      phone,
      email,
      website,
      instagram,
      telegram,
      whatsapp,
      priceRange,
      cuisine,
      features,
      settings,
      branches,
      isActive,
      isVerified,
    } = body || {};

    if (
      !name ||
      !slug ||
      !phone ||
      !providerType ||
      !address?.street ||
      !address?.city ||
      !address?.state
    ) {
      return NextResponse.json(
        { success: false, message: "اطلاعات اصلی کسب‌وکار ناقص است" },
        { status: 400 }
      );
    }

    // Ensure slug uniqueness
    const existing = await Provider.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "این آدرس منو (slug) قبلاً استفاده شده است",
        },
        { status: 409 }
      );
    }

    // Create provider document based on Provider model
    const provider = await Provider.create({
      user: decoded.userId,
      name,
      nameEn,
      description,
      descriptionEn,
      slug,
      providerType,
      logo,
      coverImage,
      address,
      workingHours: Array.isArray(workingHours) ? workingHours : [],
      phone,
      email,
      website,
      instagram,
      telegram,
      whatsapp,
      priceRange,
      cuisine: Array.isArray(cuisine) ? cuisine : [],
      features: Array.isArray(features) ? features : [],
      settings,
      branches: Array.isArray(branches) ? branches : [],
      isActive: typeof isActive === "boolean" ? isActive : true,
      isCompleted: false,
      isVerified: typeof isVerified === "boolean" ? isVerified : false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "کسب‌وکار با موفقیت ایجاد شد",
        data: {
          _id: provider._id,
          name: provider.name,
          slug: provider.slug,
          logo: provider.logo,
          coverImage: provider.coverImage,
          description: provider.description,
          address: provider.address,
          phone: provider.phone,
          isActive: provider.isActive,
          isCompleted: provider.isCompleted,
          createdAt: provider.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating provider:", error);
    return NextResponse.json(
      { success: false, message: "خطا در ایجاد مجموعه" },
      { status: 500 }
    );
  }
}
