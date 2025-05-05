"use server";
import { cookies } from "next/headers";

export type LoginUserStatus =
  | {
      success: false;
      message: string;
      error: string;
    }
  | {
      success: true;
      message: string;
      error?: string;
      username?: string;
      id?: number;
    };

export async function loginUser(
  state: LoginUserStatus,
  formData: FormData
): Promise<LoginUserStatus> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  if (!username || !password) {
    return {
      success: false,
      message: "Please fill all the fields",
      error: "Please fill all the fields",
    };
  }
  const usernameRegex = /^[A-Za-z]+$/;
  if (!usernameRegex.test(username)) {
    return {
      success: false,
      message: "Invalid username format",
      error: "Invalid username format",
    };
  }

  try {
    const op = await login(username, password);
    const cookieStore = await cookies();
    cookieStore.set("token", op.access_token, {
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "strict",
    });
    cookieStore.set("username", op.user.username, {
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "strict",
    });

    return {
      success: true,
      message: "Login Successfully",
      username: op.user.username,
      id: op.user.id,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
      error: (error as Error).message,
    };
  }
}
async function login(username: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "(server) Login failed");
  return data;
}
