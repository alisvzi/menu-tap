import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import Provider from "@/lib/models/Provider";
import Category from "@/lib/models/Category";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ providerId: string }> }
) {
  try {
    await connectDB();

    const { providerId } = await context.params;
    let providerQuery: any = { _id: providerId };
    const isObjectId = /^[a-fA-F0-9]{24}$/.test(providerId);
    if (!isObjectId) {
      providerQuery = { slug: providerId };
    }

    const provider = await Provider.findOne({
      ...providerQuery,
      isActive: true,
    }).select("_id name nameEn user");

    if (!provider) {
      return NextResponse.json(
        { success: false, message: "Provider not found" },
        { status: 404 }
      );
    }

    const categories = await Category.find({
      provider: provider._id,
      isVisible: true,
    })
      .select("name nameEn description descriptionEn slug image icon order subcategories isActive isVisible createdAt")
      .sort({ order: 1, createdAt: 1 });

    return NextResponse.json({
      success: true,
      data: {
        provider: {
          name: provider.name,
          nameEn: provider.nameEn,
        },
        categories: categories.map((category: any) => ({
          _id: category._id,
          name: category.name,
          nameEn: category.nameEn,
          description: category.description,
          descriptionEn: category.descriptionEn,
          slug: category.slug,
          image: category.image,
          icon: category.icon,
          order: category.order,
          isActive: category.isActive,
          isVisible: category.isVisible,
          createdAt: category.createdAt,
          subcategories: category.subcategories || []
        }))
      }
    });

  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}