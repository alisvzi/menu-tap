import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connection";
import MenuItem from "@/lib/models/MenuItem";
import Category from "@/lib/models/Category";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";
import { handleApiError } from "@/lib/errors";

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
    process.env.JWT_SECRET || "your-secret-key",
  ) as any;
  return decoded;
}

// GET /api/menu-items - Get menu items by user or category
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");
    const isActive = searchParams.get("isActive");
    const isAvailable = searchParams.get("isAvailable");
    const isFeatured = searchParams.get("isFeatured");
    const isPopular = searchParams.get("isPopular");
    const sortBy = searchParams.get("sortBy") || "order";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (userId) {
      query.user = userId;
    } else if (categoryId) {
      query.category = categoryId;
    } else {
      // If no userId or categoryId provided, try to get from token
      try {
        const decoded = await verifyToken(request);
        query.user = decoded.userId;
      } catch (error) {
        return NextResponse.json(
          { error: "User ID, Category ID required or valid token needed" },
          { status: 400 },
        );
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { nameEn: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    if (isActive !== null) {
      query.isActive = isActive === "true";
    }

    if (isAvailable !== null) {
      query.isAvailable = isAvailable === "true";
    }

    if (isFeatured !== null) {
      query.isFeatured = isFeatured === "true";
    }

    if (isPopular !== null) {
      query.isPopular = isPopular === "true";
    }

    // Build sort object
    const sort: any = {};
    if (sortBy === "price") {
      sort.price = sortOrder === "desc" ? -1 : 1;
    } else if (sortBy === "name") {
      sort.name = sortOrder === "desc" ? -1 : 1;
    } else if (sortBy === "createdAt") {
      sort.createdAt = sortOrder === "desc" ? -1 : 1;
    } else if (sortBy === "rating") {
      sort["analytics.rating"] = sortOrder === "desc" ? -1 : 1;
    } else {
      sort.order = 1;
      sort.createdAt = -1;
    }

    // Execute query
    const menuItems = await MenuItem.find(query)
      .populate("user", "firstName lastName email")
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await MenuItem.countDocuments(query);

    return NextResponse.json({
      menuItems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Get menu items error:", error);
    const errorResponse = handleApiError(error);
    return NextResponse.json(
      {
        error: errorResponse.error,
        details: errorResponse.details,
      },
      { status: errorResponse.statusCode },
    );
  }
}

// POST /api/menu-items - Create a new menu item
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Verify authentication
    const decoded = await verifyToken(request);

    const body = await request.json();
    const {
      category,
      name,
      nameEn,
      description,
      descriptionEn,
      slug,
      images,
      price,
      originalPrice,
      currency,
      preparationTime,
      calories,
      servingSize,
      ingredients,
      nutritionFacts,
      allergens,
      dietaryInfo,
      spicyLevel,
      isVegetarian,
      isVegan,
      isGlutenFree,
      isHalal,
      isSpecial,
      isFeatured,
      isPopular,
      isNew,
      variants,
      addons,
      order,
      isActive,
      isAvailable,
      stockQuantity,
      isUnlimited,
      availableFrom,
      availableUntil,
      availableDays,
      tags,
      seo,
    } = body;

    // Validation
    if (!category || !name || price === undefined) {
      return NextResponse.json(
        { error: "Category ID, name, and price are required" },
        { status: 400 },
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
        { status: 400 },
      );
    }

    // Verify category exists and belongs to the user
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    if (categoryDoc.user.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: "Category does not belong to you" },
        { status: 403 },
      );
    }

    // Check if slug is unique within the user's menu items
    if (slug) {
      const existingMenuItem = await MenuItem.findOne({
        user: decoded.userId,
        slug,
      });
      if (existingMenuItem) {
        return NextResponse.json(
          { error: "Menu item slug already exists" },
          { status: 409 },
        );
      }
    }

    // Generate slug if not provided
    let menuItemSlug = slug;
    if (!menuItemSlug) {
      menuItemSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

      // Ensure uniqueness within user's menu items
      let counter = 1;
      let originalSlug = menuItemSlug;
      while (
        await MenuItem.findOne({ user: decoded.userId, slug: menuItemSlug })
      ) {
        menuItemSlug = `${originalSlug}-${counter}`;
        counter++;
      }
    }

    // Get the next order number if not provided
    let menuItemOrder = order;
    if (menuItemOrder === undefined || menuItemOrder === null) {
      const lastMenuItem = await MenuItem.findOne({ category }).sort({
        order: -1,
      });
      menuItemOrder = lastMenuItem ? lastMenuItem.order + 1 : 1;
    }

    // Create menu item
    const menuItem = new MenuItem({
      user: decoded.userId,
      category,
      name,
      nameEn,
      description,
      descriptionEn,
      slug: menuItemSlug,
      images: images || [],
      price,
      originalPrice,
      currency: currency || "IRR",
      preparationTime,
      calories,
      servingSize,
      ingredients: ingredients || [],
      nutritionFacts,
      allergens: allergens || [],
      dietaryInfo: dietaryInfo || [],
      spicyLevel: spicyLevel || 0,
      isVegetarian: isVegetarian || false,
      isVegan: isVegan || false,
      isGlutenFree: isGlutenFree || false,
      isHalal: isHalal || false,
      isSpecial: isSpecial || false,
      isFeatured: isFeatured || false,
      isPopular: isPopular || false,
      isNew: isNew || false,
      variants: variants || [],
      addons: addons || [],
      order: menuItemOrder,
      isActive: isActive !== undefined ? isActive : true,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      stockQuantity,
      isUnlimited: isUnlimited !== undefined ? isUnlimited : true,
      availableFrom,
      availableUntil,
      availableDays: availableDays || [],
      tags: tags || [],
      seo: seo || {},
      analytics: {
        viewCount: 0,
        orderCount: 0,
        favoriteCount: 0,
        reviewCount: 0,
      },
    });

    await menuItem.save();

    // Populate references
    await menuItem.populate([
      { path: "user", select: "firstName lastName email" },
      { path: "category", select: "name slug" },
    ]);

    return NextResponse.json(
      {
        message: "Menu item created successfully",
        menuItem,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Create menu item error:", error);

    const errorResponse = handleApiError(error);
    return NextResponse.json(
      {
        error: errorResponse.error,
        details: errorResponse.details,
      },
      { status: errorResponse.statusCode },
    );
  }
}
