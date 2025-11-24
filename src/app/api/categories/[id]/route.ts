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

// PUT /api/categories/[id] - Update a category
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const decoded = await verifyToken(request);
    const { id } = await context.params;

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (category.user.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: "Category does not belong to you" },
        { status: 403 }
      );
    }

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
      subcategories,
      seo,
    } = body;

    // Update slug uniqueness check within user's categories (excluding current)
    if (slug) {
      const existingCategory = await Category.findOne({
        user: decoded.userId,
        slug,
        _id: { $ne: id },
      });
      if (existingCategory) {
        return NextResponse.json(
          { error: "Category slug already exists" },
          { status: 409 }
        );
      }
    }

    // Assign simple fields
    if (name !== undefined) category.name = name;
    if (nameEn !== undefined) category.nameEn = nameEn;
    if (description !== undefined) category.description = description;
    if (descriptionEn !== undefined) category.descriptionEn = descriptionEn;
    if (slug !== undefined) category.slug = slug;
    if (image !== undefined) category.image = image;
    if (icon !== undefined) category.icon = icon;
    if (order !== undefined) category.order = order;
    if (isActive !== undefined) category.isActive = !!isActive;
    if (isVisible !== undefined) category.isVisible = !!isVisible;
    if (availableFrom !== undefined) category.availableFrom = availableFrom;
    if (availableUntil !== undefined) category.availableUntil = availableUntil;
    if (availableDays !== undefined) category.availableDays = availableDays;
    if (seo !== undefined) category.seo = seo || {};

    // Process subcategories replacement if provided (only name_fa and name_en)
    if (Array.isArray(subcategories)) {
      const prepared = subcategories
        .filter((s: any) => s && typeof s.name_fa === "string" && s.name_fa.trim().length > 0)
        .map((s: any) => ({
          name_fa: s.name_fa.trim(),
          name_en: typeof s.name_en === "string" ? s.name_en.trim() : "",
        }));
      category.subcategories = prepared;
    }

    await category.save();

    await category.populate("user", "firstName lastName email");

    return NextResponse.json(
      { message: "Category updated successfully", category },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update category error:", error);
    const errorResponse = handleApiError(error);
    return NextResponse.json(
      { error: errorResponse.error, details: errorResponse.details },
      { status: errorResponse.statusCode }
    );
  }
}

// DELETE /api/categories/[id] - Delete a category (if no items)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const decoded = await verifyToken(request);
    const { id } = await context.params;

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (category.user.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: "Category does not belong to you" },
        { status: 403 }
      );
    }

    const itemsCount = await MenuItem.countDocuments({
      user: decoded.userId,
      category: id,
    });
    if (itemsCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with existing menu items" },
        { status: 400 }
      );
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete category error:", error);
    const errorResponse = handleApiError(error);
    return NextResponse.json(
      { error: errorResponse.error, details: errorResponse.details },
      { status: errorResponse.statusCode }
    );
  }
}