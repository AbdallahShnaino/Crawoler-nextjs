"use server";

export type SubmitUserStatus =
  | {
      success: false;
      message: string;
      error: string;
    }
  | {
      success: true;
      message: string;
      error?: string;
    };

export async function submitUser(
  state: SubmitUserStatus,
  formData: FormData
): Promise<SubmitUserStatus> {
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
      message: "Username must contain only letters",
      error: "Username must contain only letters",
    };
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    return {
      success: false,
      message:
        "Password must be at least 8 characters with at least one letter and one number",
      error:
        "Password must be at least 8 characters with at least one letter and one number",
    };
  }

  try {
    await signup(username, password);
    return {
      success: true,
      message: "User signed up and logged in successfully",
      error: undefined,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
      error: (error as Error).message,
    };
  }
}

async function signup(username: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error || "Signup failed");
  return data;
}
