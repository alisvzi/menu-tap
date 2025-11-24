import { connectDB } from "@/lib/db/connection";
import { handleApiError } from "@/lib/errors";
import Category from "@/lib/models/Category";
import User from "@/lib/models/User";
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

// GET /api/categories - Get categories by user
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");
    const isActive = searchParams.get("isActive");
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (userId) {
      query.user = userId;
    } else {
      // If no userId provided, try to get from token
      try {
        const decoded = await verifyToken(request);
        query.user = decoded.userId;
      } catch (error) {
        return NextResponse.json(
          { error: "User ID required or valid token needed" },
          { status: 400 }
        );
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { nameEn: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (isActive !== null) {
      query.isActive = isActive === "true";
    }

    // Execute query
    const categories = await Category.find(query)
      .populate("user", "firstName lastName email")
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Category.countDocuments(query);

    return NextResponse.json({
      categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Get categories error:", error);
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

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const decoded = await verifyToken(request);

    const body = await request.json();
    const {
      name,
      nameEn,
      description,
      descriptionEn,
      slug,
      image,
      icon,
      order,
      isActive,
      isVisible,
      availableFrom,
      availableUntil,
      availableDays,
      seo,
    } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Verify user exists and has completed business profile
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.business?.isCompleted) {
      return NextResponse.json(
        { error: "Please complete your business profile first" },
        { status: 400 }
      );
    }

    // Check if slug is unique within the user's categories
    if (slug) {
      const existingCategory = await Category.findOne({
        user: decoded.userId,
        slug,
      });
      if (existingCategory) {
        return NextResponse.json(
          { error: "Category slug already exists" },
          { status: 409 }
        );
      }
    }

    // Generate slug if not provided
    let categorySlug = slug;
    if (!categorySlug) {
      categorySlug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

      // Ensure uniqueness within user's categories
      let counter = 1;
      const originalSlug = categorySlug;
      while (
        await Category.findOne({ user: decoded.userId, slug: categorySlug })
      ) {
        categorySlug = `${originalSlug}-${counter}`;
        counter++;
      }
    }

    // Get the next order number if not provided
    let categoryOrder = order;
    if (categoryOrder === undefined || categoryOrder === null) {
      const lastCategory = await Category.findOne({
        user: decoded.userId,
      }).sort({ order: -1 });
      categoryOrder = lastCategory ? lastCategory.order + 1 : 1;
    }

    // Create category
    const category = new Category({
      user: decoded.userId,
      name,
      nameEn,
      description,
      descriptionEn,
      slug: categorySlug,
      image,
      icon,
      order: categoryOrder,
      isActive: isActive !== undefined ? isActive : true,
      isVisible: isVisible !== undefined ? isVisible : true,
      availableFrom,
      availableUntil,
      availableDays,
      seo: seo || {},
    });

    await category.save();

    // Populate user info
    await category.populate("user", "firstName lastName email");

    return NextResponse.json(
      {
        message: "Category created successfully",
        category,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create category error:", error);

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
