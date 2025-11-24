import { connectDB } from "@/lib/db/connection";
import { handleApiError } from "@/lib/errors";
import Category from "@/lib/models/Category";
import MenuItem from "@/lib/models/MenuItem";
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

// PUT /api/menu-items/[id] - Update a menu item
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const decoded = await verifyToken(request);
    const { id } = await context.params;

    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }
    if (menuItem.user.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: "Menu item does not belong to you" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      category,
      subcategory,
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

    // Validate and assign category change
    let categoryIdToUse = menuItem.category.toString();
    if (category !== undefined) {
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }
      if (categoryDoc.user.toString() !== decoded.userId) {
        return NextResponse.json(
          { error: "Category does not belong to you" },
          { status: 403 }
        );
      }
      categoryIdToUse = categoryDoc._id.toString();
      menuItem.category = categoryDoc._id;
    }

    // Validate subcategory belongs to the chosen category if provided
    if (subcategory !== undefined) {
      const categoryDoc = await Category.findById(categoryIdToUse);
      const exists = (categoryDoc as any)?.subcategories?.some(
        (sc: any) => sc && sc._id && sc._id.toString() === String(subcategory),
      );
      if (!exists) {
        return NextResponse.json(
          { error: "Subcategory not found in the selected category" },
          { status: 400 },
        );
      }
      // Assign subcategory
      // Allow clearing by passing null
      if (subcategory === null) {
        (menuItem as any).subcategory = undefined;
      } else {
        (menuItem as any).subcategory = subcategory;
      }
    }

    // Handle slug uniqueness if provided
    if (slug) {
      const existing = await MenuItem.findOne({
        user: decoded.userId,
        slug,
        _id: { $ne: id },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Menu item slug already exists" },
          { status: 409 }
        );
      }
      menuItem.slug = slug;
    }

    // Assign other fields
    if (name !== undefined) menuItem.name = name;
    if (nameEn !== undefined) menuItem.nameEn = nameEn;
    if (description !== undefined) menuItem.description = description;
    if (descriptionEn !== undefined) menuItem.descriptionEn = descriptionEn;
    if (images !== undefined) menuItem.images = images || [];
    if (price !== undefined) menuItem.price = price;
    if (originalPrice !== undefined) menuItem.originalPrice = originalPrice;
    if (currency !== undefined) menuItem.currency = currency;
    if (preparationTime !== undefined) menuItem.preparationTime = preparationTime;
    if (calories !== undefined) menuItem.calories = calories;
    if (servingSize !== undefined) menuItem.servingSize = servingSize;
    if (ingredients !== undefined) menuItem.ingredients = ingredients || [];
    if (nutritionFacts !== undefined) menuItem.nutritionFacts = nutritionFacts || {};
    if (allergens !== undefined) menuItem.allergens = allergens || [];
    if (dietaryInfo !== undefined) menuItem.dietaryInfo = dietaryInfo || [];
    if (spicyLevel !== undefined) menuItem.spicyLevel = spicyLevel || 0;
    if (isVegetarian !== undefined) menuItem.isVegetarian = !!isVegetarian;
    if (isVegan !== undefined) menuItem.isVegan = !!isVegan;
    if (isGlutenFree !== undefined) menuItem.isGlutenFree = !!isGlutenFree;
    if (isHalal !== undefined) menuItem.isHalal = !!isHalal;
    if (isSpecial !== undefined) menuItem.isSpecial = !!isSpecial;
    if (isFeatured !== undefined) menuItem.isFeatured = !!isFeatured;
    if (isPopular !== undefined) menuItem.isPopular = !!isPopular;
    if (isNew !== undefined) menuItem.isNew = !!isNew;
    if (variants !== undefined) menuItem.variants = variants || [];
    if (addons !== undefined) menuItem.addons = addons || [];
    if (order !== undefined) menuItem.order = order || 0;
    if (isActive !== undefined) menuItem.isActive = !!isActive;
    if (isAvailable !== undefined) menuItem.isAvailable = !!isAvailable;
    if (stockQuantity !== undefined) menuItem.stockQuantity = stockQuantity;
    if (isUnlimited !== undefined) menuItem.isUnlimited = !!isUnlimited;
    if (availableFrom !== undefined) menuItem.availableFrom = availableFrom;
    if (availableUntil !== undefined) menuItem.availableUntil = availableUntil;
    if (availableDays !== undefined) menuItem.availableDays = availableDays || [];
    if (tags !== undefined) menuItem.tags = tags || [];
    if (seo !== undefined) menuItem.seo = seo || {};

    await menuItem.save();

    await menuItem.populate([
      { path: "user", select: "firstName lastName email" },
      { path: "category", select: "name slug" },
    ]);

    return NextResponse.json(
      { message: "Menu item updated successfully", menuItem },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update menu item error:", error);
    const errorResponse = handleApiError(error);
    return NextResponse.json(
      { error: errorResponse.error, details: errorResponse.details },
      { status: errorResponse.statusCode }
    );
  }
}

// DELETE /api/menu-items/[id] - Delete a menu item
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const decoded = await verifyToken(request);
    const { id } = await context.params;

    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }
    if (menuItem.user.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: "Menu item does not belong to you" },
        { status: 403 }
      );
    }

    await MenuItem.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Menu item deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete menu item error:", error);
    const errorResponse = handleApiError(error);
    return NextResponse.json(
      { error: errorResponse.error, details: errorResponse.details },
      { status: errorResponse.statusCode }
    );
  }
}