"use server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export interface DecodedToken {
  sub?: number;
}

export interface AuthUser {
  username?: string;
  id: number;
  token: string;
}

export async function getUserIdFromToken(
  token: string | null
): Promise<AuthUser | null> {
  if (!token) return null;

  try {
    const decodedToken = jwt.decode(token) as DecodedToken | null;

    if (decodedToken) {
      return {
        id: Number(decodedToken.sub) || -1,
        username: "",
        token: token || "",
      };
    }
  } catch {
    throw new Error("CODE:1009");
  }
  return null;
}

export async function requireAuth(): Promise<AuthUser> {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  let data;
  if (token) {
    data = await getUserIdFromToken(token);
  }
  if (!data) {
    redirect("/login");
  }

  return data;
}
