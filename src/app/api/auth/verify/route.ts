import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connection";
import User from "@/lib/models/User";
import jwt from "jsonwebtoken";
import { handleApiError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get token from header
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    ) as any;

    // Find user
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
        business: user.business,
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
      { status: errorResponse.statusCode },
    );
  }
}
