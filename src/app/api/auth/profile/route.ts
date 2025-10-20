import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connection";
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

// GET /api/auth/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const decoded = await verifyToken(request);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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
        businessProfile: user.businessProfile,
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
      { status: errorResponse.statusCode },
    );
  }
}

// PUT /api/auth/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

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

    // Update business profile if provided
    if (business) {
      user.business = {
        ...user.business,
        ...business,
      };
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
        business: user.business,
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
      { status: errorResponse.statusCode },
    );
  }
}

// PATCH /api/auth/profile - Partial update user profile
export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();

    const decoded = await verifyToken(request);
    const body = await request.json();

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: body },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
        business: updatedUser.business,
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
      { status: errorResponse.statusCode },
    );
  }
}
