// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Clear all cookies
    (
      await // Clear all cookies
      cookies()
    )
      .getAll()
      .forEach(async (cookie) => {
        (await cookies()).delete(cookie.name);
      });

    // Alternatively, clear specific cookies if you know their names
    // cookies().delete('session-token');
    // cookies().delete('refresh-token');

    return NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Logout failed" },
      { status: 500 }
    );
  }
}
